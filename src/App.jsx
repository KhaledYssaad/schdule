import { useState } from "react";
import useScheduleStore from "./store/scheduleStore";
import { getWeekLabel } from "./utils/dateHelpers";
import ScheduleBoard from "./components/ScheduleBoard";
import HistoryTab from "./components/HistoryTab";
import JSONUploader from "./components/JSONUploader";
import UserSelectionModal from "./components/UserSelectionModal";

export default function App() {
  const [tab, setTab] = useState("schedule");
  const hasHydrated = useScheduleStore((s) => s._hasHydrated);
  const isUserSelected = useScheduleStore((s) => s.isUserSelected);

  if (!hasHydrated)
    return <div className="p-10 text-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      {!isUserSelected && <UserSelectionModal />}

      <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700">
        <div>
          <h1 className="text-3xl font-bold text-white">Shared Moments</h1>
          <p className="text-slate-400">{getWeekLabel()}</p>
        </div>
      </header>

      <nav className="flex gap-4 mb-6">
        {["schedule", "history", "import"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`capitalize px-4 py-2 rounded-lg font-semibold ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-white"}`}
          >
            {t}
          </button>
        ))}
      </nav>

      <main>
        {tab === "schedule" && <ScheduleBoard />}
        {tab === "history" && <HistoryTab />}
        {tab === "import" && <JSONUploader />}
      </main>
    </div>
  );
}
