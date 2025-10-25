// frontend/src/admin/TestimonialsAdmin.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../Header";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // use .env

const COLOR_PRESETS = [
  { name: "Yellow", value: "#facc15" },
  { name: "Blue", value: "#60a5fa" },
  { name: "Green", value: "#34d399" },
  { name: "Pink", value: "#fb7185" },
  { name: "Lavender", value: "#c7b3ff" },
  { name: "White text", value: "#ffffff" },
];

const FONTS = [
  { name: "Roboto", value: "'Roboto', sans-serif" },
  { name: "Dancing Script", value: "'Dancing Script', cursive" },
  { name: "Montserrat", value: "'Montserrat', sans-serif" },
  { name: "Lobster", value: "'Lobster', cursive" },
  { name: "Arial", value: "Arial, sans-serif" },
];

const TestimonialsAdmin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    text: "",
    name: "",
    role: "",
    font: "'Dancing Script', cursive",
    borderColor: "#60a5fa",
    textColor: "#ffffff",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/testimonials`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setForm({
      text: "",
      name: "",
      role: "",
      font: "'Dancing Script', cursive",
      borderColor: "#60a5fa",
      textColor: "#ffffff",
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.text.trim() || !form.name.trim())
      return alert("Name and text are required.");

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${BACKEND_URL}/api/testimonials/${editingId}`
      : `${BACKEND_URL}/api/testimonials`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) return alert("Operation failed");
    await fetchItems();
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    const res = await fetch(`${BACKEND_URL}/api/testimonials/${id}`, { method: "DELETE" });
    if (!res.ok) return alert("Delete failed");
    await fetchItems();
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      text: item.text,
      name: item.name,
      role: item.role || "",
      font: item.font || "'Dancing Script', cursive",
      borderColor: item.borderColor || "#60a5fa",
      textColor: item.textColor || "#ffffff",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar bg="black" />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-600 mb-10">
          Testimonials Admin Dashboard
        </h1>

        {/* Form */}
        <div className="bg-gray-300 shadow-lg rounded-xl p-6 mb-10 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Testimonial" : "Add Testimonial"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <textarea
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="Quote..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                rows={4}
              />
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              />
              <input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Role"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              />
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <label className="text-sm font-medium">Font:</label>
                <select
                  value={form.font}
                  onChange={(e) => setForm({ ...form, font: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                >
                  {FONTS.map(f => (
                    <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 flex-wrap mt-2">
                <div>
                  <label className="text-sm font-medium block mb-1">Border Color:</label>
                  <input
                    type="color"
                    value={form.borderColor}
                    onChange={(e) => setForm({ ...form, borderColor: e.target.value })}
                    className="w-12 h-10 p-0 border-0 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Text Color:</label>
                  <input
                    type="color"
                    value={form.textColor}
                    onChange={(e) => setForm({ ...form, textColor: e.target.value })}
                    className="w-12 h-10 p-0 border-0 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="flex flex-col justify-between p-4 border border-gray-300 rounded-lg bg-gray-800">
              <div
                style={{
                  fontFamily: form.font,
                  color: form.textColor,
                  border: `3px solid ${form.borderColor}`,
                  padding: "12px",
                  borderRadius: "8px",
                }}
              >
                <strong>{form.name || "Name"}</strong> ({form.role || "Role"})
                <p className="mt-2">{form.text || "Quote preview will appear here..."}</p>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
                >
                  {editingId ? "Save Changes" : "Create Testimonial"}
                </button>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="bg-gray-300 hover:bg-gray-400 px-5 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials List */}
        {loading ? (
          <div className="flex justify-center items-center py-20 ">
            <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin "></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {items.map((it) => (
              <div
                key={it._id}
                className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between bg-gray-100"
              >
                <div>
                  <div className="text-sm text-gray-500 mb-1">{it.role}</div>
                  <div
                    className="font-semibold text-lg"
                    style={{ color: it.textColor, fontFamily: it.font }}
                  >
                    {it.name}
                  </div>
                  <div className="text-gray-700 mt-2">{it.text}</div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 12,
                      border: `3px solid ${it.borderColor}`,
                      boxShadow: `0 0 8px ${it.borderColor}33`,
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(it)}
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(it._id)}
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsAdmin;
