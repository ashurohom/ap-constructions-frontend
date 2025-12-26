import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Workers from "./pages/Workers";
import Clients from "./pages/Clients";
import ProtectedRoute from "./components/ProtectedRoute";
import Worksites from "./pages/Worksites";
import WorksiteDetails from "./pages/WorksiteDetails";
import AttendanceList from "./pages/AttendanceList";
import MarkAttendance from "./pages/MarkAttendance";
import Payroll from "./pages/Payroll";
import WorkerPayrollHistory from "./pages/WorkerPayrollHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workers"
          element={
            <ProtectedRoute>
              <Workers />
            </ProtectedRoute>
          }
        />


        <Route
          path="/worksites"
          element={
            <ProtectedRoute>
              <Worksites />
            </ProtectedRoute>
          }
        />


        <Route
          path="/worksites/:id"
          element={
            <ProtectedRoute>
          <WorksiteDetails />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/attendance" 
          element={
            <ProtectedRoute>
              <AttendanceList />
            </ProtectedRoute>
          } 
        />
        
        
        <Route 
          path="/attendance/mark" 
          element={
            <ProtectedRoute>
              <MarkAttendance />
            </ProtectedRoute>
            } 
          />

          <Route
            path="/payroll"
            element={
              <ProtectedRoute>
                <Payroll />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payroll/worker/:workerId"
            element={
              <ProtectedRoute>
                <WorkerPayrollHistory />
              </ProtectedRoute>
            }
          />




      </Routes>
    </BrowserRouter>
  );
}

export default App;
