'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { buildAgentPrompt, initialTasks, priorityMeta, type Priority, type Task } from './tasks';

type Goal = { target: number; current: number; deadline: string };
type LogEntry = { id: string; createdAt: string; text: string };
type Snapshot = { id: string; createdAt: string; goal: Goal; tasks: Task[]; note: string };
type Store = { goal: Goal; tasks: Task[]; logs: LogEntry[]; snapshots: Snapshot[] };
type View = 'board' | 'tree' | 'log' | 'history';

const KEY = 'tbg-ceo-mission-control-v1';
const DEFAULT_GOAL: Goal = { target: 5000, current: 1298.88, deadline: '2026-08-31' };
const priorities: Priority[] = ['P0', 'P1', 'P2', 'P3'];
const blankTask = (): Task => ({ id: crypto.randomUUID(), title: '', priority: 'P1', owner: 'CEO', status: 'Open', dueDate: '2026-08-31', dependencies: '', nextAction: '', notes: '', completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value || 0);

export default function Home() {
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [view, setView] = useState<View>('board');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'done'>('all');
  const [editing, setEditing] = useState<Task | null>(null);
  const [logText, setLogText] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [dragged, setDragged] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Partial<Store>;
          if (saved.goal) setGoal(saved.goal);
          if (Array.isArray(saved.tasks)) setTasks(saved.tasks);
          if (Array.isArray(saved.logs)) setLogs(saved.logs);
          if (Array.isArray(saved.snapshots)) setSnapshots(saved.snapshots);
        }
      } catch { /* retain safe defaults */ }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify({ goal, tasks, logs, snapshots } satisfies Store));
  }, [goal, tasks, logs, snapshots, hydrated]);

  const visible = useMemo(() => tasks.filter(task => {
    const q = search.toLowerCase();
    const matches = !q || [task.title, task.owner, task.nextAction, task.dependencies].join(' ').toLowerCase().includes(q);
    return matches && (filter === 'all' || (filter === 'done' ? task.completed : !task.completed));
  }), [tasks, search, filter]);

  const progress = Math.min(100, Math.max(0, (goal.current / Math.max(1, goal.target)) * 100));
  const remaining = Math.max(0, goal.target - goal.current);
  const deadline = new Date(`${goal.deadline}T23:59:59`);
  const daysLeft = Math.max(1, Math.ceil((deadline.getTime() - Date.now()) / 86400000));
  const completed = tasks.filter(t => t.completed).length;

  const patchTask = (id: string, patch: Partial<Task>) => setTasks(all => all.map(t => t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t));
  const saveTask = () => {
    if (!editing?.title.trim()) return;
    setTasks(all => all.some(t => t.id === editing.id) ? all.map(t => t.id === editing.id ? { ...editing, updatedAt: new Date().toISOString() } : t) : [...all, editing]);
    setEditing(null);
  };
  const saveSnapshot = () => {
    const todayNotes = logs.filter(l => l.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10)).map(l => l.text).join('\n');
    setSnapshots(all => [{ id: crypto.randomUUID(), createdAt: new Date().toISOString(), goal: { ...goal }, tasks: structuredClone(tasks), note: todayNotes }, ...all]);
    setView('history');
  };
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ goal, tasks, logs, snapshots }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `ceo-mission-control-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
  };
  const importData = async (file?: File) => {
    if (!file) return;
    try { const data = JSON.parse(await file.text()) as Store; if (!data.goal || !Array.isArray(data.tasks)) throw new Error(); setGoal(data.goal); setTasks(data.tasks); setLogs(data.logs || []); setSnapshots(data.snapshots || []); }
    catch { alert('This file is not a valid CEO Mission Control export.'); }
  };

  return <main className="min-h-screen bg-[#08080c] text-white"><div className="mx-auto max-w-[1680px] px-4 py-5 sm:px-7 lg:px-9">
    <header className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5"><div><p className="text-[11px] font-bold uppercase tracking-[.22em] text-violet-300">Tiger Brands Global · Active</p><h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">CEO Mission Control</h1></div><div className="flex flex-wrap gap-2 text-xs"><button onClick={() => setEditing(blankTask())} className="rounded-xl bg-violet-600 px-4 py-2.5 font-bold hover:bg-violet-500">+ Add task</button><button onClick={saveSnapshot} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 hover:bg-white/10">Save today snapshot</button><button onClick={exportData} className="rounded-xl border border-white/15 px-3 py-2.5 hover:bg-white/5">Export</button><button onClick={() => importRef.current?.click()} className="rounded-xl border border-white/15 px-3 py-2.5 hover:bg-white/5">Import</button><input ref={importRef} type="file" accept="application/json" className="hidden" onChange={e => importData(e.target.files?.[0])} /></div></header>

    <section className="grid gap-4 rounded-[26px] border border-violet-400/20 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,.32),transparent_42%),linear-gradient(135deg,#17121f,#0e0e13)] p-5 shadow-2xl shadow-violet-950/20 lg:grid-cols-[1.3fr_.7fr]"><div><p className="text-sm font-semibold text-violet-200">Revenue goal · by Aug 31, 2026</p><div className="mt-3 flex flex-wrap items-end gap-x-4 gap-y-2"><label><span className="block text-[10px] uppercase tracking-widest text-zinc-500">Goal</span><span className="flex items-center text-4xl font-black sm:text-6xl"><span>$</span><input aria-label="Revenue goal" className="w-44 bg-transparent outline-none sm:w-56" type="number" value={goal.target} onChange={e => setGoal({ ...goal, target: Number(e.target.value) })} /></span></label><label className="mb-1"><span className="block text-[10px] uppercase tracking-widest text-zinc-500">Revenue now</span><span className="flex items-center text-xl font-bold text-violet-200"><span>$</span><input aria-label="Current revenue" className="w-32 rounded-lg border border-white/10 bg-black/25 px-2 py-1 outline-none focus:border-violet-400" type="number" step="0.01" value={goal.current} onChange={e => setGoal({ ...goal, current: Number(e.target.value) })} /></span></label></div><div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-red-400 transition-all" style={{ width: `${progress}%` }} /></div><div className="mt-3 flex flex-wrap justify-between gap-2 text-sm"><span className="font-bold">{money(goal.current)} · {progress.toFixed(1)}%</span><span className="text-zinc-400">{money(remaining)} remaining</span></div></div><div className="grid grid-cols-2 gap-3 self-end"><Metric label="Required / day" value={money(remaining / daysLeft)} /><Metric label="Days left" value={String(daysLeft)} /><Metric label="Completed" value={`${completed}/${tasks.length}`} /><Metric label="P0 open" value={String(tasks.filter(t => t.priority === 'P0' && !t.completed).length)} /></div></section>

    <section className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-400/[.05] p-4 text-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-bold text-emerald-300">Chargeback protection decision · Chargeflow recommended</p><p className="mt-1 max-w-5xl text-zinc-400">Run a guarded Shopify pilot: Insights + Alerts first, manually audit the first 5 cases, and keep unrestricted auto-refunds / Prevent controls off. Chargeblast remains the fallback only if its written fee terms are lower and card-network onboarding is complete.</p></div><span className="rounded-full border border-emerald-400/25 px-3 py-1 text-xs text-emerald-300">P0 · approve pilot</span></div></section>

    <nav className="mt-6 flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">{(['board', 'tree', 'log', 'history'] as View[]).map(v => <button key={v} onClick={() => setView(v)} className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize ${view === v ? 'bg-white text-black' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>{v === 'log' ? 'Daily CEO Log' : v}</button>)}<div className="ml-auto flex flex-wrap gap-2"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks…" className="min-w-44 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-violet-400" /><select value={filter} onChange={e => setFilter(e.target.value as typeof filter)} className="rounded-xl border border-white/10 bg-[#15151b] px-3 py-2 text-sm"><option value="all">All tasks</option><option value="open">Open</option><option value="done">Completed</option></select></div></nav>

    {view === 'board' && <div className="mt-5 grid items-start gap-4 xl:grid-cols-4">{priorities.map(priority => <PriorityColumn key={priority} priority={priority} tasks={visible.filter(t => t.priority === priority)} onPatch={patchTask} onEdit={t => setEditing({ ...t })} onDelete={id => setTasks(all => all.filter(t => t.id !== id))} onDrag={setDragged} onDrop={() => { if (dragged) patchTask(dragged, { priority }); setDragged(null); }} />)}</div>}
    {view === 'tree' && <div className="mt-5 rounded-2xl border border-white/10 bg-white/[.025] p-5"><p className="mb-5 text-sm text-zinc-400">TIGER BRANDS GLOBAL — ACTIVE / CEO MISSION CONTROL</p>{priorities.map(p => <details key={p} open className="mb-3 rounded-xl border border-white/10 bg-black/20 p-4"><summary className="cursor-pointer font-bold" style={{ color: priorityMeta[p].color }}>{p} · {priorityMeta[p].title} <span className="text-zinc-600">({visible.filter(t => t.priority === p).length})</span></summary><div className="mt-3 border-l border-white/10 pl-4">{visible.filter(t => t.priority === p).map(t => <button key={t.id} onClick={() => setEditing({ ...t })} className={`block w-full py-2 text-left text-sm hover:text-violet-300 ${t.completed ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}>├─ {t.title} <span className="text-zinc-600">· {t.owner}</span></button>)}</div></details>)}</div>}
    {view === 'log' && <section className="mt-5 grid gap-4 lg:grid-cols-[.9fr_1.1fr]"><div className="rounded-2xl border border-white/10 bg-white/[.025] p-5"><h2 className="text-lg font-bold">Today’s CEO log</h2><p className="mt-1 text-sm text-zinc-500">Decisions, blockers, revenue notes, and agent outcomes.</p><textarea value={logText} onChange={e => setLogText(e.target.value)} rows={9} placeholder="What changed today?" className="mt-4 w-full rounded-xl border border-white/10 bg-black/30 p-4 text-sm outline-none focus:border-violet-400" /><button onClick={() => { if (logText.trim()) { setLogs(all => [{ id: crypto.randomUUID(), createdAt: new Date().toISOString(), text: logText.trim() }, ...all]); setLogText(''); } }} className="mt-3 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold">Save log entry</button></div><div className="space-y-3">{logs.length ? logs.map(l => <article key={l.id} className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><time className="text-xs text-violet-300">{new Date(l.createdAt).toLocaleString()}</time><p className="mt-2 whitespace-pre-wrap text-sm text-zinc-300">{l.text}</p></article>) : <Empty text="No log entries yet." />}</div></section>}
    {view === 'history' && <section className="mt-5 space-y-3">{snapshots.length ? snapshots.map(s => <details key={s.id} className="rounded-2xl border border-white/10 bg-white/[.025] p-5"><summary className="cursor-pointer"><span className="font-bold">{new Date(s.createdAt).toLocaleString()}</span><span className="ml-3 text-sm text-zinc-500">{money(s.goal.current)} · {s.tasks.filter(t => t.completed).length}/{s.tasks.length} complete</span></summary><div className="mt-4 grid gap-4 text-sm sm:grid-cols-3"><Metric label="Revenue" value={money(s.goal.current)} /><Metric label="Remaining" value={money(Math.max(0, s.goal.target - s.goal.current))} /><Metric label="P0 open" value={String(s.tasks.filter(t => t.priority === 'P0' && !t.completed).length)} /></div>{s.note && <p className="mt-4 whitespace-pre-wrap rounded-xl bg-black/25 p-4 text-sm text-zinc-400">{s.note}</p>}<button onClick={() => { setGoal(s.goal); setTasks(structuredClone(s.tasks)); }} className="mt-4 text-xs font-bold text-violet-300 hover:text-white">Restore this snapshot</button></details>) : <Empty text="No snapshots yet. Use “Save today snapshot” at the end of each workday." />}</section>}
    <footer className="mt-10 border-t border-white/10 py-5 text-xs text-zinc-600">Data stays in this browser via localStorage. Use Export / Import for backup and transfer. No Shopify, GitHub, or payment secrets are stored.</footer>
  </div>{editing && <TaskModal task={editing} setTask={setEditing} onSave={saveTask} onClose={() => setEditing(null)} />}</main>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-white/10 bg-black/25 p-4"><p className="text-[11px] uppercase tracking-wider text-zinc-500">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>; }
function Empty({ text }: { text: string }) { return <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500">{text}</div>; }

function PriorityColumn({ priority, tasks, onPatch, onEdit, onDelete, onDrag, onDrop }: { priority: Priority; tasks: Task[]; onPatch: (id: string, patch: Partial<Task>) => void; onEdit: (task: Task) => void; onDelete: (id: string) => void; onDrag: (id: string) => void; onDrop: () => void }) {
  const meta = priorityMeta[priority];
  return <section onDragOver={e => e.preventDefault()} onDrop={onDrop} className="min-h-40 rounded-2xl border border-white/10 bg-white/[.02] p-3"><div className="mb-3 flex items-center justify-between px-1"><div><p className="text-sm font-black" style={{ color: meta.color }}>{priority} · {meta.title}</p><p className="mt-0.5 text-[11px] text-zinc-600">{meta.subtitle}</p></div><span className="rounded-full bg-white/5 px-2 py-1 text-xs text-zinc-400">{tasks.length}</span></div><div className="space-y-3">{tasks.map(task => <TaskCard key={task.id} task={task} onPatch={onPatch} onEdit={onEdit} onDelete={onDelete} onDrag={onDrag} />)}</div></section>;
}
function TaskCard({ task, onPatch, onEdit, onDelete, onDrag }: { task: Task; onPatch: (id: string, patch: Partial<Task>) => void; onEdit: (task: Task) => void; onDelete: (id: string) => void; onDrag: (id: string) => void }) {
  return <article draggable onDragStart={() => onDrag(task.id)} className={`rounded-xl border bg-[#141419] p-3.5 shadow-lg shadow-black/10 transition hover:border-violet-400/35 ${task.completed ? 'border-emerald-400/15 opacity-60' : 'border-white/10'}`}><div className="flex gap-3"><input aria-label={`Complete ${task.title}`} type="checkbox" checked={task.completed} onChange={e => onPatch(task.id, { completed: e.target.checked, status: e.target.checked ? 'Completed' : 'Open' })} className="mt-1 h-5 w-5 accent-violet-500" /><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Task {task.id.slice(0, 8)}</p><h3 className={`mt-1 text-sm font-bold leading-snug ${task.completed ? 'line-through' : ''}`}>{task.title}</h3><p className="mt-2 truncate text-[11px] text-zinc-500">{task.owner}</p></div></div><div className="mt-3 flex items-center gap-2"><select aria-label="Move priority" value={task.priority} onChange={e => onPatch(task.id, { priority: e.target.value as Priority })} className="rounded-lg border border-white/10 bg-[#1b1b22] px-2 py-1 text-[11px]">{priorities.map(p => <option key={p}>{p}</option>)}</select><span className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-zinc-500">{task.status}</span><span className="ml-auto text-[10px] text-zinc-600">{task.dueDate}</span></div><details className="mt-3 border-t border-white/10 pt-3"><summary className="cursor-pointer text-xs font-bold text-violet-300">Task brief & Agent Prompt</summary><dl className="mt-3 space-y-2 text-xs"><Detail label="Next action" value={task.nextAction} /><Detail label="Dependencies" value={task.dependencies} />{task.notes && <Detail label="Notes" value={task.notes} />}</dl><div className="mt-3 rounded-lg bg-black/35 p-3"><p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Agent prompt</p><p className="max-h-28 overflow-auto whitespace-pre-wrap text-[11px] leading-relaxed text-zinc-400">{buildAgentPrompt(task)}</p></div><div className="mt-3 flex gap-3 text-[11px] font-bold"><button onClick={() => navigator.clipboard.writeText(buildAgentPrompt(task))} className="text-violet-300 hover:text-white">Copy prompt</button><button onClick={() => onEdit(task)} className="text-zinc-400 hover:text-white">Edit</button><button onClick={() => confirm(`Delete “${task.title}”?`) && onDelete(task.id)} className="ml-auto text-red-400 hover:text-red-300">Delete</button></div></details></article>;
}
function Detail({ label, value }: { label: string; value: string }) { return <div><dt className="font-bold text-zinc-500">{label}</dt><dd className="mt-0.5 leading-relaxed text-zinc-300">{value || 'None'}</dd></div>; }
function TaskModal({ task, setTask, onSave, onClose }: { task: Task; setTask: (task: Task) => void; onSave: () => void; onClose: () => void }) {
  const field = (key: keyof Task, value: string) => setTask({ ...task, [key]: value });
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm" onMouseDown={e => e.target === e.currentTarget && onClose()}><div className="max-h-[92vh] w-full max-w-2xl overflow-auto rounded-2xl border border-white/15 bg-[#121218] p-5 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-xl font-black">Edit task</h2><button onClick={onClose} className="text-2xl text-zinc-500">×</button></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Title" wide><input value={task.title} onChange={e => field('title', e.target.value)} className="input" autoFocus /></Field><Field label="Priority"><select value={task.priority} onChange={e => field('priority', e.target.value)} className="input">{priorities.map(p => <option key={p} value={p}>{p} · {priorityMeta[p].title}</option>)}</select></Field><Field label="Status"><input value={task.status} onChange={e => field('status', e.target.value)} className="input" /></Field><Field label="Owner / Agent"><input value={task.owner} onChange={e => field('owner', e.target.value)} className="input" /></Field><Field label="Due date"><input type="date" value={task.dueDate} onChange={e => field('dueDate', e.target.value)} className="input" /></Field><Field label="Dependencies" wide><textarea value={task.dependencies} onChange={e => field('dependencies', e.target.value)} className="input min-h-20" /></Field><Field label="Next action" wide><textarea value={task.nextAction} onChange={e => field('nextAction', e.target.value)} className="input min-h-20" /></Field><Field label="Notes" wide><textarea value={task.notes} onChange={e => field('notes', e.target.value)} className="input min-h-20" /></Field></div><div className="mt-5 flex justify-end gap-2"><button onClick={onClose} className="rounded-xl px-4 py-2 text-sm text-zinc-400">Cancel</button><button onClick={onSave} className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold">Save task</button></div></div></div>;
}
function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={wide ? 'sm:col-span-2' : ''}><span className="mb-1.5 block text-xs font-bold text-zinc-400">{label}</span>{children}</label>; }
