import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from './store/authStore'
import LoginPage from "./pages/LoginPage";
// import TasksPage from "./pages/TasksPage";
import { Toaster } from "react-hot-toast";
import TasksPage   from './pages/TaskPage.jsx'

function PrivateRoute({ children }) {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tasks" element={<PrivateRoute><TasksPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/tasks" />} />
      </Routes>
    </BrowserRouter>
   <Toaster toastOptions={ { duration: 5000 } } />
    </>
  );
}