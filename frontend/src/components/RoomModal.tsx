import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import Input from "./Input";
import Button from "./Button";
import type { IRoom } from "../interfaces/roomInterface";
import type { IProperty } from "../interfaces/propertyInterface";
import type { IUser } from "../interfaces/userInterface";

interface Props {
  mode: "edit" | "create";
  room?: IRoom;
  onClose: () => void;
  setRooms: React.Dispatch<React.SetStateAction<IRoom[]>>;
}

const RoomModal: React.FC<Props> = ({
  mode,
  room,
  onClose,
  setRooms,
}) => {
  /* ---------- local form state ---------- */
  const [roomNumber,    setRoomNumber]    = useState(room?.roomNumber  || "");
  const [type,          setType]          = useState<IRoom["type"]>(room?.type || "single");
  const [dailyRent,     setDailyRent]     = useState(room?.daily_rent  ?? 0);
  const [monthlyRent,   setMonthlyRent]   = useState(room?.monthly_rent ?? 0);
  const [yearlyRent,    setYearlyRent]    = useState(room?.yearly_rent  ?? 0);
  const [status,        setStatus]        = useState<IRoom["status"]>(room?.status || "available");
  const [propertyId,    setPropertyId]    = useState(room?.propertyId?._id || "");
  const [assignedToId,  setAssignedToId]  = useState(room?.assignedTo?._id || "");

  /* ---------- dropdown data ---------- */
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [users,      setUsers]      = useState<IUser[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [loadingDDL, setLoadingDDL] = useState(false);   // fetching dropdowns

  /* ---------- load properties & users on mount ---------- */
  useEffect(() => {
    const loadDDL = async () => {
      setLoadingDDL(true);
      try {
        const [propRes, userRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/property`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_BASE_URL}/user/tenants`, { withCredentials: true }), // filter to tenants
        ]);
        console.log(propRes,userRes)
        if (!propRes.data.success || !userRes.data.success) throw new Error("DDL fetch failed");
        setProperties(propRes.data.properties);
        setUsers(userRes.data.tenants);
      } catch (err) {
        console.error(err);
        toast.error("Could not load dropdowns");
      } finally {
        setLoadingDDL(false);
      }
    };
    loadDDL();
  }, []);

  /* ---------- clear form after successful create ---------- */
  const clear = () => {
    setRoomNumber("");
    setType("single");
    setDailyRent(0);
    setMonthlyRent(0);
    setYearlyRent(0);
    setStatus("available");
    setPropertyId("");
    setAssignedToId("");
  };

  /* ---------- submit ---------- */
  const handleSubmit = async () => {
    if (
      !roomNumber ||
      !dailyRent ||
      !monthlyRent ||
      !propertyId
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      roomNumber,
      type,
      daily_rent:  +dailyRent,
      monthly_rent:+monthlyRent,
      yearly_rent: yearlyRent ? +yearlyRent : 0,
      status,
      propertyId,
      assignedTo: assignedToId || undefined,
    };

    try {
      setLoading(true);

      if (mode === "edit" && room) {
        /* -------- UPDATE -------- */
        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/room/${room._id}`,
          payload,
          { withCredentials: true },
        );
        if (!res.data.success) throw new Error(res.data.message);
        setRooms(prev =>
          prev.map(r => (r._id === room._id ? res.data.room : r)),
        );
        toast.success("Room updated");
      } else {
        /* -------- CREATE -------- */
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/room/new`,
          payload,
          { withCredentials: true },
        );
        if (!res.data.success) throw new Error(res.data.message);
        setRooms(prev => [...prev, res.data.room]);
        toast.success("Room created");
        clear();
      }

      onClose();
    } catch (err: any) {
      console.error("Submit failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-lg relative">
        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {mode === "edit" ? "Edit Room" : "Create Room"}
        </h2>

        {/* room number */}
        <Input
          type="number"
          label="Room Number*"
          value={roomNumber}
          onChange={e => setRoomNumber(e.target.value)}
          disabled={loading}
        />

        {/* type */}
        <label className="block text-sm font-medium -mt-3">
          Type*
          <select
            className="w-full border rounded p-2 mt-1"
            value={type}
            onChange={e => setType(e.target.value as IRoom["type"])}
            disabled={loading}
          >
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="deluxe">Deluxe</option>
          </select>
        </label>

        {/* rents */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <Input
            label="Daily Rent*"
            type="number"
            value={dailyRent.toString()}
            onChange={e => setDailyRent(+e.target.value)}
            disabled={loading}
          />
          <Input
            label="Monthly Rent*"
            type="number"
            value={monthlyRent.toString()}
            onChange={e => setMonthlyRent(+e.target.value)}
            disabled={loading}
          />
          <Input
            label="Yearly Rent"
            type="number"
            value={yearlyRent.toString()}
            onChange={e => setYearlyRent(+e.target.value)}
            disabled={loading}
          />
        </div>

        {/* status */}
        <label className="block mb-2 -mt-3 text-sm font-medium">
          Status*
          <select
            className="w-full border rounded p-2 mt-1"
            value={status}
            onChange={e => setStatus(e.target.value as IRoom["status"])}
            disabled={loading}
          >
            <option value="available">Available</option>
            <option value="booked">Booked</option>
          </select>
        </label>

        {/* property dropdown */}
        <label className="block mb-2 text-sm font-medium">
          Property*
          <select
            className="w-full border rounded p-2 mt-1"
            value={propertyId}
            onChange={e => setPropertyId(e.target.value)}
            disabled={loading || loadingDDL}
          >
            <option value="">Select property</option>
            {properties.map(p => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        {/* user dropdown */}
        <label className="block mb-4 text-sm font-medium">
          Assign to Tenant
          <select
            className="w-full border rounded p-2 mt-1"
            value={assignedToId}
            onChange={e => setAssignedToId(e.target.value)}
            disabled={loading || loadingDDL}
          >
            <option value="">(optional) Select tenant</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </label>

        {/* submit */}
        <Button onClick={handleSubmit} disabled={loading} fullWidth>
          {loading
            ? mode === "edit"
              ? "Saving..."
              : "Creating..."
            : mode === "edit"
              ? "Save Changes"
              : "Create Room"}
        </Button>
      </div>
    </div>
  );
};

export default RoomModal;
