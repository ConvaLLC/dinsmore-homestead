import { useState } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

export default function ConnectPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your message! We will respond within 2–3 business days.");
    setName(""); setEmail(""); setSubject(""); setMessage("");
  };

  return (
    <div>
      <div className="relative overflow-hidden" style={{ height: "240px" }}>
        <div style={{ position: "absolute", inset: 0, background: "oklch(27% 0.045 50)" }} />
        <div className="container relative h-full flex flex-col justify-end pb-8">
          <span className="section-label" style={{ color: "oklch(68% 0.12 75)" }}>Get in Touch</span>
          <h1 style={{ color: "oklch(96% 0.018 80)" }}>Contact Us</h1>
        </div>
      </div>
      <section className="py-12" style={{ background: "oklch(96% 0.018 80)" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: "Your Name *", value: name, setter: setName, type: "text" },
                  { label: "Email Address *", value: email, setter: setEmail, type: "email" },
                  { label: "Subject", value: subject, setter: setSubject, type: "text" },
                ].map((field) => (
                  <div key={field.label}>
                    <label style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(46% 0.06 56)", display: "block", marginBottom: "0.3rem" }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      required={field.label.includes("*")}
                      style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid oklch(72% 0.05 62)", background: "oklch(93% 0.025 75)", fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: "oklch(22% 0.04 50)", outline: "none" }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(46% 0.06 56)", display: "block", marginBottom: "0.3rem" }}>
                    Message *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid oklch(72% 0.05 62)", background: "oklch(93% 0.025 75)", fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: "oklch(22% 0.04 50)", outline: "none", resize: "vertical" }}
                  />
                </div>
                <button type="submit" className="btn-vintage-filled">Send Message</button>
              </form>
            </div>
            <div className="space-y-6">
              <div className="card-vintage p-5">
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", marginBottom: "1rem" }}>Contact Information</h3>
                <div className="space-y-3">
                  {[
                    { icon: <MapPin size={16} />, text: "5656 Burlington Pike, Burlington, KY 41005" },
                    { icon: <Phone size={16} />, text: "(859) 386-2631" },
                    { icon: <Mail size={16} />, text: "info@dinsmorefarm.org" },
                    { icon: <Clock size={16} />, text: "Wed–Sun, April–December" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span style={{ color: "oklch(55% 0.11 72)", marginTop: "0.15rem", flexShrink: 0 }}>{item.icon}</span>
                      <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: "oklch(38% 0.055 54)" }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
