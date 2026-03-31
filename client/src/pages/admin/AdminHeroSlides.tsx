import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AdminNav } from "./AdminDashboard";
import { Plus, Trash2, X, Check, Lock, GripVertical, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

type SlideForm = { title: string; subtitle: string; imageUrl: string; linkUrl: string; linkText: string; active: boolean; sortOrder: string; };
const emptyForm: SlideForm = { title: "", subtitle: "", imageUrl: "", linkUrl: "", linkText: "Learn More", active: true, sortOrder: "0" };

export default function AdminHeroSlides() {
  const { user, isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<SlideForm>(emptyForm);
  const utils = trpc.useUtils();
  const { data: slides, isLoading } = trpc.heroSlides.list.useQuery();
  const createSlide = trpc.heroSlides.create.useMutation({ onSuccess: () => { utils.heroSlides.list.invalidate(); setShowForm(false); setForm(emptyForm); toast.success("Slide added!"); } });
  const deleteSlide = trpc.heroSlides.delete.useMutation({ onSuccess: () => { utils.heroSlides.list.invalidate(); toast.success("Slide removed."); } });
  const updateSlide = trpc.heroSlides.update.useMutation({ onSuccess: () => { utils.heroSlides.list.invalidate(); toast.success("Slide updated."); } });

  if (!isAuthenticated || (user as any)?.role !== "admin") {
    return <div className="py-24 text-center container"><Lock size={48} style={{ color: "oklch(74.2% 0.118 90.2)", margin: "0 auto 1rem" }} /><h2>Admin Access Required</h2><a href={getLoginUrl()} className="btn-vintage-filled">Sign In</a></div>;
  }

  const inputStyle = { width: "100%", padding: "0.5rem 0.75rem", border: "1px solid oklch(87.6% 0.068 89.7)", background: "oklch(94.7% 0.029 89.6)", fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(21.8% 0.036 251.3)", outline: "none" };
  const labelStyle = { fontFamily: "'Playfair Display', serif", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "oklch(47.2% 0.088 247.4)", display: "block" as const, marginBottom: "0.25rem" };

  return (
    <div>
      <AdminNav />
      <div className="py-8" style={{ background: "oklch(97.8% 0.008 89.6)", minHeight: "calc(100vh - 120px)" }}>
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div><span className="section-label">Admin</span><h2 style={{ fontSize: "1.75rem" }}>Hero Slider</h2></div>
            <button onClick={() => setShowForm(true)} className="btn-vintage-filled flex items-center gap-2"><Plus size={16} /> Add Slide</button>
          </div>
          {showForm && (
            <div className="card-vintage p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", margin: 0 }}>New Hero Slide</h3>
                <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "oklch(74.2% 0.118 90.2)" }}><X size={18} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {[
                  { label: "Title", key: "title" }, { label: "Subtitle", key: "subtitle" },
                  { label: "Image URL *", key: "imageUrl" }, { label: "Link URL", key: "linkUrl" },
                  { label: "Link Button Text", key: "linkText" }, { label: "Sort Order", key: "sortOrder" },
                ].map((f) => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input type="text" value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} style={inputStyle} />
                  </div>
                ))}
              </div>
              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} style={{ accentColor: "oklch(34.6% 0.074 256.1)" }} />
                <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(47.2% 0.088 247.4)" }}>Active (visible on homepage)</span>
              </label>
              {form.imageUrl && <img src={form.imageUrl} alt="Preview" style={{ maxHeight: "120px", objectFit: "cover", marginBottom: "1rem", filter: "sepia(10%)" }} />}
              <div className="flex gap-3">
                <button onClick={() => createSlide.mutate({ ...form, sortOrder: parseInt(form.sortOrder) || 0 })} className="btn-vintage-filled flex items-center gap-2"><Check size={14} /> Add Slide</button>
                <button onClick={() => setShowForm(false)} className="btn-vintage">Cancel</button>
              </div>
            </div>
          )}
          {isLoading ? <div className="text-center py-12" style={{ fontFamily: "'EB Garamond', serif", color: "oklch(74.2% 0.118 90.2)" }}>Loading...</div> : slides && slides.length > 0 ? (
            <div className="space-y-3">
              {slides.map((slide: any) => (
                <div key={slide.id} className="card-vintage p-4 flex items-center gap-4">
                  {slide.imageUrl && <img src={slide.imageUrl} alt={slide.title} style={{ width: "100px", height: "60px", objectFit: "cover", flexShrink: 0, filter: "sepia(10%)" }} />}
                  <div className="flex-1 min-w-0">
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{slide.title || "(No title)"}</h4>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.8rem", color: "oklch(74.2% 0.118 90.2)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{slide.subtitle || slide.imageUrl}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateSlide.mutate({ id: slide.id, active: !slide.active })} style={{ background: "none", border: "none", cursor: "pointer", color: slide.active ? "oklch(47.2% 0.088 247.4)" : "oklch(74.2% 0.118 90.2)" }} title={slide.active ? "Hide slide" : "Show slide"}>
                      {slide.active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button onClick={() => { if (confirm("Delete this slide?")) deleteSlide.mutate({ id: slide.id }); }} style={{ background: "none", border: "none", cursor: "pointer", color: "oklch(50% 0.15 22)" }}><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(74.2% 0.118 90.2)", fontStyle: "italic" }}>No slides yet. Add your first hero image.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
