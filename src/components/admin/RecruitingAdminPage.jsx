import React, { useEffect, useState } from "react";

// Use .env variable for backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProcessDashboard = () => {
  const [steps, setSteps] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    alt: "",
    highlight: "",
    img: null,
  });
  const [loading, setLoading] = useState(true);

  // Fetch all process steps
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/process`)
      .then((res) => res.json())
      .then((data) => {
        setSteps(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching process steps:", err);
        setLoading(false);
      });
  }, []);

  // Start editing
  const handleEdit = (step) => {
    setEditing(step._id);
    setFormData({
      title: step.title,
      description: step.description,
      alt: step.alt,
      highlight: step.highlight || "",
      img: null,
    });
  };

  // Handle text changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, img: e.target.files[0] }));
  };

  // Save changes
  const handleUpdate = async (id) => {
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) form.append(key, formData[key]);
    });

    try {
      const res = await fetch(`${BACKEND_URL}/api/process/${id}`, {
        method: "PUT",
        body: form,
      });

      if (!res.ok) throw new Error("Failed to update");

      const updatedStep = await res.json();
      setSteps((prev) =>
        prev.map((step) => (step._id === id ? updatedStep : step))
      );

      setEditing(null);
      alert("✅ Process step updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update process step.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Process Steps Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step) => (
          <div key={step._id} className="bg-white border rounded-xl shadow-md p-4">
            <img
              src={`${BACKEND_URL}${step.img}`}
              alt={step.alt}
              className="w-full h-48 object-cover rounded-lg mb-3"
            />

            {editing === step._id ? (
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
                  className="w-full border rounded p-2 h-24"
                  placeholder="Description"
                />
                <input
                  name="alt"
                  value={formData.alt}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  placeholder="Alt text"
                />
                <input
                  name="highlight"
                  value={formData.highlight}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  placeholder="Highlight (e.g. text-indigo-600)"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border p-2 rounded"
                />

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setEditing(null)}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdate(step._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800">
                  {step.title}
                </h2>
                <p className="text-gray-600 mt-2 line-clamp-3">
                  {step.description}
                </p>
                <button
                  onClick={() => handleEdit(step)}
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

export default ProcessDashboard;
