import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
  } from "@tanstack/react-table";
  import type { ColumnDef, SortingState } from "@tanstack/react-table";
  import { useState } from "react";
  import { FileText, ClipboardCopy, Printer, Download } from "lucide-react";
  import * as XLSX from "xlsx";
  import Papa from "papaparse";
  import { saveAs } from "file-saver";
import ToolbarButton from "./ToolbarButton";
  
  export interface AdminTableProps<TData extends object> {
    /** Column definitions (TanStack’s typed ColumnDef) */
    columns: ColumnDef<TData, any>[];
    /** Your data array */
    data: TData[];
    /** Add action buttons per row (e.g. Edit / Remove) */
    renderRowActions?: (row: TData) => React.ReactNode;
    /** Toggle export buttons */
    enableExport?: boolean;
    /** ClassName overrides */
    className?: string;
  }
  
  export default function Table<TData extends object>({
    columns,
    data,
    renderRowActions,
    enableExport = true,
    className = "",
  }: AdminTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
  
    const table = useReactTable({
      columns,
      data,
      state: { sorting, globalFilter },
      onSortingChange: setSorting,
      globalFilterFn: "auto",
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });
  
    // ---------- simple exporters ----------
    const exportCSV = () =>
      saveAs(
        new Blob([Papa.unparse(table.getRowModel().rows.map(r => r.original))]),
        "table.csv"
      );
  
    const exportExcel = () => {
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(table.getRowModel().rows.map(r => r.original)),
        "Sheet1"
      );
      XLSX.writeFile(wb, "table.xlsx");
    };
  
    const exportCopy = async () => {
      const text = Papa.unparse(table.getRowModel().rows.map(r => r.original));
      await navigator.clipboard.writeText(text);
      alert("Copied !");
    };
  
    const exportPrint = () => window.print();
  
    return (
      <div className={`space-y-2 ${className}`}>
        {/* top bar */}
        <div className="flex flex-wrap justify-between gap-2">
          {enableExport && (
            <div className="flex gap-2">
              <ToolbarButton icon={<ClipboardCopy />} label="Copy" onClick={exportCopy} />
              <ToolbarButton icon={<FileText />} label="CSV" onClick={exportCSV} />
              <ToolbarButton icon={<Download />} label="Excel" onClick={exportExcel} />
              <ToolbarButton icon={<Printer />} label="Print" onClick={exportPrint} />
            </div>
          )}
  
          <input
            placeholder="Search…"
            value={globalFilter ?? ""}
            onChange={e => setGlobalFilter(e.target.value)}
            className="px-2 py-1 border rounded-md text-sm"
          />
        </div>
  
        {/* table */}
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(header => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-4 py-2 font-medium text-left cursor-pointer select-none"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="ml-1">
                          {header.column.getIsSorted() === "asc"
                            ? "▲"
                            : header.column.getIsSorted() === "desc"
                            ? "▼"
                            : ""}
                        </span>
                      )}
                    </th>
                  ))}
                  {renderRowActions && <th className="px-4 py-2">Options</th>}
                </tr>
              ))}
            </thead>
  
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="bg-white hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-2">
                    {(() => {
                      const value = flexRender(cell.column.columnDef.cell, cell.getContext());
                      return value === null || value === undefined || value === " " ? "NA" : value;
                    })()}
                  </td>
                  ))}
                  {renderRowActions && (
                    <td className="px-4 py-2">{renderRowActions(row.original)}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  