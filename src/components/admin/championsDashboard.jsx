import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ChampionDashboard() {
  const [champions, setChampions] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    season: "",
    description: "",
    roadToVictory: "",
    alt: "",
    showHeader: true,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchChampions();
  }, []);

  const fetchChampions = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/champions`);
      setChampions(res.data);
    } catch (error) {
      console.error("Error fetching champions:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (file) data.append("image", file);

    try {
      if (editingId) {
        await axios.put(`${BACKEND_URL}/api/champions/${editingId}`, data);
      } else {
        await axios.post(`${BACKEND_URL}/api/champions`, data);
      }
      resetForm();
      fetchChampions();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/champions/${id}`);
      fetchChampions();
    } catch (error) {
      console.error("Error deleting champion:", error);
    }
  };

  const handleEdit = (champ) => {
    setFormData(champ);
    setEditingId(champ._id);
    setPreview(`${BACKEND_URL}${champ.image}`);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      season: "",
      description: "",
      roadToVictory: "",
      alt: "",
      showHeader: true,
    });
    setFile(null);
    setPreview(null);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-white p-10">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-10 drop-shadow-lg">
        Champion Dashboard
      </h1>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          {editingId ? "Edit Champion" : "Add New Champion"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <input
            type="text"
            placeholder="Season"
            value={formData.season}
            onChange={(e) =>
              setFormData({ ...formData, season: e.target.value })
            }
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
          <textarea
            placeholder="Road To Victory"
            value={formData.roadToVictory}
            onChange={(e) =>
              setFormData({ ...formData, roadToVictory: e.target.value })
            }
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none md:col-span-2"
            required
          />
          <input
            type="text"
            placeholder="Alt Text"
            value={formData.alt}
            onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Upload Button */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-xl cursor-pointer hover:bg-blue-50 transition-all">
            <div className="text-center py-4">
              <p className="text-blue-600 font-semibold">Upload Champion Image</p>
              <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
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
          {editingId ? "Update Champion" : "Add Champion"}
        </button>
      </form>

      {/* Table Section */}
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Champions List
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 border text-left text-gray-700">Image</th>
                <th className="p-3 border text-left text-gray-700">Title</th>
                <th className="p-3 border text-left text-gray-700">Season</th>
                <th className="p-3 border text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {champions.map((c) => (
                <tr
                  key={c._id}
                  className="hover:bg-gray-50 transition-colors border-b"
                >
                  <td className="p-3">
                    {c.image && (
                      <img
                        src={`${BACKEND_URL}${c.image}`}
                        alt={c.alt}
                        className="w-20 h-14 object-cover rounded-md shadow"
                      />
                    )}
                  </td>
                  <td className="p-3 font-medium text-gray-800">{c.title}</td>
                  <td className="p-3 text-gray-600">{c.season}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleEdit(c)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg mr-2 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {champions.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-4">
                    No champions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
