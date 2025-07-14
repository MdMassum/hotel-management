interface TBProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }
  const ToolbarButton = ({ icon, label, onClick }: TBProps) => (
    <button
      className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs font-medium"
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );

  export default ToolbarButton