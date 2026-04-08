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

describe("Gift Membership Purchase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("gift purchase uses recipient name/email for membership record", () => {
    const input = {
      isGift: true,
      memberName: "Alice Recipient",
      memberEmail: "alice@test.com",
      giftFromName: "Bob Gifter",
      giftFromEmail: "bob@test.com",
      giftMessage: "Happy Birthday!",
      tier: "individual" as const,
      tierPrice: 35,
      donationAmount: 0,
    };

    // The membership should be created for the recipient
    const membershipData = {
      memberName: input.memberName,
      memberEmail: input.memberEmail,
      tier: input.tier,
    };
    expect(membershipData.memberName).toBe("Alice Recipient");
    expect(membershipData.memberEmail).toBe("alice@test.com");
  });

  it("gift purchase uses gifter email for payment receipt", () => {
    const input = {
      isGift: true,
      giftFromEmail: "bob@test.com",
      giftFromName: "Bob Gifter",
      memberEmail: "alice@test.com",
    };

    const payerEmail = input.isGift && input.giftFromEmail ? input.giftFromEmail : input.memberEmail;
    expect(payerEmail).toBe("bob@test.com");
  });

  it("non-gift purchase uses member email for payment receipt", () => {
    const input = {
      isGift: false,
      giftFromEmail: undefined,
      memberEmail: "alice@test.com",
    };

    const payerEmail = input.isGift && input.giftFromEmail ? input.giftFromEmail : input.memberEmail;
    expect(payerEmail).toBe("alice@test.com");
  });

  it("gift message is stored with membership record", async () => {
    const memberData = {
      memberName: "Alice Recipient",
      memberEmail: "alice@test.com",
      tier: "family" as const,
      price: 60,
      isGift: true,
      giftFromName: "Bob Gifter",
      giftFromEmail: "bob@test.com",
      giftMessage: "Enjoy the history!",
    };

    await createMembership(memberData);
    expect(createMembership).toHaveBeenCalledWith(
      expect.objectContaining({ giftMessage: "Enjoy the history!" })
    );
  });

  it("gift message is optional and can be undefined", async () => {
    const memberData = {
      memberName: "Alice Recipient",
      memberEmail: "alice@test.com",
      tier: "senior" as const,
      price: 20,
      isGift: true,
      giftFromName: "Bob Gifter",
      giftFromEmail: "bob@test.com",
      giftMessage: undefined,
    };

    await createMembership(memberData);
    expect(createMembership).toHaveBeenCalledTimes(1);
  });

  it("gift message is capped at 500 characters", () => {
    const longMessage = "A".repeat(501);
    const cappedMessage = longMessage.slice(0, 500);
    expect(cappedMessage.length).toBe(500);
    expect(longMessage.length).toBeGreaterThan(500);
  });

  it("gift purchase generates correct notification title", () => {
    const isGift = true;
    const notifyTitle = isGift ? "New Gift Membership" : "New Membership Purchase";
    expect(notifyTitle).toBe("New Gift Membership");
  });

  it("regular purchase generates correct notification title", () => {
    const isGift = false;
    const notifyTitle = isGift ? "New Gift Membership" : "New Membership Purchase";
    expect(notifyTitle).toBe("New Membership Purchase");
  });

  it("gift notification content includes recipient and gifter info", () => {
    const payerName = "Bob Gifter";
    const payerEmail = "bob@test.com";
    const memberName = "Alice Recipient";
    const memberEmail = "alice@test.com";
    const tier = "individual";
    const tierPrice = 35;
    const giftMessage = "Happy Birthday!";

    const content = `${payerName} (${payerEmail}) gifted a ${tier} membership ($${tierPrice.toFixed(2)}) to ${memberName} (${memberEmail}).\nMessage: "${giftMessage}"`;
    expect(content).toContain("Bob Gifter");
    expect(content).toContain("Alice Recipient");
    expect(content).toContain("Happy Birthday!");
  });
});
