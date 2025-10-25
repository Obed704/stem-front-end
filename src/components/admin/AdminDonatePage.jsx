// frontend/src/admin/AdminDonation.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // use .env

export default function AdminDonation() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [side, setSide] = useState("left");
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/donation-images`);
      setImages(res.data);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file.");
    const formData = new FormData();
    formData.append("image", file);
    formData.append("side", side);
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/donation-images`, formData);
      fetchImages();
      setFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    setLoading(true);
    try {
      await axios.delete(`${BACKEND_URL}/api/donation-images/${id}`);
      fetchImages();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-600 mb-8">
          Donation Images Admin
        </h1>

        {/* Upload Form */}
        <form
          onSubmit={handleUpload}
          className="flex flex-col md:flex-row gap-4 mb-8 items-center"
        >
          <select
            className="border rounded-lg p-3 w-full md:w-1/4"
            value={side}
            onChange={(e) => setSide(e.target.value)}
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border rounded-lg p-3 w-full md:w-2/4"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {/* Images Grid */}
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
          {images.map((img) => (
            <div
              key={img._id}
              className="relative group border rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition"
            >
              <img
                src={`${BACKEND_URL}${img.image}`}
                alt={`Donation ${img.side}`}
                className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3 flex justify-between items-center">
                <span className="capitalize">{img.side}</span>
                <button
                  onClick={() => handleDelete(img._id)}
                  className="text-red-400 hover:text-red-600 font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
