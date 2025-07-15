import React, { useEffect, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";

import Button from "../../components/Button";
import Table from "../../components/Table";
import PropertyModal from "../../components/PropertyModal";

/* ---------- row type ---------- */
export interface PropertyRow {
  _id: string;
  name: string;
  location: string;
  description: string;
  createdAt: string;
  createdBy: { name: string };
  updatedAt: string;
}

/* ---------- column defs ---------- */
const columns: ColumnDef<PropertyRow>[] = [
  { header: "#", cell: (info) => info.row.index + 1 },
  { accessorKey: "name", header: "Number/Name" },
  { accessorKey: "location", header: "Address" },
  { accessorKey: "description", header: "Remarks" },
  { accessorKey: "createdAt", header: "Created On" },
  { accessorKey: "createdBy.name", header: "Created By" },
  { accessorKey: "updatedAt", header: "Updated On" },
];

const PropertyPage: React.FC = () => {
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selected, setSelected] = useState<PropertyRow | null>(null);

  /* ---------- fetch ---------- */
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/property`, {
        withCredentials: true,
      });
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
      setProperties(res.data.properties);
    } catch (err: any) {
      console.error("Fetch error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- remove ---------- */
  const onRemove = async (property: PropertyRow) => {

    if(!window.confirm("Do You want to delete this Property?")){
      return;
    }
    setLoading(true);
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/property/${property._id}`,
        { withCredentials: true }
      );
      if (!res.data.success) {
        toast.error("Property delete failed");
        return;
      }
      setProperties((prev) => prev.filter((p) => p._id !== property._id));
      toast.success("Property deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- edit ---------- */
  const onEdit = (row: PropertyRow) => {
    setSelected(row);
    setEditModal(true);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* header */}
      <div className="flex justify-between items-center">
        <span className="text-2xl font-semibold text-blue-500">Properties</span>
        <Button onClick={() => setAddModal(true)} disabled={loading}>
          Add Property +
        </Button>
      </div>

      {/* create modal */}
      {addModal && (
        <PropertyModal
          mode="create"
          onClose={() => setAddModal(false)}
          setProperties={setProperties}
        />
      )}

      {/* edit modal */}
      {editModal && selected && (
        <PropertyModal
          mode="edit"
          property={selected}
          onClose={() => {
            setEditModal(false);
            setSelected(null);
          }}
          setProperties={setProperties}
        />
      )}

      {/* table */}
      <Table<PropertyRow>
        columns={columns}
        data={properties}
        renderRowActions={(row) => (
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(row)}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              onClick={() => onRemove(row)}
              disabled={loading}
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
