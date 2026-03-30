import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AdminNav } from "./AdminDashboard";
import { Plus, Edit2, Trash2, Clock, Ticket, ChevronDown, ChevronUp, X, Check, Lock, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

const EVENT_TYPES = ["tour", "special_event", "fundraiser", "program", "private"] as const;
type EventType = typeof EVENT_TYPES[number];

type EventForm = {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string;
  price: string;
  maxCapacity: string;
  imageUrl: string;
  active: boolean;
  featured: boolean;
};

const emptyForm: EventForm = {
  title: "", slug: "", description: "", shortDescription: "",
  eventType: "tour" as EventType, startDate: "", endDate: "", location: "Dinsmore Homestead, Burlington, KY",
  price: "0", maxCapacity: "20", imageUrl: "", active: true, featured: false,
};

type TimeslotForm = {
  slotDate: string;
  startTime: string;
  endTime: string;
  capacity: string;
  price: string;
};

const emptyTimeslot: TimeslotForm = { slotDate: "", startTime: "10:00", endTime: "11:00", capacity: "20", price: "" };

export default function AdminEvents() {
  const { user, isAuthenticated } = useAuth();
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [showTimeslotForm, setShowTimeslotForm] = useState<number | null>(null);
  const [timeslotForm, setTimeslotForm] = useState<TimeslotForm>(emptyTimeslot);

  const utils = trpc.useUtils();
  const { data: events, isLoading } = trpc.events.adminList.useQuery();
  const { data: timeslots } = trpc.timeslots.forEvent.useQuery(
    { eventId: expandedEvent! },
    { enabled: expandedEvent !== null }
  );

  const createEvent = trpc.events.create.useMutation({ onSuccess: () => { utils.events.adminList.invalidate(); setShowForm(false); setForm(emptyForm); toast.success("Event created!"); } });
  const updateEvent = trpc.events.update.useMutation({ onSuccess: () => { utils.events.adminList.invalidate(); setShowForm(false); setEditingId(null); setForm(emptyForm); toast.success("Event updated!"); } });
  const deleteEvent = trpc.events.delete.useMutation({ onSuccess: () => { utils.events.adminList.invalidate(); toast.success("Event deleted."); } });
  const createTimeslot = trpc.timeslots.create.useMutation({ onSuccess: () => { utils.timeslots.forEvent.invalidate(); setShowTimeslotForm(null); setTimeslotForm(emptyTimeslot); toast.success("Timeslot added!"); } });
  const deleteTimeslot = trpc.timeslots.delete.useMutation({ onSuccess: () => { utils.timeslots.forEvent.invalidate(); toast.success("Timeslot removed."); } });

  if (!isAuthenticated || (user as any)?.role !== "admin") {
    return (
      <div className="py-24 text-center container">
        <Lock size={48} style={{ color: "oklch(55% 0.11 72)", margin: "0 auto 1rem" }} />
        <h2>Admin Access Required</h2>
        <a href={getLoginUrl()} className="btn-vintage-filled">Sign In</a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.startDate) {
      toast.error("Title, slug, and start date are required.");
      return;
    }
    const basePayload = {
      title: form.title,
      slug: form.slug,
      description: form.description || undefined,
      shortDescription: form.shortDescription || undefined,
      imageUrl: form.imageUrl || undefined,
      eventType: form.eventType as EventType,
      basePrice: form.price || "0.00",
      startDate: new Date(form.startDate),
      endDate: form.endDate ? new Date(form.endDate) : undefined,
      defaultCapacity: parseInt(form.maxCapacity) || 20,
      usesTimeslots: true,
      active: form.active,
      featured: form.featured,
    };
    try {
      if (editingId) {
        await updateEvent.mutateAsync({ id: editingId, ...basePayload });
      } else {
        await createEvent.mutateAsync(basePayload);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to save event.");
    }
  };

  const handleEdit = (event: any) => {
    setForm({
      title: event.title,
      slug: event.slug,
      description: event.description || "",
      shortDescription: event.shortDescription || "",
      eventType: event.eventType,
      startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
      endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
      location: event.location || "",
      price: event.price || "0",
      maxCapacity: String(event.maxCapacity || 20),
      imageUrl: event.imageUrl || "",
      active: event.active,
      featured: event.featured,
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleAddTimeslot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showTimeslotForm) return;
    await createTimeslot.mutateAsync({
      eventId: showTimeslotForm,
      slotDate: new Date(timeslotForm.slotDate),
      startTime: timeslotForm.startTime,
      endTime: timeslotForm.endTime || undefined,
      capacity: parseInt(timeslotForm.capacity),
      price: timeslotForm.price || undefined,
    });
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem 0.75rem",
    border: "1px solid oklch(72% 0.05 62)",
    background: "oklch(93% 0.025 75)",
    fontFamily: "'EB Garamond', serif",
    fontSize: "0.9rem",
    color: "oklch(22% 0.04 50)",
    outline: "none",
  };

  const labelStyle = {
    fontFamily: "'Playfair Display', serif",
    fontSize: "0.65rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "oklch(46% 0.06 56)",
    display: "block" as const,
    marginBottom: "0.25rem",
  };

  return (
    <div>
      <AdminNav />
      <div className="py-8" style={{ background: "oklch(96% 0.018 80)", minHeight: "calc(100vh - 120px)" }}>
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="section-label">Admin</span>
              <h2 style={{ fontSize: "1.75rem" }}>Manage Events</h2>
            </div>
            <button
              onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
              className="btn-vintage-filled flex items-center gap-2"
            >
              <Plus size={16} /> New Event
            </button>
          </div>

          {/* Event Form */}
          {showForm && (
            <div className="card-vintage p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", margin: 0 }}>
                  {editingId ? "Edit Event" : "Create New Event"}
                </h3>
                <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} style={{ background: "none", border: "none", cursor: "pointer", color: "oklch(55% 0.11 72)" }}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {[
                    { label: "Event Title *", key: "title", type: "text" },
                    { label: "URL Slug *", key: "slug", type: "text" },
                    { label: "Location", key: "location", type: "text" },
                    { label: "Base Price ($)", key: "price", type: "text" },
                    { label: "Max Capacity", key: "maxCapacity", type: "number" },
                    { label: "Image URL", key: "imageUrl", type: "text" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label style={labelStyle}>{field.label}</label>
                      <input
                        type={field.type}
                        value={(form as any)[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={labelStyle}>Event Type *</label>
                    <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} style={inputStyle}>
                      {EVENT_TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Start Date & Time *</label>
                    <input type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>End Date & Time</label>
                    <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} style={inputStyle} />
                  </div>
                </div>
                <div className="mb-4">
                  <label style={labelStyle}>Short Description</label>
                  <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} style={inputStyle} />
                </div>
                <div className="mb-4">
                  <label style={labelStyle}>Full Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
                </div>
                <div className="flex gap-4 mb-4">
                  {[
                    { key: "active", label: "Active (visible on site)" },
                    { key: "featured", label: "Featured on homepage" },
                  ].map((toggle) => (
                    <label key={toggle.key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={(form as any)[toggle.key]} onChange={(e) => setForm({ ...form, [toggle.key]: e.target.checked })} style={{ accentColor: "oklch(38% 0.12 22)" }} />
                      <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(38% 0.055 54)" }}>{toggle.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-vintage-filled flex items-center gap-2">
                    <Check size={14} /> {editingId ? "Save Changes" : "Create Event"}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-vintage">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Events list */}
          {isLoading ? (
            <div className="text-center py-12" style={{ fontFamily: "'EB Garamond', serif", color: "oklch(55% 0.11 72)" }}>Loading events...</div>
          ) : events && events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event: any) => (
                <div key={event.id} className="card-vintage overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: event.active ? "oklch(35% 0.08 155)" : "oklch(55% 0.11 72)",
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", margin: 0 }}>{event.title}</h4>
                        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.8rem", color: "oklch(55% 0.11 72)", margin: 0 }}>
                          {event.eventType.replace("_", " ")} · {new Date(event.startDate).toLocaleDateString()} · ${event.price}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/timeslots?eventId=${event.id}`}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        className="btn-vintage-filled flex items-center gap-1"
                        style={{ fontSize: "0.72rem", padding: "0.3rem 0.65rem", whiteSpace: "nowrap" }}
                      >
                        <CalendarDays size={12} /> Manage Slots
                      </Link>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(event); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "oklch(55% 0.11 72)", padding: "0.25rem" }}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (confirm("Delete this event?")) deleteEvent.mutate({ id: event.id }); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "oklch(50% 0.15 22)", padding: "0.25rem" }}
                      >
                        <Trash2 size={15} />
                      </button>
                      {expandedEvent === event.id ? <ChevronUp size={16} style={{ color: "oklch(55% 0.11 72)" }} /> : <ChevronDown size={16} style={{ color: "oklch(55% 0.11 72)" }} />}
                    </div>
                  </div>

                  {/* Timeslots panel */}
                  {expandedEvent === event.id && (
                    <div style={{ borderTop: "1px solid oklch(87% 0.032 72)", padding: "1rem 1.25rem", background: "oklch(93% 0.025 75)" }}>
                      <div className="flex items-center justify-between mb-3">
                        <h5 style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0, color: "oklch(46% 0.06 56)" }}>
                          <Clock size={13} style={{ display: "inline", marginRight: "0.4rem" }} />
                          Time Slots
                        </h5>
                        <button
                          onClick={() => setShowTimeslotForm(showTimeslotForm === event.id ? null : event.id)}
                          className="btn-vintage text-xs flex items-center gap-1"
                        >
                          <Plus size={12} /> Add Slot
                        </button>
                      </div>

                      {showTimeslotForm === event.id && (
                        <form onSubmit={handleAddTimeslot} className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 p-3" style={{ background: "oklch(96% 0.018 80)", border: "1px solid oklch(82% 0.04 65)" }}>
                          {[
                            { label: "Date *", key: "slotDate", type: "date" },
                            { label: "Start Time *", key: "startTime", type: "time" },
                            { label: "End Time", key: "endTime", type: "time" },
                            { label: "Capacity (# tickets) *", key: "capacity", type: "number" },
                            { label: "Price Override ($)", key: "price", type: "text" },
                          ].map((f) => (
                            <div key={f.key}>
                              <label style={{ ...labelStyle, fontSize: "0.6rem" }}>{f.label}</label>
                              <input
                                type={f.type}
                                value={(timeslotForm as any)[f.key]}
                                onChange={(e) => setTimeslotForm({ ...timeslotForm, [f.key]: e.target.value })}
                                style={{ ...inputStyle, fontSize: "0.8rem", padding: "0.35rem 0.5rem" }}
                              />
                            </div>
                          ))}
                          <div className="flex items-end gap-2">
                            <button type="submit" className="btn-vintage-filled text-xs">Add</button>
                            <button type="button" onClick={() => setShowTimeslotForm(null)} className="btn-vintage text-xs">Cancel</button>
                          </div>
                        </form>
                      )}

                      {timeslots && timeslots.length > 0 ? (
                        <div className="space-y-2">
                          {timeslots.map((slot: any) => (
                            <div key={slot.id} className="flex items-center justify-between p-2" style={{ background: "oklch(96% 0.018 80)", border: "1px solid oklch(87% 0.032 72)" }}>
                              <div>
                                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.8rem", color: "oklch(22% 0.04 50)" }}>
                                  {new Date(slot.startTime).toLocaleString()} – {new Date(slot.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                                {slot.label && <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.75rem", color: "oklch(55% 0.11 72)", marginLeft: "0.5rem" }}>({slot.label})</span>}
                              </div>
                              <div className="flex items-center gap-3">
                                <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.8rem", color: "oklch(46% 0.06 56)" }}>
                                  <Ticket size={12} style={{ display: "inline", marginRight: "0.25rem" }} />
                                  {slot.ticketsSold}/{slot.capacity}
                                </span>
                                <button
                                  onClick={() => { if (confirm("Delete this timeslot?")) deleteTimeslot.mutate({ id: slot.id }); }}
                                  style={{ background: "none", border: "none", cursor: "pointer", color: "oklch(50% 0.15 22)", padding: "0.2rem" }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: "oklch(55% 0.11 72)", fontStyle: "italic" }}>
                          No timeslots yet. Add a timeslot to enable ticket purchasing.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <CalendarDays size={48} style={{ color: "oklch(72% 0.05 62)", margin: "0 auto 1rem" }} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: "oklch(46% 0.06 56)" }}>No events yet</h3>
              <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(55% 0.11 72)", marginBottom: "1.5rem" }}>Create your first event to start selling tickets.</p>
              <button onClick={() => setShowForm(true)} className="btn-vintage-filled">Create First Event</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
