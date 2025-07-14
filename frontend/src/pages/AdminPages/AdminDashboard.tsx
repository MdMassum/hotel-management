import React, { useEffect, useState } from "react";
import axios from "axios";
import StatCard from "../../components/admin/Card";
import { Building2, Users2 } from "lucide-react";

export interface Note {
  _id: string;
  title: string;
  content: string;
  completed: boolean;
}

const AdminDashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/notes`,
        { withCredentials: true }
      );

      setNotes(res.data.notes);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    } finally {
      setLoading(false);
    }
  };

  const date = new Date();
  const today = date.toISOString()

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    
    <div className="flex flex-col">
      
      {/* header */}
      <div className="flex justify-between items-center">
        <span className="text-2xl font-semibold">Welcome To <span className="text-blue-600">Hotel Management System</span></span>
        <span>{today.split('T')[0]}</span>
      </div>

      <div className=" mt-4 flex flex-col gap-8">

      <div className="flex justify-between items-center">
        <StatCard 
        title="Total Rooms"
        value={38}
        icon={<Building2/>}
        />
        <StatCard 
        title="Unoccupied Rooms"
        value={28}
        icon={<Building2/>}
        />
        <StatCard 
        title="Occupied Rooms"
        value={14}
        icon={<Building2/>}
        />
        <StatCard 
        title="Total Properties"
        value={8}
        icon={<Building2/>}
        />
      </div>
      <div className="flex justify-between items-center">
        <StatCard 
        title="Total Tenants"
        value={38}
        icon={<Users2/>}
        />
        <StatCard 
        title="Inactive tenant"
        value={28}
        icon={<Users2/>}
        />
        <StatCard 
        title="Occupied Rooms"
        value={14}
        icon={<Building2/>}
        />
        <StatCard 
        title="Total Properties"
        value={8}
        icon={<Building2/>}
        />
      </div>
      <div className="flex justify-between items-center">
        <StatCard 
        title="Total Tenants"
        value={38}
        icon={<Users2/>}
        />
        <StatCard 
        title="Inactive tenant"
        value={28}
        icon={<Users2/>}
        />
        <StatCard 
        title="Occupied Rooms"
        value={14}
        icon={<Building2/>}
        />
        <StatCard 
        title="Total Properties"
        value={8}
        icon={<Building2/>}
        />
      </div>
      <div className="flex justify-between items-center">
        <StatCard 
        title="Total Tenants"
        value={38}
        icon={<Users2/>}
        />
        <StatCard 
        title="Inactive tenant"
        value={28}
        icon={<Users2/>}
        />
        <StatCard 
        title="Occupied Rooms"
        value={14}
        icon={<Building2/>}
        />
        <StatCard 
        title="Total Properties"
        value={8}
        icon={<Building2/>}
        />
      </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
