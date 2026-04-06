import { Link } from "wouter";
import { CheckCircle } from "lucide-react";

export default function DonateConfirmPage() {
  return (
    <div className="py-16" style={{ background: "oklch(97.8% 0.008 89.6)" }}>
      <div className="container" style={{ maxWidth: "600px" }}>
        <div className="card-vintage p-8 text-center">
          <CheckCircle size={56} style={{ color: "oklch(47.2% 0.088 247.4)", margin: "0 auto 1rem" }} />
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Thank You!</h1>
          <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(47.2% 0.088 247.4)", marginBottom: "1.5rem" }}>
            Your generous donation to the Dinsmore Homestead Foundation has been received. 
            A receipt will be sent to your email address. Your support helps preserve this 
            irreplaceable piece of Kentucky history.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/" className="btn-vintage-filled">Return Home</Link>
            <Link href="/preservation" className="btn-vintage">Our Preservation Work</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
