'use client';

import { useEffect, useMemo, useState } from 'react';
import { brainSections, insights, missionTasks, type MissionTask } from './mission-data';

type View = 'tasks' | 'insights' | 'brain';
type TaskState = { completed: boolean; doneSteps: Record<number, boolean>; note: string };
type SavedState = { tasks: Record<string, TaskState> };

const STORAGE_KEY = 'tbg-ceo-mission-control-v2';
const GITHUB_ROOT = 'https://github.com/harelos/ceo-mission-control';

const priorityMeta = {
  P0: { label: 'לעשות קודם', className: 'border-red-400/30 bg-red-400/10 text-red-200' },
  P1: { label: 'ספרינט הכנסות', className: 'border-violet-400/30 bg-violet-400/10 text-violet-200' },
  P2: { label: 'מערכת ומינוף', className: 'border-blue-400/30 bg-blue-400/10 text-blue-200' },
} as const;

const emptyTaskState = (): TaskState => ({ completed: false, doneSteps: {}, note: '' });

export default function Home() {
  const [view, setView] = useState<View>('tasks');
  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState<MissionTask | null>(null);
  const [taskState, setTaskState] = useState<Record<string, TaskState>>({});
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SavedState;
        if (parsed.tasks) setTaskState(parsed.tasks);
      }
    } catch {
      // Keep clean defaults if local data is malformed.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks: taskState } satisfies SavedState));
  }, [taskState, hydrated]);

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return missionTasks;
    return missionTasks.filter(task => [
      task.id,
      task.title,
      task.status,
      task.objective,
      task.why,
      ...task.steps,
      ...(task.research || []),
    ].join(' ').toLowerCase().includes(q));
  }, [search]);

  const filteredInsights = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return insights;
    return insights.filter(item => `${item.id} ${item.title} ${item.detail}`.toLowerCase().includes(q));
  }, [search]);

  const completedCount = missionTasks.filter(task => taskState[task.id]?.completed).length;

  const getState = (id: string) => taskState[id] || emptyTaskState();

  const patchState = (id: string, patch: Partial<TaskState>) => {
    setTaskState(all => ({ ...all, [id]: { ...getState(id), ...patch } }));
  };

  const toggleStep = (task: MissionTask, index: number) => {
    const current = getState(task.id);
    const doneSteps = { ...current.doneSteps, [index]: !current.doneSteps[index] };
    patchState(task.id, { doneSteps });
  };

  const copyAgentPrompt = async (task: MissionTask) => {
    const prompt = buildAgentPrompt(task);
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(task.id);
      setTimeout(() => setCopied(null), 1400);
    } catch {
      window.prompt('העתק את ההוראות לסוכן:', prompt);
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#07070b] text-white">
      <div className="mx-auto max-w-[1540px] px-4 py-5 sm:px-7 lg:px-9">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="text-[11px] font-bold tracking-[.2em] text-violet-300">TIGER BRANDS GLOBAL</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">חדר השליטה של המנכ״ל</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">משימות, תובנות ומוח העסק באותו מקום. המספרים נשמרים מהשיחה כדי שאפשר יהיה לתת הערות בלי לאבד הקשר.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={GITHUB_ROOT} target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-200 hover:bg-white/10">GitHub</a>
            <a href={`${GITHUB_ROOT}/tree/main/business-brain`} target="_blank" rel="noreferrer" className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold hover:bg-violet-500">פתח את מוח העסק</a>
          </div>
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-3">
          <Metric label="משימות שנכנסו עד עכשיו" value={String(missionTasks.length)} hint="נוסיף את השאר אחרי ההערות שלך" />
          <Metric label="תובנות שסווגו" value={String(insights.length)} hint="לא הופכות אוטומטית למשימות" />
          <Metric label="הושלמו" value={`${completedCount}/${missionTasks.length}`} hint="נשמר מקומית בדפדפן" />
        </section>

        <section className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/[.06] p-4 text-sm leading-6 text-amber-100">
          <strong>הערת פרטיות:</strong> המאגר הזה ציבורי ב־GitHub כרגע. בניתי את מוח העסק בלי פרטי לקוחות, סיסמאות, אסימונים או פרטי תשלום. חומר רגיש לא נכנס למאגר הציבורי.
        </section>

        <nav className="mt-6 flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          <Tab active={view === 'tasks'} onClick={() => setView('tasks')}>משימות</Tab>
          <Tab active={view === 'insights'} onClick={() => setView('insights')}>תובנות</Tab>
          <Tab active={view === 'brain'} onClick={() => setView('brain')}>מוח העסק</Tab>
          <div className="mr-auto w-full sm:w-auto">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="חיפוש…" className="w-full min-w-56 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-400 sm:w-72" />
          </div>
        </nav>

        {view === 'tasks' && (
          <section className="mt-5 grid gap-4 lg:grid-cols-2">
            {filteredTasks.map(task => {
              const state = getState(task.id);
              const done = Object.values(state.doneSteps).filter(Boolean).length;
              return (
                <article key={task.id} className={`group rounded-[24px] border p-5 transition ${state.completed ? 'border-emerald-400/20 bg-emerald-400/[.04]' : 'border-white/10 bg-white/[.025] hover:border-violet-400/25 hover:bg-white/[.04]'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-3">
                      <span className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-white/10 text-lg font-black text-violet-200">{task.id}</span>
                      <div className="min-w-0">
                        <h2 className={`text-lg font-black leading-6 ${state.completed ? 'text-zinc-500 line-through' : 'text-white'}`}>{task.title}</h2>
                        <p className="mt-1 text-xs text-zinc-500">{task.status}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${priorityMeta[task.priority].className}`}>{task.priority} · {priorityMeta[task.priority].label}</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-zinc-300">{task.objective}</p>
                  <div className="mt-4 flex items-center justify-between gap-3 text-xs text-zinc-500">
                    <span>{done}/{task.steps.length} תתי־משימות</span>
                    <button onClick={() => setSelectedTask(task)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-bold text-violet-200 hover:bg-violet-500/10">פתח משימה ←</button>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {view === 'insights' && (
          <section className="mt-5 space-y-3">
            <div className="mb-4 rounded-2xl border border-violet-400/15 bg-violet-400/[.05] p-4 text-sm leading-6 text-zinc-300">תובנה היא משהו שצריך לזכור ולהשתמש בו בהחלטות, אבל אין סיבה להפוך אותה לכרטיס משימה רק כדי לסמן וי.</div>
            {filteredInsights.map(item => (
              <article key={item.id} className="grid gap-3 rounded-2xl border border-white/10 bg-white/[.025] p-5 sm:grid-cols-[64px_1fr]">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-lg font-black text-zinc-300">{item.id}</span>
                <div><h2 className="font-black text-white">{item.title}</h2><p className="mt-2 text-sm leading-6 text-zinc-400">{item.detail}</p></div>
              </article>
            ))}
          </section>
        )}

        {view === 'brain' && (
          <section className="mt-5">
            <div className="rounded-[24px] border border-violet-400/20 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,.22),transparent_42%),#0d0d13] p-5 sm:p-6">
              <p className="text-xs font-bold text-violet-300">מוח העסק · גרסה 1</p>
              <h2 className="mt-1 text-2xl font-black">מקור אמת אחד לאדם ולסוכן</h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-zinc-400">אותו מבנה קיים גם בממשק וגם כתיקיות וקבצים ב־GitHub. סוכן שמתחבר דרך GitHub, ממשק תכנות או שרת כלים מתחיל בקובץ ההוראות, קורא את האמת העסקית ואז נכנס לתחום הרלוונטי.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={`${GITHUB_ROOT}/blob/main/business-brain/AGENT_INSTRUCTIONS.md`} target="_blank" rel="noreferrer" className="rounded-xl bg-white px-4 py-2 text-sm font-black text-black">הוראות לסוכן</a>
                <a href={`${GITHUB_ROOT}/blob/main/business-brain/MANIFEST.json`} target="_blank" rel="noreferrer" className="rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-zinc-200">מפתח קריא למכונה</a>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {brainSections.map(section => (
                <a key={section.id} href={`${GITHUB_ROOT}/tree/main/${section.path}`} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-white/[.025] p-5 transition hover:border-violet-400/25 hover:bg-white/[.045]">
                  <div className="flex items-center gap-3"><span className="rounded-lg bg-violet-500/15 px-2.5 py-1 text-xs font-black text-violet-200">{section.id}</span><h3 className="font-black">{section.title}</h3></div>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{section.purpose}</p>
                  <p className="mt-3 border-r-2 border-violet-400/30 pr-3 text-xs leading-5 text-zinc-500">כלל לסוכן: {section.agentRule}</p>
                  <code dir="ltr" className="mt-4 block overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-black/30 px-3 py-2 text-[11px] text-zinc-500">{section.path}</code>
                </a>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-10 border-t border-white/10 py-5 text-xs leading-5 text-zinc-600">גרסה זו שומרת התקדמות והערות משימה בדפדפן. מקור הידע המשותף לסוכנים נמצא בתיקיית <span dir="ltr">business-brain/</span> ב־GitHub.</footer>
      </div>

      {selectedTask && (
        <TaskPanel
          task={selectedTask}
          state={getState(selectedTask.id)}
          onClose={() => setSelectedTask(null)}
          onToggleStep={index => toggleStep(selectedTask, index)}
          onNote={note => patchState(selectedTask.id, { note })}
          onComplete={completed => patchState(selectedTask.id, { completed })}
          onCopy={() => copyAgentPrompt(selectedTask)}
          copied={copied === selectedTask.id}
        />
      )}
    </main>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${active ? 'bg-white text-black' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>{children}</button>;
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><p className="text-xs font-bold text-zinc-500">{label}</p><p className="mt-1 text-2xl font-black">{value}</p><p className="mt-1 text-xs text-zinc-600">{hint}</p></div>;
}

function TaskPanel({ task, state, onClose, onToggleStep, onNote, onComplete, onCopy, copied }: {
  task: MissionTask;
  state: TaskState;
  onClose: () => void;
  onToggleStep: (index: number) => void;
  onNote: (note: string) => void;
  onComplete: (value: boolean) => void;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <aside dir="rtl" className="h-full w-full overflow-y-auto border-r border-white/10 bg-[#0b0b10] p-5 shadow-2xl sm:max-w-3xl sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex gap-3"><span className="flex h-12 min-w-12 items-center justify-center rounded-xl bg-violet-500/15 text-xl font-black text-violet-200">{task.id}</span><div><h2 className="text-xl font-black sm:text-2xl">{task.title}</h2><p className="mt-1 text-sm text-zinc-500">{task.status}</p></div></div>
          <button onClick={onClose} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white">סגור</button>
        </div>

        <InfoBlock title="המטרה"><p>{task.objective}</p></InfoBlock>
        <InfoBlock title="למה זה חשוב"><p>{task.why}</p></InfoBlock>

        <section className="mt-6">
          <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-black text-white">איך משיגים את המשימה</h3><span className="text-xs text-zinc-600">{Object.values(state.doneSteps).filter(Boolean).length}/{task.steps.length}</span></div>
          <div className="mt-3 space-y-2">
            {task.steps.map((step, index) => (
              <label key={index} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-sm leading-6 transition ${state.doneSteps[index] ? 'border-emerald-400/15 bg-emerald-400/[.04] text-zinc-500' : 'border-white/10 bg-white/[.025] text-zinc-300 hover:border-violet-400/20'}`}>
                <input type="checkbox" checked={!!state.doneSteps[index]} onChange={() => onToggleStep(index)} className="mt-1 h-4 w-4 accent-violet-500" />
                <span className={state.doneSteps[index] ? 'line-through' : ''}>{step}</span>
              </label>
            ))}
          </div>
        </section>

        {task.research && task.research.length > 0 && (
          <InfoBlock title="המחקר שנכנס למשימה">
            <ul className="space-y-2">{task.research.map((item, i) => <li key={i} className="rounded-lg bg-black/20 px-3 py-2">{item}</li>)}</ul>
          </InfoBlock>
        )}

        <InfoBlock title="איך נדע שסיימנו">
          <ul className="space-y-2">{task.success.map((item, i) => <li key={i}>• {item}</li>)}</ul>
        </InfoBlock>

        {task.links && task.links.length > 0 && (
          <InfoBlock title="קישורים">
            <div className="flex flex-wrap gap-2">{task.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="rounded-xl border border-violet-400/20 bg-violet-400/[.06] px-3 py-2 text-sm font-bold text-violet-200 hover:bg-violet-400/10">{link.label}</a>)}</div>
          </InfoBlock>
        )}

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[.025] p-4">
          <label className="text-sm font-black">הערות שלי</label>
          <textarea value={state.note} onChange={e => onNote(e.target.value)} rows={5} placeholder="מה גיליתי, מה חסר, למה לחזור…" className="mt-3 w-full rounded-xl border border-white/10 bg-black/25 p-3 text-sm leading-6 outline-none placeholder:text-zinc-700 focus:border-violet-400" />
        </section>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-zinc-300"><input type="checkbox" checked={state.completed} onChange={e => onComplete(e.target.checked)} className="h-4 w-4 accent-emerald-500" /> המשימה הושלמה</label>
          <button onClick={onCopy} className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-black hover:bg-violet-500">{copied ? 'הועתק ✓' : 'העתק הוראות לסוכן'}</button>
        </div>
      </aside>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-6 rounded-2xl border border-white/10 bg-white/[.025] p-4 text-sm leading-6 text-zinc-300"><h3 className="mb-2 text-sm font-black text-white">{title}</h3>{children}</section>;
}

function buildAgentPrompt(task: MissionTask) {
  return `אתה הסוכן שאחראי על משימה ${task.id}: ${task.title}.\n\nמטרה:\n${task.objective}\n\nלמה זה חשוב:\n${task.why}\n\nשלבי ביצוע:\n${task.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\nמדדי הצלחה:\n${task.success.map(item => `- ${item}`).join('\n')}\n\nלפני העבודה קרא את business-brain/AGENT_INSTRUCTIONS.md ואת business-brain/01-current-truth/README.md. הפרד בין עובדות, השערות, חסמים והמלצות. אל תבצע שינוי חי בחנות, בפרסום, בתקציב, בספקים או בשליחת הודעות ללא אישור מפורש.`;
}
