const EventSkeleton = () => (
  <div className="flex flex-col bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
    <div className="h-7 bg-slate-200 rounded-lg w-3/4 mb-4"></div>

    <div className="space-y-2 mb-6">
      <div className="h-4 bg-slate-100 rounded w-full"></div>
      <div className="h-4 bg-slate-100 rounded w-5/6"></div>
    </div>

    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
      </div>
    </div>

    <div className="mt-6 pt-4 border-t border-slate-50">
      <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
    </div>
  </div>
);

export default EventSkeleton;
