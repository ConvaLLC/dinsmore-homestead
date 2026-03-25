import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { IMAGES } from "../../../shared/images";
import { Heart, Shield, Users, BookOpen, Hammer } from "lucide-react";
import { toast } from "sonner";

const PRESET_AMOUNTS = [25, 50, 100, 250, 500];

const IMPACT = [
  { icon: <Hammer size={20} />, amount: "$25", desc: "Helps maintain and repair historic outbuildings" },
  { icon: <BookOpen size={20} />, amount: "$50", desc: "Funds one school group visit and educational program" },
  { icon: <Shield size={20} />, amount: "$100", desc: "Supports conservation of a historic artifact or document" },
  { icon: <Users size={20} />, amount: "$250", desc: "Sponsors a major preservation project or restoration effort" },
];

const MEMBERSHIP_LEVELS = [
  { name: "Friend", price: "$35/year", perks: ["Free admission for 1 adult", "10% off in gift shop", "Newsletter subscription"] },
  { name: "Family", price: "$65/year", perks: ["Free admission for family (2 adults + children)", "10% off in gift shop", "Invitations to member events"] },
  { name: "Patron", price: "$150/year", perks: ["All Family benefits", "Recognition in annual report", "Behind-the-scenes tour"] },
  { name: "Benefactor", price: "$500/year", perks: ["All Patron benefits", "Named recognition on donor wall", "Private event access"] },
];

export default function DonatePage() {
  const [amount, setAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createDonation = trpc.donations.createOrder.useMutation();

  const finalAmount = customAmount ? parseFloat(customAmount) : amount;

  const handleDonate = async () => {
    if (!donorName || !donorEmail) {
      toast.error("Please enter your name and email address");
      return;
    }
    if (!finalAmount || finalAmount < 1) {
      toast.error("Please enter a valid donation amount");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await createDonation.mutateAsync({
        amount: String(finalAmount),
        donorName: isAnonymous ? "Anonymous" : donorName,
        donorEmail,
        message,
        anonymous: isAnonymous,
        origin: window.location.origin,
      });
      if (result.approvalUrl) {
        window.location.href = result.approvalUrl;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to process donation. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{ height: "300px" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${IMAGES.heritageFinal})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "sepia(20%) contrast(1.05)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "oklch(22% 0.04 50 / 0.7)" }} />
        <div className="container relative h-full flex flex-col justify-end pb-10">
          <span className="section-label" style={{ color: "oklch(68% 0.12 75)" }}>
            Support Preservation
          </span>
          <h1 style={{ color: "oklch(96% 0.018 80)", marginBottom: "0.5rem" }}>
            Help Preserve Kentucky History
          </h1>
          <p
            style={{
              color: "oklch(87% 0.032 72)",
              fontFamily: "'EB Garamond', serif",
              fontSize: "1.05rem",
            }}
          >
            Your generosity keeps this irreplaceable historic treasure alive for future generations
          </p>
        </div>
      </div>

      {/* Donation form */}
      <section className="py-12" style={{ background: "oklch(96% 0.018 80)" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="card-vintage p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Heart size={20} style={{ color: "oklch(38% 0.12 22)" }} />
                  <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Make a Donation</h2>
                </div>
                <div
                  style={{
                    width: "40px",
                    height: "2px",
                    background: "oklch(55% 0.11 72)",
                    marginBottom: "1.5rem",
                  }}
                />

                {/* Amount selection */}
                <div className="mb-5">
                  <label
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "oklch(46% 0.06 56)",
                      display: "block",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Select Amount
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {PRESET_AMOUNTS.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => { setAmount(preset); setCustomAmount(""); }}
                        style={{
                          padding: "0.5rem 1.25rem",
                          border: "2px solid",
                          borderColor: amount === preset && !customAmount ? "oklch(38% 0.12 22)" : "oklch(72% 0.05 62)",
                          background: amount === preset && !customAmount ? "oklch(38% 0.12 22)" : "transparent",
                          color: amount === preset && !customAmount ? "oklch(96% 0.018 80)" : "oklch(38% 0.055 54)",
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        ${preset}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1rem",
                        color: "oklch(38% 0.055 54)",
                      }}
                    >
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Other amount"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }}
                      min="1"
                      style={{
                        padding: "0.5rem 0.75rem",
                        border: "1px solid oklch(72% 0.05 62)",
                        background: "oklch(93% 0.025 75)",
                        fontFamily: "'EB Garamond', serif",
                        fontSize: "0.95rem",
                        color: "oklch(22% 0.04 50)",
                        outline: "none",
                        width: "150px",
                      }}
                    />
                  </div>
                </div>

                {/* Donor info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {[
                    { label: "Full Name *", value: donorName, setter: setDonorName, type: "text" },
                    { label: "Email Address *", value: donorEmail, setter: setDonorEmail, type: "email" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "0.7rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "oklch(46% 0.06 56)",
                          display: "block",
                          marginBottom: "0.3rem",
                        }}
                      >
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          border: "1px solid oklch(72% 0.05 62)",
                          background: "oklch(93% 0.025 75)",
                          fontFamily: "'EB Garamond', serif",
                          fontSize: "0.95rem",
                          color: "oklch(22% 0.04 50)",
                          outline: "none",
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <label
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "oklch(46% 0.06 56)",
                      display: "block",
                      marginBottom: "0.3rem",
                    }}
                  >
                    Message (optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="Leave a message with your donation..."
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      border: "1px solid oklch(72% 0.05 62)",
                      background: "oklch(93% 0.025 75)",
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.95rem",
                      color: "oklch(22% 0.04 50)",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>

                <label className="flex items-center gap-2 mb-5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    style={{ accentColor: "oklch(38% 0.12 22)" }}
                  />
                  <span
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.9rem",
                      color: "oklch(46% 0.06 56)",
                    }}
                  >
                    Make this donation anonymous
                  </span>
                </label>

                <div
                  style={{
                    background: "oklch(93% 0.025 75)",
                    border: "1px solid oklch(82% 0.04 65)",
                    padding: "0.75rem 1rem",
                    marginBottom: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.9rem",
                      color: "oklch(46% 0.06 56)",
                    }}
                  >
                    Donation Total
                  </span>
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "oklch(38% 0.12 22)",
                    }}
                  >
                    ${(finalAmount || 0).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleDonate}
                  disabled={isSubmitting}
                  className="btn-vintage-filled w-full text-center"
                  style={{ opacity: isSubmitting ? 0.7 : 1, fontSize: "0.85rem" }}
                >
                  {isSubmitting ? "Processing..." : `Donate $${(finalAmount || 0).toFixed(2)} via PayPal`}
                </button>
                <p
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "0.75rem",
                    color: "oklch(55% 0.11 72)",
                    textAlign: "center",
                    marginTop: "0.75rem",
                    fontStyle: "italic",
                  }}
                >
                  Secure payment via PayPal. The Dinsmore Homestead Foundation is a 501(c)(3) non-profit — your donation may be tax-deductible.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Impact */}
              <div className="card-vintage p-5">
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", marginBottom: "1rem" }}>
                  Your Impact
                </h3>
                <div style={{ width: "30px", height: "2px", background: "oklch(55% 0.11 72)", marginBottom: "1rem" }} />
                <div className="space-y-3">
                  {IMPACT.map((item) => (
                    <div key={item.amount} className="flex items-start gap-3">
                      <span
                        style={{
                          color: "oklch(38% 0.12 22)",
                          background: "oklch(87% 0.032 72)",
                          padding: "0.4rem",
                          borderRadius: "4px",
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </span>
                      <div>
                        <span
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: "oklch(38% 0.12 22)",
                          }}
                        >
                          {item.amount}
                        </span>
                        <p
                          style={{
                            fontFamily: "'EB Garamond', serif",
                            fontSize: "0.85rem",
                            color: "oklch(46% 0.06 56)",
                            margin: 0,
                          }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo */}
              <img
                src={IMAGES.homestead}
                alt="Dinsmore Homestead"
                className="img-vintage w-full"
                style={{ height: "180px", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Membership section */}
          <div id="membership" className="mt-16">
            <div className="text-center mb-8">
              <span className="section-label">Annual Giving</span>
              <h2>Become a Member</h2>
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "1rem",
                  color: "oklch(46% 0.06 56)",
                  maxWidth: "500px",
                  margin: "0.5rem auto 0",
                }}
              >
                Annual membership supports the Foundation's mission and gives you exclusive benefits throughout the year.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MEMBERSHIP_LEVELS.map((level) => (
                <div
                  key={level.name}
                  className="card-vintage p-5 flex flex-col"
                >
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.1rem",
                      color: "oklch(22% 0.04 50)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {level.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "oklch(38% 0.12 22)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {level.price}
                  </p>
                  <ul
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.85rem",
                      color: "oklch(46% 0.06 56)",
                      paddingLeft: "1.1rem",
                      flex: 1,
                      margin: "0 0 1rem",
                    }}
                  >
                    {level.perks.map((perk) => (
                      <li key={perk} style={{ marginBottom: "0.25rem" }}>
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="mailto:info@dinsmorefarm.org?subject=Membership Inquiry"
                    className="btn-vintage text-xs text-center block"
                  >
                    Join Now
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
