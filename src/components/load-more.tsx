"use client";

export function LoadMore({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="mt-stack-sm mx-auto block font-label-caps text-label-caps px-3 py-1.5 border border-outline-variant text-on-surface-variant rounded-md disabled:opacity-40 hover:bg-surface-container transition-colors duration-150 ease-out"
    >
      {loading ? "LOADING…" : "LOAD MORE"}
    </button>
  );
}
