import { useEffect, useState } from "react";
import { useParams } from "react-router";

interface ReservationData {
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

const ReservationDisplay = () => {
  const [data, setData] = useState<ReservationData>();
  let params = useParams();
  useEffect(() => {
    const reservations = localStorage.getItem("reservations");
    if (reservations) {
      const allReservations = JSON.parse(reservations);
      const reservation = allReservations.find(
        (res: ReservationData) => res.id === params.id
      );
      if (reservation) {
        setData(reservation);
      }
    }
  }, [params.id]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Reservation Details
          </h1>
          <p className="text-gray-600">
            Reservation created on {data?.date} at {data?.time}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Personal Information Section */}
          <div className="border-b border-gray-200">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
              <h2 className="text-xl font-semibold text-white">
                Personal Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Full Name</span>
                    <span className="text-gray-800">
                      {data?.name} {data?.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Email</span>
                    <span className="text-blue-600">{data?.email}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">
                      Driver License/ID
                    </span>
                    <span className="text-gray-800 font-mono">
                      {data?.driverLicense}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Phone</span>
                    <span className="text-gray-800">{data?.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information Section */}
          <div className="border-b border-gray-200">
            <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600">
              <h2 className="text-xl font-semibold text-white">
                Vehicle Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">T</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Truck Number</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {data?.truckNumber}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold">T</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Trailer Number</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {data?.trailerNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* References Section */}
          <div>
            <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600">
              <h2 className="text-xl font-semibold text-white">References</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {data?.references.map((reference, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-gray-800 font-medium">
                        {reference}
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      Reference
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Reservation Timeline
          </h3>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <p className="text-sm font-medium text-gray-800">Created</p>
              <p className="text-xs text-gray-600">{data?.date}</p>
              <p className="text-xs text-gray-600">{data?.time}</p>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">⏱</span>
              </div>
              <p className="text-sm font-medium text-gray-800">Pending</p>
              <p className="text-xs text-gray-600">Confirmation</p>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-gray-400 font-bold">✓</span>
              </div>
              <p className="text-sm font-medium text-gray-800">Completed</p>
              <p className="text-xs text-gray-600">-</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-4">
          <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200">
            Print Reservation
          </button>
          <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200">
            Confirm Reservation
          </button>
          <button className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition duration-200">
            Edit Details
          </button>
        </div>
      </div>
    </div>
  );
};

// Usage example:

export default ReservationDisplay;
