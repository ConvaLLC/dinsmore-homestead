import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

// ── Helpers ──────────────────────────────────────────────────────────────────

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

function createUserContext(overrides: Partial<AuthenticatedUser> = {}): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-openid",
    email: "user@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    educationVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return createUserContext({ role: "admin", openId: "admin-openid", id: 99 });
}

// ── Auth Tests ────────────────────────────────────────────────────────────────

describe("auth.me", () => {
  it("returns null for unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user for authenticated users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    const result = await caller.auth.me();
    expect(result).not.toBeNull();
    expect(result?.email).toBe("user@example.com");
    expect(result?.role).toBe("user");
  });

  it("returns admin user with correct role", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.auth.me();
    expect(result?.role).toBe("admin");
  });
});

describe("auth.logout", () => {
  it("clears session cookie and returns success", async () => {
    const clearedCookies: { name: string; options: Record<string, unknown> }[] = [];
    const ctx: TrpcContext = {
      user: createUserContext().user,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {
        clearCookie: (name: string, options: Record<string, unknown>) => {
          clearedCookies.push({ name, options });
        },
      } as unknown as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
    expect(clearedCookies[0]?.options).toMatchObject({ maxAge: -1 });
  });
});

// ── Hero Slides Tests ─────────────────────────────────────────────────────────

describe("heroSlides.list", () => {
  it("returns an array (public access)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.heroSlides.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("heroSlides.create (admin only)", () => {
  it("throws FORBIDDEN for non-admin users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(
      caller.heroSlides.create({ imageUrl: "https://example.com/img.jpg", sortOrder: 0 })
    ).rejects.toThrow();
  });
});

// ── Events Tests ──────────────────────────────────────────────────────────────

describe("events.list", () => {
  it("returns an array of active events (public access)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.events.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("events.adminList (admin only)", () => {
  it("throws UNAUTHORIZED for unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.events.adminList()).rejects.toThrow();
  });

  it("throws FORBIDDEN for regular users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.events.adminList()).rejects.toThrow();
  });
});

describe("events.create (admin only)", () => {
  it("throws FORBIDDEN for non-admin users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(
      caller.events.create({
        title: "Test Event",
        slug: "test-event",
        eventType: "tour",
        startDate: "2026-06-01T10:00:00Z",
        price: "10.00",
        maxCapacity: 20,
      })
    ).rejects.toThrow();
  });
});

// ── Timeslots Tests ───────────────────────────────────────────────────────────

describe("timeslots.forEvent", () => {
  it("returns an array for a given event ID (public access)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.timeslots.forEvent({ eventId: 999999 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("timeslots.create (admin only)", () => {
  it("throws FORBIDDEN for regular users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(
      caller.timeslots.create({
        eventId: 1,
        slotDate: new Date("2026-06-01"),
        startTime: "10:00",
        capacity: 20,
      })
    ).rejects.toThrow();
  });
});

// ── Tickets Tests ─────────────────────────────────────────────────────────────

describe("tickets.adminList (admin only)", () => {
  it("throws UNAUTHORIZED for unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.tickets.adminList()).rejects.toThrow();
  });

  it("throws FORBIDDEN for regular users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.tickets.adminList()).rejects.toThrow();
  });
});

// ── Donations Tests ───────────────────────────────────────────────────────────

describe("donations.adminList (admin only)", () => {
  it("throws UNAUTHORIZED for unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.donations.adminList()).rejects.toThrow();
  });

  it("throws FORBIDDEN for regular users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.donations.adminList()).rejects.toThrow();
  });
});

// ── Education Tests ───────────────────────────────────────────────────────────

describe("education.content", () => {
  it("returns an array for verified users", async () => {
    const caller = appRouter.createCaller(
      createUserContext({ educationVerified: true })
    );
    const result = await caller.education.content({});
    expect(Array.isArray(result)).toBe(true);
  });

  it("throws for unverified users", async () => {
    const caller = appRouter.createCaller(createUserContext({ educationVerified: false }));
    await expect(caller.education.content({})).rejects.toThrow();
  });
});

describe("education.adminList (admin only)", () => {
  it("throws FORBIDDEN for regular users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.education.adminList()).rejects.toThrow();
  });
});

describe("education.adminRequests (admin only)", () => {
  it("throws FORBIDDEN for regular users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.education.adminRequests()).rejects.toThrow();
  });
});

describe("education.adminApproveRequest (admin only)", () => {
  it("throws FORBIDDEN for regular users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(
      caller.education.adminApproveRequest({ id: 1 })
    ).rejects.toThrow();
  });
});
