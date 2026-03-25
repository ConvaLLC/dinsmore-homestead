import { AdminNav } from "./AdminDashboard";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
export default function AdminTimeslots() {
  return (
    <div>
      <AdminNav />
      <div className="container py-8">
        <Link href="/admin/events" className="btn-vintage text-xs flex items-center gap-1 mb-4 inline-flex">
          <ArrowLeft size={12} /> Back to Events
        </Link>
        <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(46% 0.06 56)" }}>
          Manage timeslots for this event from the Events page by expanding the event row.
        </p>
      </div>
    </div>
  );
}
