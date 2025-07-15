import React, { useEffect, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Button from "../../components/Button";
import Table from "../../components/Table";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import type { IUser } from "../../interfaces/userInterface";
import TenantModal from "../../components/TenantModal";

/* ---------- column defs ---------- */
const columns: ColumnDef<IUser>[] = [
  { header: "#", cell: info => info.row.index + 1 },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "idType", header: "IdType" },
  { accessorKey: "idNumber", header: "IdNumber" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "address", header: "Address" },
  { accessorKey: "note", header: "Remark" },
  { accessorKey: "assignedRoom", header: "Room Assigned" },

];

const TenantPage: React.FC = () => {

  const [tenants, setTenants] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selected, setSelected] = useState<IUser | null>(null);

  console.log(tenants)
  /* ---------- fetch ---------- */
  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/tenants`, {
        withCredentials: true,
      });
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
      setTenants(res.data.tenants);
    } catch (err: any) {
      console.error("Fetch error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- remove ---------- */
  const onRemove = async (tenant: IUser) => {

    if(!window.confirm("Do You want to delete this Tenant?")){
      return;
    }
    setLoading(true);
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/user/${tenant._id}`,
        { withCredentials: true }
      );
      if (!res.data.success) {
        toast.error("Tenant delete failed");
        return;
      }
      setTenants((prev) => prev.filter((p) => p._id !== tenant._id));
      toast.success("Tenant deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- edit ---------- */
  const onEdit = (row: IUser) => {
    setSelected(row);
    setEditModal(true);
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* header */}
      <div className="flex justify-between items-center">
        <span className="text-2xl font-semibold text-blue-500">Tenants</span>
        <Button onClick={() => setAddModal(true)} disabled={loading}>
          Add Tenant +
        </Button>
      </div>

      {/* create modal */}
      {addModal && (
        <TenantModal
          mode="create"
          onClose={() => setAddModal(false)}
          setTenants={setTenants}
        />
      )}

      {/* edit modal */}
      {editModal && selected && (
        <TenantModal
          mode="edit"
          tenant={selected}
          onClose={() => {
            setEditModal(false);
            setSelected(null);
          }}
          setTenants={setTenants}
        />
      )}

      {/* table */}
      <Table<IUser>
        columns={columns}
        data={tenants}
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
