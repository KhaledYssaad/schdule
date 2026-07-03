import { useGetWeeklyHistoryQuery } from "../store/apiSlice";

export default function HistoryTab() {
  const { data: history = [], isLoading, error } = useGetWeeklyHistoryQuery();

  if (isLoading)
    return <p className="p-4 text-slate-400">Loading history...</p>;
  if (error)
    return (
      <p className="p-4 text-amber-400">Could not load history right now.</p>
    );
  if (!history.length)
    return <p className="p-4 text-slate-500">No weekly history yet.</p>;

  return (
    <div className="space-y-4">
      {history.map((entry) => {
        const weekLabel = entry.week_label || entry.week || entry.week_start;
        const weekDate = entry.week_start ? new Date(entry.week_start) : null;

        return (
          <div
            key={entry.id}
            className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="font-semibold text-white">{weekLabel}</h3>
              <span className="text-sm text-slate-400">
                {weekDate ? weekDate.toLocaleDateString() : "No date"}
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
                <p className="text-sm font-semibold text-cyan-300">Lilia</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {Number(entry.lilia_progress ?? 0)}%
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
                <p className="text-sm font-semibold text-cyan-300">Abdellah</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {Number(entry.abdellah_progress ?? 0)}%
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
