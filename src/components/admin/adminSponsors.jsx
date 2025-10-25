import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Use .env

const SponsorDashboard = () => {
  const [sponsors, setSponsors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    gradient: "",
    btnColor: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const gradientOptions = [
    { id: 1, value: "from-blue-900 to-blue-700", colors: ["#1e3a8a", "#1d4ed8"] },
    { id: 2, value: "from-green-800 to-green-500", colors: ["#166534", "#22c55e"] },
    { id: 3, value: "from-purple-700 to-pink-500", colors: ["#7e22ce", "#ec4899"] },
    { id: 4, value: "from-orange-600 to-yellow-500", colors: ["#ea580c", "#eab308"] },
    { id: 5, value: "from-gray-700 to-gray-500", colors: ["#374151", "#6b7280"] },
  ];

  const btnColors = [
    { id: 1, value: "text-blue-500 hover:bg-blue-100", label: "Blue" },
    { id: 2, value: "text-green-500 hover:bg-green-100", label: "Green" },
    { id: 3, value: "text-purple-500 hover:bg-purple-100", label: "Purple" },
    { id: 4, value: "text-orange-500 hover:bg-orange-100", label: "Orange" },
  ];

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/sponsors`);
      setSponsors(res.data);
    } catch (err) {
      console.error("Error fetching sponsors:", err.response?.data || err.message);
    }
  };

  // ✅ File validation
  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPEG, JPG, PNG files are allowed");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Frontend validation
    if (!formData.name || !formData.description || !formData.gradient || !formData.btnColor) {
      alert("Please fill all required fields and select gradient/button color.");
      return;
    }

    if (!editingId && !file) {
      alert("Please upload an image for the sponsor.");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (file) data.append("img", file);

    try {
      if (editingId) {
        await axios.put(`${BACKEND_URL}/api/sponsors/${editingId}`, data);
      } else {
        await axios.post(`${BACKEND_URL}/api/sponsors`, data);
      }
      resetForm();
      fetchSponsors();
    } catch (err) {
      console.error("Axios error:", err.response?.data || err.message);
      alert("Failed to save sponsor. Check console for details.");
    }
  };

  const handleEdit = (s) => {
    setFormData(s);
    setEditingId(s._id);
    setPreview(`${BACKEND_URL}${s.img}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/sponsors/${id}`);
      fetchSponsors();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      alert("Failed to delete sponsor. Check console for details.");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", gradient: "", btnColor: "" });
    setFile(null);
    setPreview(null);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-white p-10">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-10 drop-shadow-md">
        Sponsor Dashboard
      </h1>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          {editingId ? "Edit Sponsor" : "Add New Sponsor"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Sponsor Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none md:col-span-2"
            required
          />

          {/* Gradient Options */}
          <div className="md:col-span-2">
            <p className="font-semibold mb-2">Select Background Gradient:</p>
            <div className="flex gap-3 flex-wrap">
              {gradientOptions.map((g) => (
                <div
                  key={g.id}
                  className={`w-14 h-14 rounded-lg cursor-pointer border-4 transition-all ${
                    formData.gradient === g.value
                      ? "border-blue-600 scale-105"
                      : "border-transparent"
                  }`}
                  style={{
                    background: `linear-gradient(45deg, ${g.colors[0]}, ${g.colors[1]})`,
                  }}
                  onClick={() => setFormData({ ...formData, gradient: g.value })}
                ></div>
              ))}
            </div>
          </div>

          {/* Button Color Options */}
          <div className="md:col-span-2">
            <p className="font-semibold mb-2">Select Button Color:</p>
            <div className="flex gap-3 flex-wrap">
              {btnColors.map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  className={`px-4 py-2 rounded-lg border transition-all ${btn.value} ${
                    formData.btnColor === btn.value
                      ? "ring-2 ring-blue-400 font-semibold"
                      : ""
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, btnColor: btn.value })
                  }
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Button */}
          <label className="md:col-span-2 flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-xl cursor-pointer hover:bg-blue-50 transition-all py-6">
            <p className="text-blue-600 font-semibold">Upload Sponsor Image</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
              required={!editingId}
            />
          </label>

          {/* Preview */}
          {preview && (
            <div className="md:col-span-2 flex justify-center mt-4">
              <img
                src={preview}
                alt="Preview"
                className="w-48 h-32 object-cover rounded-lg shadow-lg border"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all"
        >
          {editingId ? "Update Sponsor" : "Add Sponsor"}
        </button>
      </form>

      {/* Sponsors Table */}
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Sponsors List
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 border text-left text-gray-700">Image</th>
                <th className="p-3 border text-left text-gray-700">Name</th>
                <th className="p-3 border text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sponsors.map((s) => (
                <tr
                  key={s._id}
                  className="hover:bg-gray-50 transition-colors border-b"
                >
                  <td className="p-3">
                    {s.img && (
                      <img
                        src={`http://localhost:5000${s.img}`}
                        alt={s.name}
                        className="w-20 h-14 object-cover rounded-md shadow"
                      />
                    )}
                  </td>
                  <td className="p-3 font-medium text-gray-800">{s.name}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleEdit(s)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg mr-2 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {sponsors.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-4">
                    No sponsors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;
