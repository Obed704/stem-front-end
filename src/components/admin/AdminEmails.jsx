import React, { useState, useEffect } from "react";
import Navbar from "../Header.jsx";
import Footer from "../Footer.jsx";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // use .env
const colors = ["rgb(247, 244, 46)", "rgb(23, 207, 220)", "rgb(242, 30, 167)"]; // Color palette

const AdminInbox = () => {
  const [emails, setEmails] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedEmails, setSelectedEmails] = useState(new Set());
  const [sortBy, setSortBy] = useState("newest");

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/emails`);
      const data = await res.json();
      setEmails(data);
    } catch (err) {
      console.error("Failed to fetch emails:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const toggleSelectEmail = (id) => {
    const newSelected = new Set(selectedEmails);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedEmails(newSelected);
  };

  const selectAllEmails = () => {
    if (selectedEmails.size === filteredEmails.length) setSelectedEmails(new Set());
    else setSelectedEmails(new Set(filteredEmails.map(email => email._id)));
  };

  // Filter & Sort
  const sortedEmails = [...emails].sort((a, b) => {
    const dateA = new Date(a.createdAt || a._id);
    const dateB = new Date(b.createdAt || b._id);
    return sortBy === "newest" ? dateB - dateA : dateA - dateB;
  });

  const filteredEmails = sortedEmails.filter((e) => {
    const subject = (e.customSubject || e.subject || "").toLowerCase();
    const name = e.name?.toLowerCase() || "";
    const email = e.email?.toLowerCase() || "";

    const matchesSearch =
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      subject.includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || subject.includes(category.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || e.status === statusFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ["All", ...new Set(emails.map(e => (e.customSubject || e.subject || "Uncategorized")).filter(Boolean))];

  const getStatusColor = (status) => {
    if (status === "read") return colors[1];
    if (status === "unread") return colors[0];
    return colors[2];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <>
        <Navbar bg="bg-black"/>
        <section className="min-h-screen p-4 pt-32 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading emails...</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar bg="bg-black"/>

      <section className="min-h-screen p-4 pt-32 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 animate-pulse">Inbox</h1>
            <p className="text-gray-700">Manage and respond to customer inquiries</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:col-span-2 w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow hover:shadow-lg transition"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              <option value="All">All Status</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
            </select>
          </div>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 max-h-[70vh] overflow-y-auto">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center">
              <input
                type="checkbox"
                checked={selectedEmails.size === filteredEmails.length && filteredEmails.length > 0}
                onChange={selectAllEmails}
                className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">Select all</span>
            </div>

            {filteredEmails.map((email, idx) => {
              const isExpanded = expandedId === email._id;
              const isSelected = selectedEmails.has(email._id);
              const bgColor = idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100";

              return (
                <div
                  key={email._id}
                  className={`transition-all duration-300 transform hover:scale-[1.01] ${bgColor} ${isSelected ? "ring-2 ring-indigo-400" : ""}`}
                >
                  <div
                    className="flex items-center px-6 py-4 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : email._id)}
                  >
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                          style={{ backgroundColor: getStatusColor(email.status) }}
                        >
                          {email.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{email.name}</p>
                          <p className="text-gray-700 text-sm truncate">{email.customSubject || email.subject || "No Subject"}</p>
                          <p className="text-gray-500 text-xs mt-1">{formatDate(email.createdAt || email._id)}</p>
                        </div>
                      </div>

                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-6 pb-4 bg-gray-50 border-t border-gray-200 animate-fadeIn">
                      <div className="pl-12">
                        <p className="text-gray-800 mb-2">{email.message}</p>
                        <button
                          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </>
  );
};

export default AdminInbox;
