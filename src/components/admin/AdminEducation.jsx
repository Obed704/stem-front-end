import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // use .env

const EducationDashboard = () => {
  const [educationItems, setEducationItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    borderColor: "",
    alt: "",
    img: null,
  });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all education elements
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/education`)
      .then((res) => res.json())
      .then((data) => {
        setEducationItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching education items:", err);
        setLoading(false);
      });
  }, []);

  // ✅ Start editing an item
  const handleEdit = (item) => {
    setEditing(item._id);
    setFormData({
      title: item.title,
      description: item.description,
      borderColor: item.borderColor,
      alt: item.alt,
      img: null,
    });
  };

  // ✅ Update text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle image upload
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, img: e.target.files[0] }));
  };

  // ✅ Submit updates
  const handleUpdate = async (id) => {
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) form.append(key, formData[key]);
    });

    try {
      const res = await fetch(`${BACKEND_URL}/api/education/${id}`, {
        method: "PUT",
        body: form,
      });

      if (!res.ok) throw new Error("Failed to update");

      const updatedItem = await res.json();
      setEducationItems((prev) =>
        prev.map((item) => (item._id === id ? updatedItem : item))
      );

      setEditing(null);
      alert("✅ Education element updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update education element.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-600">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Education Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {educationItems.map((item) => (
          <div
            key={item._id}
            className={`border-4 ${item.borderColor} rounded-xl p-4 bg-white shadow-lg`}
          >
            <img
              src={`${BACKEND_URL}${item.img}`}
              alt={item.alt}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />

            {editing === item._id ? (
              <div className="space-y-3">
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  placeholder="Title"
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  placeholder="Description"
                ></textarea>
                <input
                  name="borderColor"
                  value={formData.borderColor}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  placeholder="Border color (e.g., border-blue-100)"
                />
                <input
                  name="alt"
                  value={formData.alt}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  placeholder="Alt text"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border p-2 rounded"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditing(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdate(item._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800">
                  {item.title}
                </h2>
                <p className="text-gray-600 mt-2">{item.description}</p>
                <button
                  onClick={() => handleEdit(item)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationDashboard;
