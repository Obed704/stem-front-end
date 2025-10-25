import React from "react";
import { NavLink } from "react-router-dom";

const AdminDashboard = () => {
  // All paths are absolute
  const pages = [
    { name: "Change Password", path: "/change-password" },
    { name: "Emails", path: "/admin-emails" },
    { name: "Champions", path: "/admin-champions" },
    { name: "Mission & Vision", path: "/admin-vision-mission" },
    { name: "Sponsors", path: "/admin-sponsors" },
    { name: "Team", path: "/admin-team" },
    { name: "Resources", path: "/admin-resources" },
    { name: "Donations", path: "/admin-donation" },
    { name: "Education", path: "/admin-education" },
    { name: "Recruiting", path: "/admin-recruiting-process" },
    { name: "Project Slides", path: "/admin-project-slide" },
    { name: "Champions Gallery", path: "/admin-gallery" },
    { name: "Testimonials / Comments", path: "/admin-testimonials" }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin-login-9x7a5f"; // absolute path
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((p) => (
            <NavLink
              key={p.path}
              to={p.path} // absolute path
              className={({ isActive }) =>
                `bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow transform transition-all duration-200 hover:scale-105 ${
                  isActive ? "ring-4 ring-blue-400" : ""
                }`
              }
            >
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <p className="text-sm mt-1 text-blue-100">
                Manage {p.name.toLowerCase()} content
              </p>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
