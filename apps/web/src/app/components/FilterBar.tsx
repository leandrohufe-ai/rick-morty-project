"use client";

export interface FilterBarProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

export function FilterBar({ statusFilter, onStatusChange }: FilterBarProps) {
  const statuses = ["", "Alive", "Dead", "unknown"];
  const statusLabels: Record<string, string> = {
    "": "Todos",
    Alive: "Vivos",
    Dead: "Mortos",
    unknown: "Desconhecido",
  };

  return (
    <div className="flex gap-3 flex-wrap">
      <label className="text-sm font-semibold text-gray-700 flex items-center">
        Status:
      </label>
      <div className="flex gap-2 flex-wrap">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>
    </div>
  );
}
