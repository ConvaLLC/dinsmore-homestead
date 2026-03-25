import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function DonateConfirmPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const paypalOrderId = params.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const captureOrder = trpc.donations.captureOrder.useMutation();

  useEffect(() => {
    if (!paypalOrderId) { setStatus("error"); return; }
    captureOrder.mutateAsync({ paypalOrderId })
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") return (
    <div className="py-24 text-center">
      <Loader2 size={48} style={{ color: "oklch(38% 0.12 22)", margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
      <h2>Processing Your Donation...</h2>
    </div>
  );

  if (status === "error") return (
    <div className="py-24 text-center container">
      <XCircle size={56} style={{ color: "oklch(50% 0.18 25)", margin: "0 auto 1rem" }} />
      <h2>Donation Could Not Be Processed</h2>
      <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(46% 0.06 56)", maxWidth: "500px", margin: "0 auto 1.5rem" }}>
        Please contact us at info@dinsmorefarm.org if you believe this is an error.
      </p>
      <Link href="/donate" className="btn-vintage inline-block">Try Again</Link>
    </div>
  );

  return (
    <div className="py-16" style={{ background: "oklch(96% 0.018 80)" }}>
      <div className="container" style={{ maxWidth: "600px" }}>
        <div className="card-vintage p-8 text-center">
          <CheckCircle size={56} style={{ color: "oklch(35% 0.08 155)", margin: "0 auto 1rem" }} />
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Thank You!</h1>
          <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(46% 0.06 56)", marginBottom: "1.5rem" }}>
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
