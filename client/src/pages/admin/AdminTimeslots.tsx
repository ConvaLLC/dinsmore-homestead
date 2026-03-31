import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AdminNav } from "./AdminDashboard";
import { useLocation, Link } from "wouter";
import {
  Plus, Edit2, Trash2, ArrowLeft, Lock, ChevronDown, ChevronUp,
  Calendar, Clock, Users, AlertTriangle, CheckCircle, XCircle,
  Zap, RefreshCw, Filter,
} from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

function formatDate(d: Date | string) {
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}
function formatDateKey(d: Date | string) {
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toISOString().slice(0, 10);
}
const INTERVAL_OPTIONS = [
  { label: "15 minutes", value: 15 }, { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 }, { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 }, { label: "2 hours", value: 120 },
  { label: "3 hours", value: 180 },
];
const DURATION_OPTIONS = [
  { label: "Same as interval", value: 0 }, { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 }, { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 }, { label: "2 hours", value: 120 },
  { label: "2.5 hours", value: 150 }, { label: "3 hours", value: 180 },
];
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Slot = {
  id: number; eventId: number; slotDate: Date | string;
  startTime: string; endTime: string | null;
  capacity: number; ticketsSold: number;
  price: string | null; active: boolean;
};
type EditForm = { startTime: string; endTime: string; capacity: string; price: string; active: boolean; };

function StatusBadge({ slot }: { slot: Slot }) {
  const remaining = slot.capacity - slot.ticketsSold;
  const pct = slot.ticketsSold / slot.capacity;
  if (!slot.active) return <span style={{ display:"inline-flex",alignItems:"center",gap:"4px",padding:"2px 8px",borderRadius:"2px",fontSize:"0.7rem",fontFamily:"'Playfair Display',serif",letterSpacing:"0.06em",background:"oklch(87.6% 0.068 89.7)",color:"oklch(47.2% 0.088 247.4)" }}><XCircle size={10}/> Inactive</span>;
  if (remaining <= 0) return <span style={{ display:"inline-flex",alignItems:"center",gap:"4px",padding:"2px 8px",borderRadius:"2px",fontSize:"0.7rem",fontFamily:"'Playfair Display',serif",letterSpacing:"0.06em",background:"oklch(30% 0.18 25)",color:"oklch(95% 0.02 80)" }}><AlertTriangle size={10}/> Sold Out</span>;
  if (pct >= 0.8) return <span style={{ display:"inline-flex",alignItems:"center",gap:"4px",padding:"2px 8px",borderRadius:"2px",fontSize:"0.7rem",fontFamily:"'Playfair Display',serif",letterSpacing:"0.06em",background:"oklch(65% 0.14 55)",color:"oklch(98% 0.01 80)" }}><AlertTriangle size={10}/> Almost Full</span>;
  return <span style={{ display:"inline-flex",alignItems:"center",gap:"4px",padding:"2px 8px",borderRadius:"2px",fontSize:"0.7rem",fontFamily:"'Playfair Display',serif",letterSpacing:"0.06em",background:"oklch(40% 0.14 145)",color:"oklch(97% 0.01 80)" }}><CheckCircle size={10}/> {remaining} left</span>;
}

function CapacityBar({ slot }: { slot: Slot }) {
  const pct = Math.min(100, (slot.ticketsSold / slot.capacity) * 100);
  const color = pct >= 100 ? "oklch(40% 0.18 25)" : pct >= 80 ? "oklch(60% 0.14 55)" : "oklch(50% 0.14 145)";
  return (
    <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
      <div style={{ flex:1,height:"6px",background:"oklch(87.6% 0.068 89.7)",borderRadius:"3px",overflow:"hidden" }}>
        <div style={{ width:`${pct}%`,height:"100%",background:color,transition:"width 0.3s ease" }}/>
      </div>
      <span style={{ fontFamily:"'EB Garamond',serif",fontSize:"0.8rem",color:"oklch(47.2% 0.088 247.4)",whiteSpace:"nowrap" }}>{slot.ticketsSold}/{slot.capacity}</span>
    </div>
  );
}

function EditSlotModal({ slot, onClose, onSave, isSaving }: { slot: Slot; onClose: () => void; onSave: (f: EditForm) => void; isSaving: boolean; }) {
  const [form, setForm] = useState<EditForm>({ startTime: slot.startTime, endTime: slot.endTime ?? "", capacity: String(slot.capacity), price: slot.price ?? "", active: slot.active });
  const set = (k: keyof EditForm, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));
  const inp: React.CSSProperties = { width:"100%",padding:"0.45rem 0.65rem",border:"1px solid oklch(87.6% 0.068 89.7)",background:"oklch(94.7% 0.029 89.6)",fontFamily:"'EB Garamond',serif",fontSize:"0.95rem",color:"oklch(21.8% 0.036 251.3)",outline:"none" };
  const lbl: React.CSSProperties = { fontFamily:"'Playfair Display',serif",fontSize:"0.68rem",letterSpacing:"0.1em",textTransform:"uppercase",color:"oklch(47.2% 0.088 247.4)",display:"block",marginBottom:"0.25rem" };
  const toTime12 = (val: string) => { const [h,m] = val.split(":").map(Number); const ap = h>=12?"PM":"AM"; const h12 = h%12===0?12:h%12; return `${h12}:${String(m).padStart(2,"0")} ${ap}`; };
  return (
    <div style={{ position:"fixed",inset:0,background:"oklch(0% 0 0 / 0.55)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ background:"oklch(97.8% 0.008 89.6)",border:"1px solid oklch(87.6% 0.068 89.7)",borderTop:"4px solid oklch(74.2% 0.118 90.2)",padding:"2rem",width:"100%",maxWidth:"420px",boxShadow:"0 20px 60px oklch(0% 0 0 / 0.3)" }}>
        <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",marginBottom:"1.25rem",color:"oklch(21.8% 0.036 251.3)" }}>Edit Slot &mdash; {formatDate(slot.slotDate)} {slot.startTime}</h3>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"0.75rem" }}>
          <div><label style={lbl}>Start Time</label><input type="time" onChange={e => set("startTime", toTime12(e.target.value))} style={inp}/></div>
          <div><label style={lbl}>End Time</label><input type="time" onChange={e => set("endTime", toTime12(e.target.value))} style={inp}/></div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"0.75rem" }}>
          <div><label style={lbl}>Max Tickets</label><input type="number" min="1" value={form.capacity} onChange={e => set("capacity",e.target.value)} style={inp}/></div>
          <div><label style={lbl}>Price Override ($)</label><input type="number" min="0" step="0.01" placeholder="Use event price" value={form.price} onChange={e => set("price",e.target.value)} style={inp}/></div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"1.5rem" }}>
          <input type="checkbox" id="slot-active" checked={form.active} onChange={e => set("active",e.target.checked)}/>
          <label htmlFor="slot-active" style={{ fontFamily:"'EB Garamond',serif",fontSize:"0.9rem",color:"oklch(28% 0.055 144)",cursor:"pointer" }}>Slot is active (visible to public)</label>
        </div>
        {slot.ticketsSold > 0 && (
          <div style={{ background:"oklch(93% 0.04 72)",border:"1px solid oklch(72% 0.08 72)",padding:"0.6rem 0.75rem",marginBottom:"1rem",fontSize:"0.8rem",fontFamily:"'EB Garamond',serif",color:"oklch(40% 0.08 55)" }}>
            Warning: {slot.ticketsSold} ticket{slot.ticketsSold!==1?"s":""} already sold.
          </div>
        )}
        <div style={{ display:"flex",gap:"0.75rem" }}>
          <button onClick={() => onSave(form)} disabled={isSaving} className="btn-vintage-filled" style={{ flex:1 }}>{isSaving?"Saving...":"Save Changes"}</button>
          <button onClick={onClose} className="btn-vintage" style={{ flex:1 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminTimeslots() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const eventId = useMemo(() => { const p = new URLSearchParams(window.location.search); const id = p.get("eventId"); return id ? parseInt(id) : null; }, [location]);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [bulk, setBulk] = useState({ startDate:"",endDate:"",startTime:"10:00",endTime:"16:00",intervalMinutes:60,slotDurationMinutes:0,capacity:15,price:"",skipDays:[] as number[],replaceExisting:false });
  const [showSingleForm, setShowSingleForm] = useState(false);
  const [singleForm, setSingleForm] = useState({ slotDate:"",startTime:"10:00 AM",endTime:"11:00 AM",capacity:"15",price:"" });
  const [editingSlot, setEditingSlot] = useState<Slot|null>(null);
  const [filterDate, setFilterDate] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const utils = trpc.useUtils();
  const { data: events } = trpc.events.adminList.useQuery();
  const currentEvent = events?.find((e: any) => e.id === eventId);
  const { data: allSlots = [], isLoading: slotsLoading } = trpc.timeslots.adminForEvent.useQuery({ eventId: eventId! }, { enabled: eventId !== null });
  const bulkGenerate = trpc.timeslots.bulkGenerate.useMutation({ onSuccess: (data) => { utils.timeslots.adminForEvent.invalidate(); toast.success(`Generated ${data.count} time slot${data.count!==1?"s":""}!`); setShowBulkForm(false); }, onError: e => toast.error(e.message) });
  const createSlot = trpc.timeslots.create.useMutation({ onSuccess: () => { utils.timeslots.adminForEvent.invalidate(); toast.success("Slot added!"); setShowSingleForm(false); }, onError: e => toast.error(e.message) });
  const updateSlot = trpc.timeslots.update.useMutation({ onSuccess: () => { utils.timeslots.adminForEvent.invalidate(); toast.success("Slot updated!"); setEditingSlot(null); }, onError: e => toast.error(e.message) });
  const deleteSlot = trpc.timeslots.delete.useMutation({ onSuccess: () => { utils.timeslots.adminForEvent.invalidate(); toast.success("Slot removed."); }, onError: e => toast.error(e.message) });

  if (!isAuthenticated || (user as any)?.role !== "admin") return (
    <div className="py-24 text-center container"><Lock size={48} style={{ color:"oklch(74.2% 0.118 90.2)",margin:"0 auto 1rem" }}/><h2>Admin Access Required</h2><a href={getLoginUrl()} className="btn-vintage-filled">Sign In</a></div>
  );
  if (!eventId) return (
    <div style={{ minHeight:"100vh",background:"oklch(94.7% 0.029 89.6)" }}>
      <AdminNav/>
      <div className="container py-10" style={{ maxWidth:"700px" }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.6rem",color:"oklch(21.8% 0.036 251.3)",marginBottom:"0.5rem" }}>Tour Time Slots</h1>
        <p style={{ fontFamily:"'EB Garamond',serif",fontSize:"1rem",color:"oklch(47.2% 0.088 247.4)",marginBottom:"2rem" }}>
          Select an event to manage its time slots, or <Link href="/admin/events" className="nav-link-vintage">create a new event</Link> first.
        </p>
        {events && (events as any[]).length > 0 ? (
          <div style={{ display:"grid",gap:"0.75rem" }}>
            {(events as any[]).map((ev: any) => (
              <Link key={ev.id} href={`/admin/timeslots?eventId=${ev.id}`}
                style={{ display:"block",padding:"1rem 1.25rem",background:"oklch(97.8% 0.008 89.6)",border:"1px solid oklch(87.6% 0.068 89.7)",borderLeft:"4px solid oklch(74.2% 0.118 90.2)",textDecoration:"none",transition:"all 0.15s" }}
              >
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"1rem",color:"oklch(21.8% 0.036 251.3)",fontWeight:600 }}>{ev.title}</div>
                <div style={{ fontFamily:"'EB Garamond',serif",fontSize:"0.85rem",color:"oklch(74.2% 0.118 90.2)",marginTop:"0.2rem" }}>
                  {ev.eventType?.replace("_"," ")} &middot; {new Date(ev.startDate).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ fontFamily:"'EB Garamond',serif",color:"oklch(74.2% 0.118 90.2)" }}>No events found. <Link href="/admin/events" className="nav-link-vintage">Create an event first.</Link></p>
        )}
      </div>
    </div>
  );

  const filteredSlots = (allSlots as Slot[]).filter(s => {
    if (!showInactive && !s.active) return false;
    if (filterDate) { const key = formatDateKey(s.slotDate); if (!key.startsWith(filterDate)) return false; }
    return true;
  });
  const byDate = filteredSlots.reduce<Record<string,Slot[]>>((acc,s) => { const k = formatDateKey(s.slotDate); if(!acc[k]) acc[k]=[]; acc[k].push(s); return acc; }, {});
  const sortedDates = Object.keys(byDate).sort();
  const totalSlots = (allSlots as Slot[]).filter(s => s.active).length;
  const totalCapacity = (allSlots as Slot[]).filter(s => s.active).reduce((a,s) => a+s.capacity, 0);
  const totalSold = (allSlots as Slot[]).reduce((a,s) => a+s.ticketsSold, 0);
  const soldOutSlots = (allSlots as Slot[]).filter(s => s.active && s.ticketsSold >= s.capacity).length;
  const toggleDate = (k: string) => setExpandedDates(prev => { const n = new Set(prev); if(n.has(k)) n.delete(k); else n.add(k); return n; });
  const toTime12 = (val: string) => { const [h,m] = val.split(":").map(Number); const ap = h>=12?"PM":"AM"; const h12 = h%12===0?12:h%12; return `${h12}:${String(m).padStart(2,"0")} ${ap}`; };
  const handleBulkGenerate = () => { if(!eventId) return; bulkGenerate.mutate({ eventId, startDate:bulk.startDate, endDate:bulk.endDate, startTime:bulk.startTime, endTime:bulk.endTime, intervalMinutes:bulk.intervalMinutes, slotDurationMinutes:bulk.slotDurationMinutes||undefined, capacity:bulk.capacity, price:bulk.price||undefined, skipDays:bulk.skipDays, replaceExisting:bulk.replaceExisting }); };
  const handleSaveEdit = (form: EditForm) => { if(!editingSlot) return; updateSlot.mutate({ id:editingSlot.id, startTime:form.startTime, endTime:form.endTime||undefined, capacity:parseInt(form.capacity), price:form.price||undefined, active:form.active }); };
  const handleAddSingle = () => { if(!eventId||!singleForm.slotDate) return; const slotDate = new Date(singleForm.slotDate+"T12:00:00"); createSlot.mutate({ eventId, slotDate, startTime:singleForm.startTime, endTime:singleForm.endTime||undefined, capacity:parseInt(singleForm.capacity), price:singleForm.price||undefined }); };

  const ss: React.CSSProperties = { background:"oklch(97.8% 0.008 89.6)",border:"1px solid oklch(87.6% 0.068 89.7)",borderTop:"3px solid oklch(74.2% 0.118 90.2)",padding:"1.5rem",marginBottom:"1.5rem" };
  const inp: React.CSSProperties = { padding:"0.45rem 0.65rem",border:"1px solid oklch(87.6% 0.068 89.7)",background:"oklch(94.7% 0.029 89.6)",fontFamily:"'EB Garamond',serif",fontSize:"0.9rem",color:"oklch(21.8% 0.036 251.3)",outline:"none",width:"100%" };
  const lbl: React.CSSProperties = { fontFamily:"'Playfair Display',serif",fontSize:"0.65rem",letterSpacing:"0.1em",textTransform:"uppercase",color:"oklch(47.2% 0.088 247.4)",display:"block",marginBottom:"0.2rem" };

  return (
    <div style={{ minHeight:"100vh",background:"oklch(94.7% 0.029 89.6)" }}>
      <AdminNav/>
      <div className="container py-8" style={{ maxWidth:"1100px" }}>
        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"1.5rem",flexWrap:"wrap",gap:"1rem" }}>
          <div>
            <Link href="/admin/events" className="btn-vintage text-xs flex items-center gap-1 mb-2 inline-flex"><ArrowLeft size={12}/> Back to Events</Link>
            <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.6rem",color:"oklch(21.8% 0.036 251.3)",margin:0 }}>Tour Time Slots</h1>
            {currentEvent && <p style={{ fontFamily:"'EB Garamond',serif",fontSize:"1rem",color:"oklch(47.2% 0.088 247.4)",marginTop:"0.25rem" }}>{(currentEvent as any).title}</p>}
          </div>
          <div style={{ display:"flex",gap:"0.75rem",flexWrap:"wrap" }}>
            <button onClick={() => { setShowBulkForm(!showBulkForm); setShowSingleForm(false); }} className="btn-vintage-filled flex items-center gap-2"><Zap size={14}/> Bulk Generate</button>
            <button onClick={() => { setShowSingleForm(!showSingleForm); setShowBulkForm(false); }} className="btn-vintage flex items-center gap-2"><Plus size={14}/> Add Single Slot</button>
          </div>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"1rem",marginBottom:"1.5rem" }}>
          {([{label:"Active Slots",value:totalSlots,icon:<Clock size={18}/>,warn:false},{label:"Total Capacity",value:totalCapacity,icon:<Users size={18}/>,warn:false},{label:"Tickets Sold",value:totalSold,icon:<CheckCircle size={18}/>,warn:false},{label:"Sold Out Slots",value:soldOutSlots,icon:<AlertTriangle size={18}/>,warn:soldOutSlots>0}] as const).map(stat => (
            <div key={stat.label} style={{ background:"oklch(97.8% 0.008 89.6)",border:`1px solid ${stat.warn?"oklch(55% 0.18 25)":"oklch(87.6% 0.068 89.7)"}`,padding:"1rem",textAlign:"center" }}>
              <div style={{ color:stat.warn?"oklch(45% 0.18 25)":"oklch(74.2% 0.118 90.2)",marginBottom:"0.4rem",display:"flex",justifyContent:"center" }}>{stat.icon}</div>
              <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.6rem",color:"oklch(21.8% 0.036 251.3)",lineHeight:1 }}>{stat.value}</div>
              <div style={{ fontFamily:"'EB Garamond',serif",fontSize:"0.8rem",color:"oklch(47.2% 0.088 247.4)",marginTop:"0.2rem" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {showBulkForm && (
          <div style={ss}>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",marginBottom:"1.25rem",display:"flex",alignItems:"center",gap:"0.5rem" }}><Zap size={16} style={{ color:"oklch(74.2% 0.118 90.2)" }}/> Bulk Generate Tour Slots</h2>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"0.75rem",marginBottom:"1rem" }}>
              <div><label style={lbl}>Start Date</label><input type="date" value={bulk.startDate} onChange={e => setBulk(b=>({...b,startDate:e.target.value}))} style={inp}/></div>
              <div><label style={lbl}>End Date</label><input type="date" value={bulk.endDate} onChange={e => setBulk(b=>({...b,endDate:e.target.value}))} style={inp}/></div>
              <div><label style={lbl}>First Tour Starts</label><input type="time" value={bulk.startTime} onChange={e => setBulk(b=>({...b,startTime:e.target.value}))} style={inp}/></div>
              <div><label style={lbl}>Last Tour Starts By</label><input type="time" value={bulk.endTime} onChange={e => setBulk(b=>({...b,endTime:e.target.value}))} style={inp}/></div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"0.75rem",marginBottom:"1rem" }}>
              <div><label style={lbl}>Tour Interval</label><select value={bulk.intervalMinutes} onChange={e => setBulk(b=>({...b,intervalMinutes:parseInt(e.target.value)}))} style={inp}>{INTERVAL_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
              <div><label style={lbl}>Tour Duration</label><select value={bulk.slotDurationMinutes} onChange={e => setBulk(b=>({...b,slotDurationMinutes:parseInt(e.target.value)}))} style={inp}>{DURATION_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
              <div><label style={lbl}>Tickets Per Slot</label><input type="number" min="1" value={bulk.capacity} onChange={e => setBulk(b=>({...b,capacity:parseInt(e.target.value)||1}))} style={inp}/></div>
              <div><label style={lbl}>Price Override ($)</label><input type="number" min="0" step="0.01" placeholder="Use event price" value={bulk.price} onChange={e => setBulk(b=>({...b,price:e.target.value}))} style={inp}/></div>
            </div>
            <div style={{ marginBottom:"1rem" }}>
              <label style={{ ...lbl,marginBottom:"0.5rem" }}>Skip Days of Week</label>
              <div style={{ display:"flex",gap:"0.5rem",flexWrap:"wrap" }}>
                {DAYS_OF_WEEK.map((day,i) => (
                  <label key={day} style={{ display:"flex",alignItems:"center",gap:"4px",cursor:"pointer",fontFamily:"'EB Garamond',serif",fontSize:"0.9rem" }}>
                    <input type="checkbox" checked={bulk.skipDays.includes(i)} onChange={e => setBulk(b=>({ ...b, skipDays: e.target.checked ? [...b.skipDays,i] : b.skipDays.filter(d=>d!==i) }))}/> {day}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"1.25rem" }}>
              <input type="checkbox" id="replace-existing" checked={bulk.replaceExisting} onChange={e => setBulk(b=>({...b,replaceExisting:e.target.checked}))}/>
              <label htmlFor="replace-existing" style={{ fontFamily:"'EB Garamond',serif",fontSize:"0.9rem",color:"oklch(28% 0.055 144)",cursor:"pointer" }}>Replace existing slots in this date range</label>
            </div>
            <div style={{ display:"flex",gap:"0.75rem" }}>
              <button onClick={handleBulkGenerate} disabled={bulkGenerate.isPending||!bulk.startDate||!bulk.endDate} className="btn-vintage-filled flex items-center gap-2">
                {bulkGenerate.isPending ? <><RefreshCw size={14} className="animate-spin"/> Generating...</> : <><Zap size={14}/> Generate Slots</>}
              </button>
              <button onClick={() => setShowBulkForm(false)} className="btn-vintage">Cancel</button>
            </div>
          </div>
        )}

        {showSingleForm && (
          <div style={ss}>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",marginBottom:"1.25rem",display:"flex",alignItems:"center",gap:"0.5rem" }}><Plus size={16} style={{ color:"oklch(74.2% 0.118 90.2)" }}/> Add Single Time Slot</h2>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"0.75rem",marginBottom:"1rem" }}>
              <div><label style={lbl}>Date</label><input type="date" value={singleForm.slotDate} onChange={e => setSingleForm(f=>({...f,slotDate:e.target.value}))} style={inp}/></div>
              <div><label style={lbl}>Start Time</label><input type="time" onChange={e => setSingleForm(f=>({...f,startTime:toTime12(e.target.value)}))} style={inp}/></div>
              <div><label style={lbl}>End Time</label><input type="time" onChange={e => setSingleForm(f=>({...f,endTime:toTime12(e.target.value)}))} style={inp}/></div>
              <div><label style={lbl}>Max Tickets</label><input type="number" min="1" value={singleForm.capacity} onChange={e => setSingleForm(f=>({...f,capacity:e.target.value}))} style={inp}/></div>
              <div><label style={lbl}>Price Override ($)</label><input type="number" min="0" step="0.01" placeholder="Use event price" value={singleForm.price} onChange={e => setSingleForm(f=>({...f,price:e.target.value}))} style={inp}/></div>
            </div>
            <div style={{ display:"flex",gap:"0.75rem" }}>
              <button onClick={handleAddSingle} disabled={createSlot.isPending||!singleForm.slotDate} className="btn-vintage-filled flex items-center gap-2">{createSlot.isPending?"Adding...":<><Plus size={14}/> Add Slot</>}</button>
              <button onClick={() => setShowSingleForm(false)} className="btn-vintage">Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1rem",flexWrap:"wrap" }}>
          <div style={{ display:"flex",alignItems:"center",gap:"0.5rem" }}>
            <Filter size={14} style={{ color:"oklch(74.2% 0.118 90.2)" }}/>
            <input type="month" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{ ...inp,width:"auto" }}/>
            {filterDate && <button onClick={() => setFilterDate("")} className="btn-vintage text-xs">Clear</button>}
          </div>
          <label style={{ display:"flex",alignItems:"center",gap:"0.4rem",fontFamily:"'EB Garamond',serif",fontSize:"0.9rem",cursor:"pointer" }}>
            <input type="checkbox" checked={showInactive} onChange={e => setShowInactive(e.target.checked)}/> Show inactive slots
          </label>
          <span style={{ fontFamily:"'EB Garamond',serif",fontSize:"0.85rem",color:"oklch(74.2% 0.118 90.2)",marginLeft:"auto" }}>{filteredSlots.length} slot{filteredSlots.length!==1?"s":""} shown</span>
        </div>

        {slotsLoading ? (
          <div style={{ textAlign:"center",padding:"3rem",fontFamily:"'EB Garamond',serif",color:"oklch(74.2% 0.118 90.2)" }}>Loading slots...</div>
        ) : sortedDates.length === 0 ? (
          <div style={{ ...ss,textAlign:"center",padding:"3rem" }}>
            <Calendar size={40} style={{ color:"oklch(87.6% 0.068 89.7)",margin:"0 auto 1rem" }}/>
            <p style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",color:"oklch(47.2% 0.088 247.4)" }}>No time slots yet</p>
            <p style={{ fontFamily:"'EB Garamond',serif",fontSize:"0.9rem",color:"oklch(60% 0.04 60)",marginTop:"0.5rem" }}>Use Bulk Generate to create a full schedule, or Add Single Slot for one-off times.</p>
          </div>
        ) : (
          <div>
            <div style={{ display:"flex",gap:"0.5rem",marginBottom:"0.75rem" }}>
              <button onClick={() => setExpandedDates(new Set(sortedDates))} className="btn-vintage text-xs">Expand All</button>
              <button onClick={() => setExpandedDates(new Set())} className="btn-vintage text-xs">Collapse All</button>
            </div>
            {sortedDates.map(dateKey => {
              const daySlots = byDate[dateKey];
              const dayCapacity = daySlots.reduce((a,s) => a+s.capacity, 0);
              const daySold = daySlots.reduce((a,s) => a+s.ticketsSold, 0);
              const dayRemaining = dayCapacity - daySold;
              const isExpanded = expandedDates.has(dateKey);
              const allSoldOut = daySlots.every(s => s.ticketsSold >= s.capacity);
              return (
                <div key={dateKey} style={{ marginBottom:"0.75rem",border:"1px solid oklch(87.6% 0.068 89.7)",background:"oklch(97.8% 0.008 89.6)" }}>
                  <button onClick={() => toggleDate(dateKey)} style={{ width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.75rem 1rem",background:"transparent",border:"none",cursor:"pointer",borderBottom:isExpanded?"1px solid oklch(87.6% 0.068 89.7)":"none" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:"1rem" }}>
                      <span style={{ fontFamily:"'Playfair Display',serif",fontSize:"0.95rem",color:"oklch(21.8% 0.036 251.3)",fontWeight:600 }}>{formatDate(dateKey+"T12:00:00")}</span>
                      <span style={{ fontFamily:"'EB Garamond',serif",fontSize:"0.8rem",color:"oklch(74.2% 0.118 90.2)" }}>{daySlots.length} slot{daySlots.length!==1?"s":""}</span>
                      {allSoldOut && <span style={{ padding:"1px 6px",background:"oklch(30% 0.18 25)",color:"oklch(95% 0.02 80)",fontSize:"0.65rem",fontFamily:"'Playfair Display',serif",letterSpacing:"0.06em" }}>SOLD OUT</span>}
                    </div>
                    <div style={{ display:"flex",alignItems:"center",gap:"1.5rem" }}>
                      <span style={{ fontFamily:"'EB Garamond',serif",fontSize:"0.85rem",color:dayRemaining===0?"oklch(40% 0.18 25)":"oklch(47.2% 0.088 247.4)" }}>{daySold}/{dayCapacity} sold &middot; {dayRemaining} remaining</span>
                      {isExpanded ? <ChevronUp size={16} style={{ color:"oklch(74.2% 0.118 90.2)" }}/> : <ChevronDown size={16} style={{ color:"oklch(74.2% 0.118 90.2)" }}/>}
                    </div>
                  </button>
                  {isExpanded && (
                    <div style={{ overflowX:"auto" }}>
                      <table style={{ width:"100%",borderCollapse:"collapse" }}>
                        <thead>
                          <tr style={{ background:"oklch(90% 0.025 72)" }}>
                            {["Time","Duration","Capacity","Sold","Remaining","Price","Status","Actions"].map(h => (
                              <th key={h} style={{ padding:"0.5rem 0.75rem",textAlign:"left",fontFamily:"'Playfair Display',serif",fontSize:"0.65rem",letterSpacing:"0.1em",textTransform:"uppercase",color:"oklch(47.2% 0.088 247.4)",fontWeight:600,borderBottom:"1px solid oklch(87.6% 0.068 89.7)" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {daySlots.map((slot,idx) => {
                            const remaining = slot.capacity - slot.ticketsSold;
                            return (
                              <tr key={slot.id} style={{ background:idx%2===0?"transparent":"oklch(93% 0.02 75)",opacity:slot.active?1:0.6 }}>
                                <td style={{ padding:"0.6rem 0.75rem",fontFamily:"'Playfair Display',serif",fontSize:"0.85rem",color:"oklch(21.8% 0.036 251.3)",whiteSpace:"nowrap" }}>{slot.startTime}</td>
                                <td style={{ padding:"0.6rem 0.75rem",fontFamily:"'EB Garamond',serif",fontSize:"0.8rem",color:"oklch(47.2% 0.088 247.4)",whiteSpace:"nowrap" }}>{slot.endTime ? `to ${slot.endTime}` : "—"}</td>
                                <td style={{ padding:"0.6rem 0.75rem",minWidth:"140px" }}><CapacityBar slot={slot}/></td>
                                <td style={{ padding:"0.6rem 0.75rem",fontFamily:"'EB Garamond',serif",fontSize:"0.85rem",textAlign:"center",color:"oklch(28% 0.055 144)" }}>{slot.ticketsSold}</td>
                                <td style={{ padding:"0.6rem 0.75rem",fontFamily:"'EB Garamond',serif",fontSize:"0.85rem",textAlign:"center",color:remaining===0?"oklch(40% 0.18 25)":"oklch(28% 0.055 144)",fontWeight:remaining===0?700:400 }}>{remaining===0?"FULL":remaining}</td>
                                <td style={{ padding:"0.6rem 0.75rem",fontFamily:"'EB Garamond',serif",fontSize:"0.85rem",color:"oklch(47.2% 0.088 247.4)" }}>{slot.price?`$${parseFloat(slot.price).toFixed(2)}`:"Event price"}</td>
                                <td style={{ padding:"0.6rem 0.75rem" }}><StatusBadge slot={slot}/></td>
                                <td style={{ padding:"0.6rem 0.75rem" }}>
                                  <div style={{ display:"flex",gap:"0.4rem" }}>
                                    <button onClick={() => setEditingSlot(slot)} title="Edit" style={{ background:"transparent",border:"1px solid oklch(87.6% 0.068 89.7)",padding:"4px 8px",cursor:"pointer",color:"oklch(47.2% 0.088 247.4)",borderRadius:"2px" }}><Edit2 size={12}/></button>
                                    <button onClick={() => { if(slot.ticketsSold>0){if(!confirm(`${slot.ticketsSold} ticket(s) sold - slot will be deactivated. Continue?`))return;}else{if(!confirm("Delete this slot?"))return;} deleteSlot.mutate({id:slot.id}); }} title="Delete" style={{ background:"transparent",border:"1px solid oklch(60% 0.18 25)",padding:"4px 8px",cursor:"pointer",color:"oklch(50% 0.18 25)",borderRadius:"2px" }}><Trash2 size={12}/></button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {editingSlot && <EditSlotModal slot={editingSlot} onClose={() => setEditingSlot(null)} onSave={handleSaveEdit} isSaving={updateSlot.isPending}/>}
    </div>
  );
}
