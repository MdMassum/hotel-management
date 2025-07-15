import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import Input from "./Input";
import Button from "./Button";
import type { IRoom } from "../interfaces/roomInterface";
import type { IUser } from "../interfaces/userInterface";

interface Props {
  mode: "edit" | "create";
  tenant?: IUser;
  onClose: () => void;
  setTenants: React.Dispatch<React.SetStateAction<IUser[]>>;
}

const TenantModal: React.FC<Props> = ({
  mode,
  tenant,
  onClose,
  setTenants,
}) => {
  /* ---------- local form state ---------- */
  const [name,        setName]        = useState(tenant?.name        ?? "");
  const [email,       setEmail]       = useState(tenant?.email       ?? "");
  const [password,    setPassword]    = useState("");
  const [phone,       setPhone]       = useState(tenant?.phone       ?? "");
  const [idType,      setIdType]      = useState<IUser["idType"]>(tenant?.idType ?? "aadhar");
  const [idNumber,    setIdNumber]    = useState(tenant?.idNumber    ?? "");
  const [status,      setStatus]      = useState<IUser["status"]>(tenant?.status ?? "active");
  const [address,     setAddress]     = useState(tenant?.address     ?? "");
  const [note,        setNote]        = useState(tenant?.note        ?? "");
  const [assignedRoomId, setAssignedRoomId] = useState(tenant?.assignedRoom?._id ?? "");

  /* ---------- dropdown data ---------- */
  const [rooms,   setRooms]   = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [ddlLoading, setDdlLoading] = useState(false);

  /* ---------- load rooms once ---------- */
  useEffect(() => {
    const loadRooms = async () => {
      setDdlLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/room`,
          { withCredentials: true }
        );
        if (!data.success) throw new Error(data.message);
        setRooms(data.rooms);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load rooms");
      } finally {
        setDdlLoading(false);
      }
    };
    loadRooms();
  }, []);

  /* ---------- clear after create ---------- */
  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setIdType("aadhar");
    setIdNumber("");
    setStatus("active");
    setAddress("");
    setNote("");
    setAssignedRoomId("");
  };

  /* ---------- submit ---------- */
  const handleSubmit = async () => {
    if (!name || !email || (mode === "create" && !password)) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload: Partial<IUser> & { password?: string } = {
      name,
      email,
      phone,
      idType,
      idNumber,
      status,
      address,
      note,
      ...(password && { password }),
      ...(assignedRoomId && { assignedRoom: assignedRoomId }),
    };

    try {
      setLoading(true);
      if (mode === "edit" && tenant) {
        /* -------- UPDATE -------- */
        const { data } = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/user/${tenant._id}`,
          payload,
          { withCredentials: true }
        );
        if (!data.success) throw new Error(data.message);
        setTenants(prev => prev.map(t => (t._id === tenant._id ? data.user : t)));
        toast.success("Tenant updated");
      } else {
        /* -------- CREATE -------- */
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/user/register`,
          { ...payload, role: "tenant" },
          { withCredentials: true }
        );
        if (!data.success) throw new Error(data.message);
        setTenants(prev => [...prev, data.user]);
        toast.success("Tenant created");
        clearForm();
      }
      onClose();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div className="relative w-[90%] max-w-md rounded-xl bg-white p-6 shadow-lg">
    {/* close button */}
    <button
      onClick={onClose}
      className="absolute right-3 top-3 text-gray-500 hover:text-red-600"
    >
      <X size={20} />
    </button>

    <h2 className="mb-4 text-xl font-semibold">
      {mode === "edit" ? "Edit Tenant" : "Create Tenant"}
    </h2>

    {/* scrollable form area */}
    <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-1 pt-2">
      <Input
        label="Name*"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        disabled={loading}
      />
      <Input
        label="Email*"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={loading}
      />

      {mode === "create" && (
        <Input
          label="Password*"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
          fullWidth
        />
      )}
      {mode === "create" && <div />} {/* filler */}

      <Input
        label="Phone"
        placeholder="Phone"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        disabled={loading}
      />
      <Input
        label="Address"
        placeholder="Address"
        value={address}
        onChange={e => setAddress(e.target.value)}
        disabled={loading}
      />

      {/* ID Type + Number */}
      <label className="text-sm font-medium -mt-4">
        ID Type
        <select
          className="mt-1 w-full rounded border p-2"
          value={idType}
          onChange={e => setIdType(e.target.value as IUser["idType"])}
          disabled={loading}
        >
          <option value="aadhar">Aadhar</option>
          <option value="passport">Passport</option>
          <option value="driving_license">Driving License</option>
          <option value="other">Other</option>
        </select>
      </label>
      <Input
        label="ID Number"
        placeholder="ID Number"
        value={idNumber}
        onChange={e => setIdNumber(e.target.value)}
        disabled={loading}
      />

      {/* Status */}
      <label className="text-sm font-medium">
        Status
        <select
          className="mt-1 w-full rounded border p-2"
          value={status}
          onChange={e => setStatus(e.target.value as IUser["status"])}
          disabled={loading}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </label>

      {/* Room Dropdown */}
      <label className="text-sm font-medium">
        Assign Room
        <select
          className="mt-1 w-full rounded border p-2"
          value={assignedRoomId}
          onChange={e => setAssignedRoomId(e.target.value)}
          disabled={loading || ddlLoading}
        >
          <option value="">(optional) Select room</option>
          {rooms.map(r => (
            <option key={r._id} value={r._id}>
              {r.roomNumber}
            </option>
          ))}
        </select>
      </label>

      {/* Remark full width */}
      <div className="col-span-2">
        <Input
          label="Remark"
          value={note}
          onChange={e => setNote(e.target.value)}
          disabled={loading}
        />
      </div>
    </div>

    {/* Submit button */}
    <div className="mt-4">
      <Button onClick={handleSubmit} disabled={loading} fullWidth>
        {loading
          ? mode === "edit"
            ? "Saving..."
            : "Creating..."
          : mode === "edit"
            ? "Save Changes"
            : "Create Tenant"}
      </Button>
    </div>
  </div>
</div>

  )
};

export default TenantModal;
