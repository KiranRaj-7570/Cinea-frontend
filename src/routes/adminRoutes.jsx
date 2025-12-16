import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

import AdminDashboard from "../pages/AdminDashboard";
import AddTheatre from "../pages/AddTheatre";
import ManageTheatres from "../pages/ManageTheatres";
import AddShow from "../pages/AddShow";
import ManageShows from "../pages/ManageShows";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/theatres/add" element={<AddTheatre />} />
        <Route path="/theatres" element={<ManageTheatres />} />
        <Route path="/shows/add" element={<AddShow />} />
        <Route path="/shows" element={<ManageShows />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
