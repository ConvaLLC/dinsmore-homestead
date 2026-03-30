import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AdminNav } from "./AdminDashboard";
import { Lock, BookOpen, Plus, X, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

type ContentForm = { title: string; slug: string; category: string; gradeLevel: string; subject: string; content: string; fileUrl: string; thumbnailUrl: string; sortOrder: string; active: boolean; };
const emptyForm: ContentForm = { title: "", slug: "", category: "lesson_plan", gradeLevel: "", subject: "", content: "", fileUrl: "", thumbnailUrl: "", sortOrder: "0", active: true };

export default function AdminEducation() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"content" | "requests">("content");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ContentForm>(emptyForm);
  const utils = trpc.useUtils();
  const { data: content, isLoading: contentLoading } = trpc.education.adminList.useQuery();
  const { data: requests, isLoading: requestsLoading } = trpc.education.adminRequests.useQuery();
  const createContent = trpc.education.adminCreate.useMutation({ onSuccess: () => { utils.education.adminList.invalidate(); setShowForm(false); setForm(emptyForm); toast.success("Content added!"); } });
  const deleteContent = trpc.education.adminDelete.useMutation({ onSuccess: () => { utils.education.adminList.invalidate(); toast.success("Content deleted."); } });
  const approveRequest = trpc.education.adminApproveRequest.useMutation({ onSuccess: () => { utils.education.adminRequests.invalidate(); toast.success("Access approved!"); } });

  if (!isAuthenticated || (user as any)?.role !== "admin") {
    return <div className="py-24 text-center container"><Lock size={48} style={{ color: "oklch(64.3% 0.161 143.4)", margin: "0 auto 1rem" }} /><h2>Admin Access Required</h2><a href={getLoginUrl()} className="btn-vintage-filled">Sign In</a></div>;
  }

  const inputStyle = { width: "100%", padding: "0.5rem 0.75rem", border: "1px solid oklch(78% 0.055 135)", background: "oklch(93.6% 0.037 136.6)", fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(20% 0.03 145)", outline: "none" };
  const labelStyle = { fontFamily: "'Playfair Display', serif", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "oklch(44% 0.055 144)", display: "block" as const, marginBottom: "0.25rem" };

  return (
    <div>
      <AdminNav />
      <div className="py-8" style={{ background: "oklch(96% 0.014 110)", minHeight: "calc(100vh - 120px)" }}>
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div><span className="section-label">Admin</span><h2 style={{ fontSize: "1.75rem" }}>Education Portal</h2></div>
            {activeTab === "content" && <button onClick={() => setShowForm(true)} className="btn-vintage-filled flex items-center gap-2"><Plus size={16} /> Add Content</button>}
          </div>
          <div className="flex mb-6" style={{ borderBottom: "2px solid oklch(86.6% 0.079 130.9)" }}>
            {(["content", "requests"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "0.5rem 1.25rem", fontFamily: "'Playfair Display', serif", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", border: "none", background: "transparent", color: activeTab === tab ? "oklch(33.1% 0.064 144.7)" : "oklch(64.3% 0.161 143.4)", borderBottom: activeTab === tab ? "2px solid oklch(33.1% 0.064 144.7)" : "2px solid transparent", marginBottom: "-2px", cursor: "pointer" }}>
                {tab === "content" ? "Educational Content" : `Access Requests ${requests ? `(${requests.filter((r: any) => !r.approved).length} pending)` : ""}`}
              </button>
            ))}
          </div>

          {activeTab === "content" && (
            <>
              {showForm && (
                <div className="card-vintage p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", margin: 0 }}>Add Educational Content</h3>
                    <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "oklch(64.3% 0.161 143.4)" }}><X size={18} /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {[
                      { label: "Title *", key: "title" }, { label: "URL Slug *", key: "slug" },
                      { label: "Grade Level", key: "gradeLevel" }, { label: "Subject", key: "subject" },
                      { label: "File URL (PDF/doc)", key: "fileUrl" }, { label: "Thumbnail URL", key: "thumbnailUrl" },
                    ].map((f) => (
                      <div key={f.key}><label style={labelStyle}>{f.label}</label><input type="text" value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} style={inputStyle} /></div>
                    ))}
                    <div>
                      <label style={labelStyle}>Category *</label>
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                        {["lesson_plan", "research", "resource", "newsletter", "program"].map((c) => <option key={c} value={c}>{c.replace("_", " ")}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mb-4"><label style={labelStyle}>Content (Markdown supported)</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} style={{ ...inputStyle, resize: "vertical" }} /></div>
                  <label className="flex items-center gap-2 mb-4 cursor-pointer"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} style={{ accentColor: "oklch(33.1% 0.064 144.7)" }} /><span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(42.3% 0.087 144.3)" }}>Active (visible to verified users)</span></label>
                  <div className="flex gap-3">
                    <button onClick={() => createContent.mutate({ ...form, category: form.category as any, sortOrder: parseInt(form.sortOrder) || 0 })} className="btn-vintage-filled flex items-center gap-2"><Check size={14} /> Add Content</button>
                    <button onClick={() => setShowForm(false)} className="btn-vintage">Cancel</button>
                  </div>
                </div>
              )}
              {contentLoading ? <div className="text-center py-12" style={{ fontFamily: "'EB Garamond', serif", color: "oklch(64.3% 0.161 143.4)" }}>Loading...</div> : content && content.length > 0 ? (
                <div className="space-y-2">
                  {content.map((item: any) => (
                    <div key={item.id} className="card-vintage p-4 flex items-center justify-between">
                      <div>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", margin: 0 }}>{item.title}</h4>
                        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.8rem", color: "oklch(64.3% 0.161 143.4)", margin: 0 }}>{item.category.replace("_", " ")} {item.gradeLevel ? `· Grades ${item.gradeLevel}` : ""}</p>
                      </div>
                      <button onClick={() => { if (confirm("Delete this content?")) deleteContent.mutate({ id: item.id }); }} style={{ background: "none", border: "none", cursor: "pointer", color: "oklch(50% 0.15 22)" }}><Trash2 size={15} /></button>
                    </div>
                  ))}
                </div>
              ) : <div className="text-center py-16"><BookOpen size={48} style={{ color: "oklch(78% 0.055 135)", margin: "0 auto 1rem" }} /><p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(64.3% 0.161 143.4)", fontStyle: "italic" }}>No content yet. Add your first educational resource.</p></div>}
            </>
          )}

          {activeTab === "requests" && (
            <>
              {requestsLoading ? <div className="text-center py-12" style={{ fontFamily: "'EB Garamond', serif", color: "oklch(64.3% 0.161 143.4)" }}>Loading...</div> : requests && requests.length > 0 ? (
                <div className="space-y-3">
                  {requests.map((req: any) => (
                    <div key={req.id} className="card-vintage p-4 flex items-center justify-between">
                      <div>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", margin: 0 }}>{req.name}</h4>
                        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.8rem", color: "oklch(64.3% 0.161 143.4)", margin: 0 }}>{req.email} · {req.role || "—"} {req.organization ? `· ${req.organization}` : ""}</p>
                        {req.reason && <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.8rem", color: "oklch(44% 0.055 144)", margin: "0.25rem 0 0", fontStyle: "italic" }}>"{req.reason}"</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ padding: "0.2rem 0.6rem", background: req.approved ? "oklch(85% 0.08 155)" : req.verified ? "oklch(86.6% 0.079 130.9)" : "oklch(90% 0.06 75)", color: req.approved ? "oklch(25% 0.08 155)" : "oklch(44% 0.055 144)", fontSize: "0.7rem", fontFamily: "'Playfair Display', serif" }}>
                          {req.approved ? "Approved" : req.verified ? "Verified" : "Pending"}
                        </span>
                        {!req.approved && <button onClick={() => approveRequest.mutate({ id: req.id })} className="btn-vintage text-xs flex items-center gap-1"><Check size={12} /> Approve</button>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : <div className="text-center py-16"><p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(64.3% 0.161 143.4)", fontStyle: "italic" }}>No access requests yet.</p></div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
