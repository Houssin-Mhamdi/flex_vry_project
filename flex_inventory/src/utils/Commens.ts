// BASE URL
//  export const API_BASE_URL = "http://localhost:4500";
export const API_BASE_URL = "https://flex-vry-project.onrender.com";

//LIMIT
export const LIMIT = 5;
// Fixed: Get today's date in consistent format
export const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // Local YYYY-MM-DD
};

// Fixed: Format date for consistent comparison
export const formatDateForComparison = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // Local YYYY-MM-DD
};
