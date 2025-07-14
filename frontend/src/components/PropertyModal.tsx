
import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import Input from "./Input";
import Button from "./Button";
import type { IProperty } from "../interfaces/propertyInterface";

interface Props {
  mode: "edit" | "create";
  property?: IProperty;
  onClose: () => void;
  onSubmit: (property: IProperty) => void;
}

const PropertyModal: React.FC<Props> = ({ mode, property, onClose, onSubmit }) => {

  const [name, setName] = useState(property?.name || "");
  const [location, setLocation] = useState(property?.location || "");
  const [description, setDescription] = useState(property?.description || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !location.trim() || !description.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      if (mode === "edit" && property) {
        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/property/${property._id}`,
          { name, location, description },
          { withCredentials: true }
        );
        if (res.data.success === false) {
          toast.error("Property update failed");
          return;
        }
        toast.success("Property Updated Successfully");
        onSubmit(res.data.property);
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/property/new`,
          { name, location, description },
          { withCredentials: true }
        );
        if (res.data.success === false) {
          toast.error("Property creation failed");
          return;
        }
        toast.success("Property Created Successfully");
        onSubmit(res.data.property);
      }
      onClose();
    } catch (err) {
      console.error("Submit failed", err);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {mode === "edit" ? "Edit Property" : "Create Property"}
        </h2>

        <Input
          label="Name"
          type="text"
          placeholder="Enter Property Name"
          disabled={loading}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Address"
          type="text"
          placeholder="Enter Address"
          disabled={loading}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <Input
          label="Description"
          type="text"
          placeholder="Enter Remark"
          disabled={loading}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button onClick={handleSubmit} disabled={loading} fullWidth>
          {loading ? (mode === "edit" ? "Saving..." : "Creating...") : (mode === "edit" ? "Save Changes" : "Create Property")}
        </Button>
      </div>
    </div>
  );
};

export default PropertyModal;
