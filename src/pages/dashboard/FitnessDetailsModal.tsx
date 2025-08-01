import React, { useState } from "react";

const FitnessDetailsModal = ({ onClose }: { onClose: () => void }) => {
  const [completed, setCompleted] = useState(4);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{ background: "#fff", padding: 32, borderRadius: 16, minWidth: 300 }}>
        <h2 style={{ color: "#222" }}>Fitness Details</h2>
        <p>More details about your fitness goals will go here.</p>
        <button onClick={onClose} style={{ marginTop: 16 }}>Close</button>
        <button
          className="mt-6 w-full bg-white/10 text-white rounded-full"
          onClick={e => {
            e.stopPropagation();
            if (completed < 5) {
              setCompleted(completed + 1);
              alert("Workout marked as complete!"); // Replace with toast if you have one
            }
          }}
        >
          Complete 5 Workouts <span className="ml-2">{completed}/5</span>
        </button>
      </div>
    </div>
  );
};

export default FitnessDetailsModal;
