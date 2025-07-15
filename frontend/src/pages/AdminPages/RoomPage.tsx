import React, { useEffect, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Button from "../../components/Button";
import Table from "../../components/Table";
import { Pencil, Trash2 } from "lucide-react";
import type { IRoom } from "../../interfaces/roomInterface";
import axios from "axios";
import toast from "react-hot-toast";
import RoomModal from "../../components/RoomModal";

/* ---------- column defs ---------- */
const columns: ColumnDef<IRoom>[] = [
  { header: "#", cell: info => info.row.index + 1 },
  { accessorKey: "roomNumber", header: "Number/Name" },
  { accessorKey: "propertyId.name", header: "Property" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "daily_rent", header: "Daily Rent" },
  { accessorKey: "monthly_rent", header: "Monthly Rent" },
  { accessorKey: "yearly_rent", header: "Yearly Rent" },
  { accessorKey: "tenant", header: "Tenant" },

];

const RoomPage: React.FC = () => {

  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selected, setSelected] = useState<IRoom | null>(null);

  console.log(rooms)
  /* ---------- fetch ---------- */
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/room`, {
        withCredentials: true,
      });
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
      setRooms(res.data.rooms);
    } catch (err: any) {
      console.error("Fetch error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- remove ---------- */
  const onRemove = async (room: IRoom) => {

    if(!window.confirm("Do You want to delete this Room?")){
      return;
    }
    setLoading(true);
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/room/${room._id}`,
        { withCredentials: true }
      );
      if (!res.data.success) {
        toast.error("Room delete failed");
        return;
      }
      setRooms((prev) => prev.filter((p) => p._id !== room._id));
      toast.success("Room deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- edit ---------- */
  const onEdit = (row: IRoom) => {
    setSelected(row);
    setEditModal(true);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* header */}
      <div className="flex justify-between items-center">
        <span className="text-2xl font-semibold text-blue-500">Rooms</span>
        <Button onClick={() => setAddModal(true)} disabled={loading}>
          Add Room +
        </Button>
      </div>

      {/* create modal */}
      {addModal && (
        <RoomModal
          mode="create"
          onClose={() => setAddModal(false)}
          setRooms={setRooms}
        />
      )}

      {/* edit modal */}
      {editModal && selected && (
        <RoomModal
          mode="edit"
          room={selected}
          onClose={() => {
            setEditModal(false);
            setSelected(null);
          }}
          setRooms={setRooms}
        />
      )}

      {/* table */}
      <Table<IRoom>
        columns={columns}
        data={rooms}
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

export default RoomPage;
