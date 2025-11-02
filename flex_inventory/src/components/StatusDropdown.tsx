import React, { useState } from "react";
import axios from "axios";
import type { Reservation } from "../TraditionalTableDisplay";

interface StatusDropdownProps {
  reservation: Reservation;
  reloadReservations: () => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ reservation,reloadReservations }) => {
  const [status, setStatus] = useState(reservation.status);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);

    try {
      // Call your NestJS backend API (adjust URL if needed)
      await axios.patch(
        `http://localhost:4500/reservations/${reservation.id}/status`,
        { status: newStatus }
      );

      await reloadReservations();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={loading}
        className="border border-gray-300 rounded-md text-sm p-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="pending">Pending</option>
        <option value="issue">Issued</option>
        <option value="collect">Collected</option>
      </select>
    </div>
  );
};

export default StatusDropdown;
