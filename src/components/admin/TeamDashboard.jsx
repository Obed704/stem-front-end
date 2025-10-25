import React, { useState, useEffect } from "react";
import axios from "axios";

// Use .env variable for backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: `${BACKEND_URL}/api/team`,
});

const TeamMemberDashboard = () => {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/");
      setMembers(res.data);
    } catch (err) {
      setMessage("Failed to load team members.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (file) data.append("image", file);

    try {
      setLoading(true);
      if (editingId) {
        await api.put(`/${editingId}`, data);
        setMessage("Member updated successfully!");
      } else {
        await api.post("/", data);
        setMessage("Member added successfully!");
      }
      resetForm();
      fetchMembers();
    } catch (err) {
      setMessage("Error saving member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setFormData({
      name: member.name,
      role: member.role,
      email: member.email || "",
    });
    setEditingId(member._id);
    setPreview(member.image ? `${BACKEND_URL}${member.image}` : null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      setLoading(true);
      await api.delete(`/${id}`);
      setMessage("Member deleted successfully!");
      fetchMembers();
    } catch {
      setMessage("Error deleting member.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", role: "", email: "" });
    setFile(null);
    setPreview(null);
    setEditingId(null);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
        Team Member Dashboard
      </h1>

      {message && (
        <div
          className={`text-center mb-4 p-3 rounded-md font-medium ${
            message.includes("Error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* FORM SECTION */}
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-3xl mx-auto p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          {editingId ? "Edit Member" : "Add New Member"}
        </h2>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Role</label>
            <input
              type="text"
              placeholder="e.g. Frontend Developer"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-600 mb-1">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setFile(file);
                setPreview(file ? URL.createObjectURL(file) : null);
              }}
              className="w-full border border-gray-300 p-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* IMAGE PREVIEW */}
          {preview && (
            <div className="md:col-span-2 flex justify-center mt-2">
              <img
                src={preview}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-full shadow-md border border-gray-300"
              />
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Member"
              : "Add Member"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 shadow-md hover:shadow-lg transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* TABLE SECTION */}
      <div className="bg-white p-6 mt-12 rounded-2xl shadow-md max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Team Members
        </h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : members.length === 0 ? (
          <p className="text-center text-gray-500">No members yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg text-sm md:text-base">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 border">Image</th>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Role</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr
                    key={m._id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-3 border text-center">
                      {m.image ? (
                        <img
                          src={`${BACKEND_URL}${m.image}`}
                          alt={m.name}
                          className="w-14 h-14 object-cover rounded-full mx-auto"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-200 rounded-full mx-auto" />
                      )}
                    </td>
                    <td className="p-3 border">{m.name}</td>
                    <td className="p-3 border">{m.role}</td>
                    <td className="p-3 border">{m.email || "-"}</td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => handleEdit(m)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMemberDashboard;
