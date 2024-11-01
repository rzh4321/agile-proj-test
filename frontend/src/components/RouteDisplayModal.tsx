import { useState } from "react";
import { Button } from "./ui/button";

type RouteDisplayModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
};

export default function RouteDisplayModal({
  isOpen,
  onClose,
  onSave,
}: RouteDisplayModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(name, description);
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold text-center mb-4">Save List</h2>
        <hr className="mb-4" />
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">List Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Sunday, Luxury, Quick Run"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Description (optional):
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Lots of shoe stores"
          />
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-300 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleSave}
            className="bg-gray-300 text-gray-700"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
