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
    <div
      style={{
        position: "fixed",
        inset: "0",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          width: "320px",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          Save List
        </h2>
        <hr
          style={{
            marginBottom: "16px",
          }}
        />
        <div
          style={{
            marginBottom: "16px",
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "4px",
            }}
          >
            List Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sunday, Luxury, Quick Run"
            style={{
              width: "100%",
              border: "1px solid #ddd",
              padding: "8px",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "4px",
            }}
          >
            Description (optional):
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Lots of shoe stores"
            style={{
              width: "100%",
              border: "1px solid #ddd",
              padding: "8px",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="outline"
            onClick={onClose}
            style={{
              backgroundColor: "#e5e7eb",
              color: "#374151",
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleSave}
            style={{
              backgroundColor: "#e5e7eb",
              color: "#374151",
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
