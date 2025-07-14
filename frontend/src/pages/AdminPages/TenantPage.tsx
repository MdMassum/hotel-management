import React, { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Button from "../../components/Button";
import Table from "../../components/Table";
import { Pencil, Trash2 } from "lucide-react";

/* ---------- row type ---------- */
type PropertyRow = {
  id: number;
  name: string;
  address: string;
  remarks: string;
  updatedOn: string;
  updatedBy: string;
};

/* ---------- column defs ---------- */
const columns: ColumnDef<PropertyRow>[] = [
  { header: "#", cell: info => info.row.index + 1 },
  { accessorKey: "name", header: "No/Name" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "idType", header: "Id Type" },
  { accessorKey: "idNumber", header: "Id Number" },
  { accessorKey: "room", header: "Room" },
  { accessorKey: "property", header: "Property" },

];
const data = [
    {
        name:"45",
        phone:"4097897897",
        email:"dfjld@gmail.com",
        status:"available",
        idType:"aadhar",
        idNumber:"203578723088",
        room:"879",
        property:"taj hotel",
        
    }
]
const TenantPage: React.FC = () => {
  /* replace with real data fetching (react‑query, SWR, etc.) */
//   const [data, setData] = useState<PropertyRow[]>([]);

  const onEdit = (row: PropertyRow) => {
    /* TODO: navigate to edit screen or open modal */
    console.log("edit", row.id);
  };

  const onRemove = (row: PropertyRow) => {
    /* TODO: confirmation + delete request */
    console.log("remove", row.id);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* header */}
      <div className="flex justify-between items-center">
        <span className="text-2xl font-semibold text-blue-500">Tenants</span>
        <Button>Add Tenant +</Button>
      </div>

      {/* table */}
      <Table<PropertyRow>
        columns={columns}
        data={data}
        renderRowActions={row => (
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(row)}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              onClick={() => onRemove(row)}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"
            >
              <Trash2 size={14} /> Remove
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default TenantPage;
