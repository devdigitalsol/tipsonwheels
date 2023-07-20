import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import DoctorDetails from "./pages/DoctorDetails";
import SelectTips from "./pages/SelectTips";
import Preview from "./pages/Preview";
import AddDoctor from "./pages/AddDoctor";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route index element={<Home />} />
          <Route path="add-doctor" element={<AddDoctor />} />
          <Route
            path="doctor-details/:doctor_code"
            element={<DoctorDetails />}
          />
          <Route path="select-tips/:doctor_code" element={<SelectTips />} />
          <Route path="preview" element={<Preview />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default App;
