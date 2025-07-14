import React, { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Button from "../../components/Button";
import Table from "../../components/Table";
import { Pencil, Trash2 } from "lucide-react";
import PropertyModal from "../../components/PropertyModal";

/* ---------- row type ---------- */
type PropertyRow = {
  _id: number;
  name: string;
  location: string;
  description: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
};

/* ---------- column defs ---------- */
const columns: ColumnDef<PropertyRow>[] = [
  { header: "#", cell: info => info.row.index + 1 },
  { accessorKey: "name", header: "Number/Name" },
  { accessorKey: "location", header: "Address" },
  { accessorKey: "description", header: "Remarks" },
  { accessorKey: "createdOn", header: "Created On" },
  { accessorKey: "createdBy", header: "Created By" },
  { accessorKey: "updatedOn", header: "Updated On" },
];
const data = [
    {
        _id:"1",
        name:"massum",
        location:"dkfjdljf",
        description:"dlfjlkdjf fjdfjl",
        createdOn:"dlfkj",
        createdBy:"dkfjld",
        updatedOn:"dlfkj",
    },
    {
        _id:"2",
        name:"massum2",
        location:"dkfjdljf",
        description:"dlfjlkdjf fjdfjl",
        createdOn:"dlfkj",
        createdBy:"dkfjld",
        updatedOn:"dlfkj",
    },
    
]
const PropertyPage: React.FC = () => {
  /* replace with real data fetching (react‑query, SWR, etc.) */
//   const [data, setData] = useState<PropertyRow[]>([]);
const [addModal, setAddModal] = useState(false);
const [editModal, setEditModal] = useState(false);
const [properties, setProperties] = useState<PropertyRow[]>(data); // temp local store
const [selected, setSelected]   = useState<PropertyRow | null>(null); // row under edit

const onEdit = (row: PropertyRow) => {
  setSelected(row);         // 1️⃣ remember which row
  setEditModal(true);       // 2️⃣ show the modal
};

const closeEdit = () => {
  setEditModal(false);
  setSelected(null);
};

const handleEditSubmit = (updated: PropertyRow) => {
  // optimistic local update – replace the item by _id
  setProperties(prev =>
    prev.map(p => (p._id === updated._id ? updated : p))
  );

  // TODO: fire PUT /properties/:id here and sync with server

  closeEdit();
};

  const onRemove = (row: PropertyRow) => {
    /* TODO: confirmation + delete request */
    console.log("remove", row._id);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* header */}
      <div className="flex justify-between items-center">
        <span className="text-2xl font-semibold text-blue-500">Properties</span>
        <Button onClick={()=>setAddModal(true)}>Add Property +</Button>
      </div>

      {/* Add modal – unchanged */}
      {addModal && (
        <PropertyModal
          mode="create"
          onClose={() => setAddModal(false)}
          onSubmit={newRow => {
            setProperties(prev => [...prev, newRow]);
            setAddModal(false);
          }}
        />
      )}

      {/* Edit modal – only if a row is selected */}
      {editModal && selected && (
        <PropertyModal
          mode="edit"
          property={selected}
          onClose={closeEdit}
          onSubmit={handleEditSubmit}
        />
      )}


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

export default PropertyPage;
