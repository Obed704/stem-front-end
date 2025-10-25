import React, { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProjectSlidesAdmin = () => {
  const [slides, setSlides] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ alt: "", caption: "", src: null });
  const [newSlideData, setNewSlideData] = useState({ alt: "", caption: "", src: null });

  // Fetch slides
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/project-slides`)
      .then(res => res.json())
      .then(data => setSlides(data))
      .catch(err => console.error(err));
  }, []);

  // Edit existing slide
  const handleEdit = (slide) => {
    setEditing(slide._id);
    setFormData({ alt: slide.alt, caption: slide.caption, src: null });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setFormData(prev => ({ ...prev, src: e.target.files[0] }));

  const handleUpdate = async (id) => {
    const form = new FormData();
    form.append("alt", formData.alt);
    form.append("caption", formData.caption);
    if (formData.src) form.append("src", formData.src);

    try {
      const res = await fetch(`${BACKEND_URL}/api/project-slides/${id}`, {
        method: "PUT",
        body: form,
      });
      if (!res.ok) throw new Error("Failed to update");
      const updatedSlide = await res.json();
      setSlides(prev => prev.map(s => s._id === id ? updatedSlide : s));
      setEditing(null);
      alert("✅ Slide updated!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update slide");
    }
  };

  // Add new slide
  const handleNewSlideChange = (e) => {
    const { name, value } = e.target;
    setNewSlideData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewSlideFileChange = (e) => setNewSlideData(prev => ({ ...prev, src: e.target.files[0] }));

  const handleAddNewSlide = async () => {
    if (!newSlideData.src) return alert("Please select an image for the new slide");
    const form = new FormData();
    form.append("alt", newSlideData.alt);
    form.append("caption", newSlideData.caption);
    form.append("src", newSlideData.src);

    try {
      const res = await fetch(`${BACKEND_URL}/api/project-slides`, { method: "POST", body: form });
      if (!res.ok) throw new Error("Failed to add slide");
      const addedSlide = await res.json();
      setSlides(prev => [...prev, addedSlide]);
      setNewSlideData({ alt: "", caption: "", src: null });
      alert("✅ Slide added!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add slide");
    }
  };

  // Delete slide
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;
    try {
      await fetch(`${BACKEND_URL}/api/project-slides/${id}`, { method: "DELETE" });
      setSlides(prev => prev.filter(s => s._id !== id));
      alert("✅ Slide deleted");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete slide");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Project Slides Admin</h1>

      {/* Add New Slide */}
      <div className="mb-12 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Slide</h2>
        <input type="file" accept="image/*" onChange={handleNewSlideFileChange} className="w-full border rounded p-2 mb-2" />
        <input type="text" name="alt" value={newSlideData.alt} onChange={handleNewSlideChange} placeholder="Alt text" className="w-full border rounded p-2 mb-2" />
        <input type="text" name="caption" value={newSlideData.caption} onChange={handleNewSlideChange} placeholder="Caption" className="w-full border rounded p-2 mb-2" />
        <button onClick={handleAddNewSlide} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Slide</button>
      </div>

      {/* Existing slides */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map(slide => (
          <div key={slide._id} className="bg-white p-4 rounded-xl shadow-md">
            <img src={`${BACKEND_URL}${slide.src}`} alt={slide.alt} className="w-full h-48 object-cover rounded-lg mb-3" />

            {editing === slide._id ? (
              <div className="space-y-3">
                <input name="alt" value={formData.alt} onChange={handleChange} placeholder="Alt text" className="w-full border rounded p-2" />
                <input name="caption" value={formData.caption} onChange={handleChange} placeholder="Caption" className="w-full border rounded p-2" />
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border rounded p-2" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setEditing(null)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                  <button onClick={() => handleUpdate(slide._id)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-800 font-semibold">{slide.caption}</p>
                <div className="flex justify-between mt-2">
                  <button onClick={() => handleEdit(slide)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit</button>
                  <button onClick={() => handleDelete(slide._id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSlidesAdmin;
