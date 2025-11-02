import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// ✅ Fixed Zod schema
const reservationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  driverLicense: z.string().min(3, "Driver License/ID is required"),
  phone: z.string().min(6, "Phone number is required"),
  trailerNumber: z.string().min(1, "Trailer number is required"),
  truckNumber: z.string().min(1, "Truck number is required"),
  references: z
    .array(z.string().min(1, "Reference is required"))
    .min(1, "At least one reference is required"),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

export default function CreateReservation() {
  const API_BASE_URL = "http://localhost:4500";
  const [referenceCount, setReferenceCount] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      driverLicense: "",
      phone: "",
      trailerNumber: "",
      truckNumber: "",
      references: [""], // Start with one empty reference
    },
  });

  const addReference = () => {
    setReferenceCount((prev) => prev + 1);
    const currentRefs = getValues("references") || [];
    setValue("references", [...currentRefs, ""]);
  };
  const removeReference = (index: number) => {
    if (referenceCount > 1) {
      setReferenceCount((prev) => prev - 1);
      const currentRefs = getValues("references") || [];
      const newRefs = currentRefs.filter((_, i) => i !== index);
      setValue("references", newRefs);
    }
  };

  const onSubmit = async (data: ReservationFormData) => {
    const now = new Date();

    // Create full reservation data
    const fullData = {
      ...data,
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    try {
      await axios.post(`${API_BASE_URL}/reservations/`, fullData, {
        headers: {
          "Content-Type": "application/json",
        },
        // Uncomment the next line if you want to send cookies with the request
        // withCredentials: true,
      });

      reset();
      setReferenceCount(1);
      alert("Reservation created successfully!");
    } catch (error: any) {
      console.error("Error creating reservation:", error);
      if (error.response) {
        // Server responded with a status other than 2xx
        alert(
          `Failed to create reservation. Server error: ${error.response.status}`
        );
      } else if (error.request) {
        // No response received
        alert("No response from server. Please try again.");
      } else {
        // Other errors
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Create Reservation
        </h1>
        <p className="text-gray-600 mb-6">
          Please fill in all the fields below to create a reservation.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Enter name"
              className="w-full h-8 border pl-2 rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              {...register("lastName")}
              type="text"
              placeholder="Enter last name"
              className="w-full h-8 border pl-2 rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter email"
              className="w-full h-8 border pl-2 rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Driver License */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Driver License / Passport / ID
            </label>
            <input
              {...register("driverLicense")}
              type="text"
              placeholder="Enter ID number"
              className="w-full h-8 border pl-2 rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.driverLicense && (
              <p className="text-red-500 text-xs mt-1">
                {errors.driverLicense.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              {...register("phone")}
              type="tel"
              placeholder="Enter phone number"
              className="w-full h-8 border pl-2 rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Trailer Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trailer Number
            </label>
            <input
              {...register("trailerNumber")}
              type="text"
              placeholder="Enter trailer number"
              className="w-full h-8 border pl-2 rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.trailerNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.trailerNumber.message}
              </p>
            )}
          </div>

          {/* Truck Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Truck Number
            </label>
            <input
              {...register("truckNumber")}
              type="text"
              placeholder="Enter truck number"
              className="w-full h-8 border pl-2 rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.truckNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.truckNumber.message}
              </p>
            )}
          </div>

          {/* References */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">
                Reference (TCM/TS/VN)
              </label>
              <button
                type="button"
                onClick={addReference}
                className="cursor-pointer text-blue-600 text-sm font-medium hover:underline"
              >
                + Add More
              </button>
            </div>

            {Array.from({ length: referenceCount }).map((_, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  {...register(`references.${index}` as const)}
                  type="text"
                  placeholder={`Enter reference ${index + 1}`}
                  className="w-full h-8 border pl-2 rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {referenceCount > 1 && (
                  <button
                    type="button"
                    onClick={() => removeReference(index)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            {/* Show reference errors */}
            {errors.references && (
              <p className="text-red-500 text-xs mt-1">
                {errors.references.message}
              </p>
            )}
            {errors.references?.[0] && (
              <p className="text-red-500 text-xs mt-1">
                {errors.references[0].message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg shadow hover:bg-blue-700 transition duration-200"
            >
              Create Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
