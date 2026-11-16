
// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
// } from "react";

// import { getDashboard } from "../services/dashboard.service";

// const DashboardContext = createContext();

// const STORAGE_KEY = "restaurantDashboard";

// export const DashboardProvider = ({ children }) => {
//   // Load previous dashboard data immediately
//   const [dashboard, setDashboard] = useState(() => {
//     try {
//       const cached = sessionStorage.getItem(STORAGE_KEY);
//       return cached ? JSON.parse(cached) : null;
//     } catch {
//       return null;
//     }
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const refreshDashboard = useCallback(async () => {
//     try {
//       setError(null);

//       // Only show loading when no cached data exists
//       if (!dashboard) {
//         setLoading(true);
//       }

//       const data = await getDashboard();

//       setDashboard(data);

//       // Save latest successful dashboard data
//       sessionStorage.setItem(
//         STORAGE_KEY,
//         JSON.stringify(data)
//       );

//     } catch (error) {
//       console.error("Dashboard Error:", error);

//       setError(error.message);

//     } finally {
//       setLoading(false);
//     }
//   }, [dashboard]);

//   useEffect(() => {
//     refreshDashboard();
//   }, []);

//   return (
//     <DashboardContext.Provider
//       value={{
//         dashboard,
//         loading,
//         error,
//         refreshDashboard,
//       }}
//     >
//       {children}
//     </DashboardContext.Provider>


import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

import { getDashboard } from "../services/dashboard.service";

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [dashboard, setDashboard] = useState(() => {
    try {
      const cached = sessionStorage.getItem("restaurantDashboard");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshDashboard = useCallback(async (range = 7) => {
    const token = localStorage.getItem("restaurantToken");

    // Do not call dashboard API without restaurant login.
    if (!token) {
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const data = await getDashboard(range);

      setDashboard(data);

      sessionStorage.setItem(
        "restaurantDashboard",
        JSON.stringify(data)
      );

    } catch (error) {
      console.error(
        "Dashboard Error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        error.message ||
        "Failed to load dashboard"
      );

    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        dashboard,
        loading,
        error,
        refreshDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboard must be used inside DashboardProvider"
    );
  }

  return context;
};

//   );
// };

// export const useDashboard = () => useContext(DashboardContext);
