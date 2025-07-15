import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import Input from "./Input";
import Button from "./Button";
import type { PropertyRow } from "../pages/AdminPages/PropertyPage"; // reuse the interface

interface Props {
  mode: "edit" | "create";
  property?: PropertyRow;
  onClose: () => void;
  setProperties: React.Dispatch<React.SetStateAction<PropertyRow[]>>;
}

const PropertyModal: React.FC<Props> = ({
  mode,
  property,
  onClose,
  setProperties,
}) => {
  const [name, setName]         = useState(property?.name || "");
  const [location, setLocation] = useState(property?.location || "");
  const [description, setDesc]  = useState(property?.description || "");
  const [loading, setLoading]   = useState(false);

  const clear = () => {
    setName("");
    setLocation("");
    setDesc("");
  };

  const handleSubmit = async () => {
    if (!name.trim() || !location.trim() || !description.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      /* -------- edit -------- */
      if (mode === "edit" && property) {
        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/property/${property._id}`,
          { name, location, description },
          { withCredentials: true },
        );
        if (!res.data.success) {
          toast.error(res.data.message || "Update failed");
          return;
        }
        // replace row in list
        setProperties(prev =>
          prev.map(p =>
            p._id === property._id ? res.data.property : p,
          ),
        );
        toast.success("Property updated");
      }

      /* -------- create -------- */
      if (mode === "create") {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/property/new`,
          { name, location, description },
          { withCredentials: true },
        );
        if (!res.data.success) {
          toast.error(res.data.message || "Creation failed");
          return;
        }
        setProperties(prev => [...prev, res.data.property]);
        toast.success("Property created");
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

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {mode === "edit" ? "Edit Property" : "Create Property"}
        </h2>

        <Input
          label="Name"
          placeholder="Property Name"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={loading}
        />

        <Input
          label="Address"
          placeholder="Address"
          value={location}
          onChange={e => setLocation(e.target.value)}
          disabled={loading}
        />

        <Input
          label="Description"
          placeholder="Remark"
          value={description}
          onChange={e => setDesc(e.target.value)}
          disabled={loading}
        />

        <Button onClick={handleSubmit} disabled={loading} fullWidth>
          {loading
            ? mode === "edit"
              ? "Saving..."
              : "Creating..."
            : mode === "edit"
              ? "Save Changes"
              : "Create Property"}
        </Button>
      </div>
    </div>
  );
};

export default PropertyModal;
