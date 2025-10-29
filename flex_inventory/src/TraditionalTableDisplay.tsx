import React, { useState, useEffect } from "react";
import { NavLink } from "react-router";

interface Reservation {
  id: string;
  name: string;
  lastName: string;
  email: string;
  driverLicense: string;
  phone: string;
  trailerNumber: string;
  truckNumber: string;
  references: string[];
  date: string;
  time: string;
}

const ReservationSystem: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<
    Reservation[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Fixed: Get today's date in consistent format
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Local YYYY-MM-DD
  };

  // Fixed: Format date for consistent comparison
  const formatDateForComparison = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Local YYYY-MM-DD
  };
  const API_BASE_URL = "http://localhost:4500";

  useEffect(() => {
    fetch(`${API_BASE_URL}/reservations`)
      .then((response) => response.json())
      .then((data) => {
        setReservations(data);
        setFilteredReservations(data);

        // Set today's date as default filter
        setSelectedDate(getTodayDate());
      })
      .catch((error) => console.error("Error fetching reservations:", error));
  }, []);

  // Filter reservations when date or time changes - FIXED
  useEffect(() => {
    let filtered = reservations;

    // Filter by date - FIXED: Use consistent date formatting
    if (selectedDate) {
      filtered = filtered.filter(
        (res) => formatDateForComparison(res.date) === selectedDate
      );
    }

    // Filter by time
    if (selectedTime) {
      filtered = filtered.filter((res) => res.time === selectedTime);
    }

    setFilteredReservations(filtered);
  }, [selectedDate, selectedTime, reservations]);

  // Get unique dates from reservations for dropdown - FIXED
  const getUniqueDates = () => {
    const dates = [
      ...new Set(reservations.map((res) => formatDateForComparison(res.date))),
    ];
    return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  };

  // Get unique times from reservations for dropdown
  const getUniqueTimes = () => {
    const times = [...new Set(reservations.map((res) => res.time))];
    return times.sort((a, b) => a.localeCompare(b));
  };

  // Function to clear all reservations - UPDATED for API
  const clearAllReservations = async () => {
    if (window.confirm("Are you sure you want to clear all reservations?")) {
      try {
        // If you want to delete all via API, you'll need to implement this endpoint
        // For now, just clear the local state
        setReservations([]);
        setFilteredReservations([]);
        setSelectedDate(getTodayDate());
        setSelectedTime("");

        // Optional: Call API to delete all reservations
        // await fetch(`${API_BASE_URL}/reservations`, { method: 'DELETE' });
      } catch (error) {
        console.error("Error clearing reservations:", error);
      }
    }
  };

  // Function to delete single reservation - UPDATED for API
  const deleteReservation = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/reservations/${id}`, {
        method: "DELETE",
      });

      // Update local state after successful deletion
      const updatedReservations = reservations.filter((res) => res.id !== id);
      setReservations(updatedReservations);
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedDate(getTodayDate());
    setSelectedTime("");
  };

  // Calculate today's reservations count - FIXED
  const getTodaysReservationsCount = () => {
    const today = getTodayDate();
    return reservations.filter(
      (res) => formatDateForComparison(res.date) === today
    ).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Reservations
              </h1>
              <p className="text-gray-600">
                Showing {filteredReservations.length} of {reservations.length}{" "}
                reservations
                {selectedDate && ` for ${selectedDate}`}
                {selectedTime && ` at ${selectedTime}`}
              </p>
            </div>

            {reservations.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={resetFilters}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200 text-sm"
                >
                  Reset Filters
                </button>
                <button
                  onClick={clearAllReservations}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 text-sm"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Filter Controls */}
          {reservations.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Dates</option>
                    {getUniqueDates().map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Times</option>
                    {getUniqueTimes().map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Date Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Filters
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedDate(getTodayDate())}
                      className={`cursor-pointer flex-1 px-3 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                        selectedDate === getTodayDate()
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setSelectedDate("")}
                      className={`cursor-pointer flex-1 px-3 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                        selectedDate === ""
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      All Dates
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {(selectedDate || selectedTime) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedDate && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Date: {selectedDate}
                      <button
                        onClick={() => setSelectedDate("")}
                        className="cursor-pointer ml-1 hover:text-blue-600"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedTime && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Time: {selectedTime}
                      <button
                        onClick={() => setSelectedTime("")}
                        className="ml-1 hover:text-green-600"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Cards - FIXED: Use the helper function */}
        {filteredReservations.length > 0 && (
          <div className="mb-6 mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Filtered Reservations</div>
              <div className="text-2xl font-bold text-gray-800">
                {filteredReservations.length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Today's Reservations</div>
              <div className="text-2xl font-bold text-blue-600">
                {getTodaysReservationsCount()}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Unique Trucks</div>
              <div className="text-2xl font-bold text-green-600">
                {
                  new Set(filteredReservations.map((res) => res.truckNumber))
                    .size
                }
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Total Reservations</div>
              <div className="text-2xl font-bold text-orange-600">
                {reservations.length}
              </div>
            </div>
          </div>
        )}

        {/* Rest of your table code remains the same */}
        {filteredReservations.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Your table code here */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table headers and rows */}
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Truck
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Trailer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredReservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {reservation.name.charAt(0)}
                              {reservation.lastName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {reservation.name} {reservation.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {reservation.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reservation.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {reservation.date}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {reservation.truckNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {reservation.trailerNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono">
                          {reservation.references[0]}
                        </div>
                        {reservation.references.length > 1 && (
                          <div className="text-xs text-gray-500 mt-1">
                            +{reservation.references.length - 1} more
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="mr-2 from-blue-600 hover:text-blue-900 font-medium">
                          <NavLink
                            to={`/display-reservation/${reservation.id}`}
                          >
                            View
                          </NavLink>
                        </button>
                        <button
                          onClick={() => deleteReservation(reservation.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {reservations.length === 0
                ? "No Reservations Yet"
                : "No Matching Reservations"}
            </h3>
            <p className="text-gray-500 mb-4">
              {reservations.length === 0
                ? "Create your first reservation to see it here."
                : "Try changing your filters to see more results."}
            </p>
            {reservations.length > 0 && (
              <button
                onClick={resetFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationSystem;
