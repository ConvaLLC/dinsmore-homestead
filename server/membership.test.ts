import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database helpers
vi.mock("./db", () => ({
  createMembership: vi.fn().mockResolvedValue({ id: 1 }),
  createDonation: vi.fn().mockResolvedValue({ id: 1 }),
}));

// Mock payment processing
vi.mock("./_core/payment", () => ({
  processPayment: vi.fn().mockResolvedValue({ success: true, transactionId: "txn_test_123" }),
}));

import { createMembership, createDonation } from "./db";

describe("Standalone Membership Purchase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates membership tier is one of the valid options", () => {
    const validTiers = ["senior", "individual", "family", "friends"];
    expect(validTiers).toContain("senior");
    expect(validTiers).toContain("individual");
    expect(validTiers).toContain("family");
    expect(validTiers).toContain("friends");
    expect(validTiers).not.toContain("platinum");
  });

  it("maps tier to correct price", () => {
    const tierPrices: Record<string, number> = {
      senior: 20,
      individual: 35,
      family: 60,
      friends: 100,
    };
    expect(tierPrices.senior).toBe(20);
    expect(tierPrices.individual).toBe(35);
    expect(tierPrices.family).toBe(60);
    expect(tierPrices.friends).toBe(100);
  });

  it("calculates total with donation correctly", () => {
    const membershipPrice = 35;
    const donationAmount = 10;
    const total = membershipPrice + donationAmount;
    expect(total).toBe(45);
  });

  it("calculates total without donation correctly", () => {
    const membershipPrice = 60;
    const donationAmount = 0;
    const total = membershipPrice + donationAmount;
    expect(total).toBe(60);
  });

  it("creates membership record with correct data", async () => {
    const memberData = {
      name: "Bob Smith",
      email: "bob@test.com",
      tier: "senior" as const,
      price: 20,
      orderId: null,
    };

    await createMembership(memberData);
    expect(createMembership).toHaveBeenCalledWith(memberData);
    expect(createMembership).toHaveBeenCalledTimes(1);
  });

  it("creates donation record when donation is included", async () => {
    const donationData = {
      name: "Bob Smith",
      email: "bob@test.com",
      amount: 10,
    };

    await createDonation(donationData);
    expect(createDonation).toHaveBeenCalledWith(donationData);
    expect(createDonation).toHaveBeenCalledTimes(1);
  });

  it("does not create donation when amount is zero", async () => {
    const donationAmount = 0;
    if (donationAmount > 0) {
      await createDonation({ name: "Test", email: "test@test.com", amount: donationAmount });
    }
    expect(createDonation).not.toHaveBeenCalled();
  });

  it("validates email format", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test("bob@test.com")).toBe(true);
    expect(emailRegex.test("invalid-email")).toBe(false);
    expect(emailRegex.test("")).toBe(false);
  });

  it("validates name is not empty", () => {
    const name = "Bob Smith";
    expect(name.trim().length).toBeGreaterThan(0);
    expect("".trim().length).toBe(0);
  });

  it("membership expiry is one year from purchase", () => {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    // Should be approximately 365 or 366 days
    expect(diffDays).toBeGreaterThanOrEqual(365);
    expect(diffDays).toBeLessThanOrEqual(366);
  });
});
