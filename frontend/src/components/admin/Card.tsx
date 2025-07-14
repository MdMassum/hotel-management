// StatCard.tsx
import type { FC, ReactElement } from "react";

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactElement;
  onViewDetails?: () => void;
}

const StatCard: FC<StatCardProps> = ({ title, value, icon, onViewDetails }) => (
  <div className="rounded-md overflow-hidden shadow-sm w-56">
    {/* Top section */}
    <div className="bg-blue-500 flex justify-between items-start p-4 text-white">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium opacity-90">{title}</span>
        <span className="text-3xl font-bold leading-none">{value}</span>
      </div>

      {/* Icon wrapper (keeps icon aligned top‑right) */}
      <div className="text-blue-200">{icon}</div>
    </div>

    {/* Bottom bar */}
    <button
      type="button"
      onClick={onViewDetails}
      className="w-full bg-blue-700 hover:bg-blue-800 transition-colors flex items-center justify-center gap-1 py-2 text-white text-sm font-medium"
    >
      View Details
      {/* Right‑arrow icon from lucide-react */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
);

export default StatCard;
