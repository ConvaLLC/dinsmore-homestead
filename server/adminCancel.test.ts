import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@dinsmore.org",
    name: "Admin Staff",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

function createUserContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

// Mock the db module
vi.mock("./db", async () => {
  const actual = await vi.importActual("./db");

  // Simulated order store
  const mockOrder = {
    id: 42,
    orderNumber: "DHM-TEST-123",
    eventId: 1,
    timeslotId: 10,
    buyerName: "Jane Doe",
    buyerEmail: "jane@test.com",
    buyerPhone: null,
    quantity: 3,
    unitPrice: "7.67",
    totalAmount: "68.00",
    paypalOrderId: "SANDBOX-123",
    paypalCaptureId: "SANDBOX-123",
    status: "paid",
    notes: "Adult x2, Child x1 | Membership: individual ($35.00)",
    cancelledAt: null,
    cancelledBy: null,
    cancelReason: null,
    refundAmount: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const cancelledOrder = {
    ...mockOrder,
    id: 99,
    orderNumber: "DHM-ALREADY-CANCELLED",
    status: "cancelled",
  };

  let orderState = { ...mockOrder };

  return {
    ...(actual as any),
    getTicketOrderById: vi.fn(async (id: number) => {
      if (id === 42) return { ...orderState };
      if (id === 99) return { ...cancelledOrder };
      return undefined;
    }),
    updateTicketOrder: vi.fn(async (id: number, data: any) => {
      if (id === 42) {
        orderState = { ...orderState, ...data };
      }
    }),
    decrementTimeslotSold: vi.fn(async () => {}),
    getMembershipByOrderId: vi.fn(async (orderId: number) => {
      if (orderId === 42) return { id: 1, orderId: 42, tier: "individual", status: "active" };
      return undefined;
    }),
    cancelMembershipByOrderId: vi.fn(async () => {}),
    getAllTicketOrders: vi.fn(async () => []),
  };
});

// Mock notification
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(async () => true),
}));

describe("tickets.adminCancel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects non-admin users", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.tickets.adminCancel({ orderId: 42, reason: "test", issueRefund: true })
    ).rejects.toThrow(/admin/i);
  });

  it("returns NOT_FOUND for non-existent order", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.tickets.adminCancel({ orderId: 999, reason: "test", issueRefund: true })
    ).rejects.toThrow(/not found/i);
  });

  it("rejects cancelling an already cancelled order", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.tickets.adminCancel({ orderId: 99, reason: "test", issueRefund: true })
    ).rejects.toThrow(/already cancelled/i);
  });

  it("cancels a paid order with refund and restores capacity", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tickets.adminCancel({
      orderId: 42,
      reason: "Customer requested cancellation",
      issueRefund: true,
    });

    expect(result.success).toBe(true);
    expect(result.orderNumber).toBe("DHM-TEST-123");
    expect(result.newStatus).toBe("refunded");
    expect(result.refundAmount).toBe(68);
    expect(result.membershipCancelled).toBe(true);

    // Verify db calls were made
    const { decrementTimeslotSold, cancelMembershipByOrderId, updateTicketOrder } = await import("./db");
    expect(decrementTimeslotSold).toHaveBeenCalledWith(10, 3);
    expect(cancelMembershipByOrderId).toHaveBeenCalledWith(42);
    expect(updateTicketOrder).toHaveBeenCalledWith(42, expect.objectContaining({
      status: "refunded",
      cancelReason: "Customer requested cancellation",
      refundAmount: "68.00",
    }));
  });

  it("cancels without refund when issueRefund is false", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Reset mock state
    const { getTicketOrderById } = await import("./db");
    (getTicketOrderById as any).mockResolvedValueOnce({
      id: 42,
      orderNumber: "DHM-TEST-123",
      eventId: 1,
      timeslotId: 10,
      buyerName: "Jane Doe",
      buyerEmail: "jane@test.com",
      quantity: 3,
      totalAmount: "68.00",
      status: "paid",
      notes: "test",
    });

    const result = await caller.tickets.adminCancel({
      orderId: 42,
      reason: "No-show, no refund per policy",
      issueRefund: false,
    });

    expect(result.success).toBe(true);
    expect(result.newStatus).toBe("cancelled");
    expect(result.refundAmount).toBe(0);
  });

  it("requires a non-empty reason", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.tickets.adminCancel({ orderId: 42, reason: "", issueRefund: true })
    ).rejects.toThrow();
  });
});
