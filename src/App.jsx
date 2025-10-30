import React, { useEffect, useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";

export default function App() {
  const STORAGE_KEY = "notes-app-v1";
  const THEME_KEY = "notes-theme";

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || "light";
  });

  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [view, setView] = useState("all");
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: "", content: "", tags: "" });

  // Sync theme with localStorage + DOM
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Persist notes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  // CRUD
  const addNote = (note) => {
    const newNote = {
      id: uuidv4(),
      ...note,
      pinned: false,
      archived: false,
      trashed: false,
      createdAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
  };

  const updateNote = (id, updatedFields) =>
    setNotes(notes.map((n) => (n.id === id ? { ...n, ...updatedFields } : n)));

  const deleteNote = (id) => updateNote(id, { trashed: true });
  const restoreNote = (id) => updateNote(id, { trashed: false, archived: false });
  const archiveNote = (id) => updateNote(id, { archived: true, trashed: false });
  const pinNote = (id) =>
    updateNote(id, { pinned: !notes.find((n) => n.id === id).pinned });
  const permanentlyDelete = (id) => setNotes(notes.filter((n) => n.id !== id));

  // Filters
  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => {
        if (view === "archived") return n.archived && !n.trashed;
        if (view === "trash") return n.trashed;
        return !n.archived && !n.trashed;
      })
      .filter(
        (n) =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.content.toLowerCase().includes(query.toLowerCase())
      )
      .filter((n) => (tagFilter ? n.tags.includes(tagFilter) : true))
      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [notes, query, tagFilter, view]);

  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags))).sort();

  // Modal
  const openNoteModal = (note) => {
    setSelectedNote(note);
    setIsEditing(false);
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditData({
      title: selectedNote.title,
      content: selectedNote.content,
      tags: selectedNote.tags.join(", "),
    });
  };

  const saveEdit = (e) => {
    e.preventDefault();
    updateNote(selectedNote.id, {
      title: editData.title.trim() || "Untitled",
      content: editData.content,
      tags: editData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setSelectedNote(null);
    setIsEditing(false);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Header */}
      <header
        className={`${
          theme === "dark" ? "bg-gray-800" : "bg-purple-600"
        } text-white p-4 flex flex-col md:flex-row md:items-center md:justify-between shadow`}
      >
        <h1 className="text-2xl font-bold">📝 Notes Manager</h1>

        <div className="flex flex-wrap gap-2 mt-3 md:mt-0 items-center">
          <input
            type="text"
            placeholder="Search notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-1 rounded text-black outline-none"
          />
          <select
            className="text-black px-2 py-1 rounded"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          >
            <option value="">All tags</option>
            {allTags.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select
            className="text-black px-2 py-1 rounded"
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            <option value="all">All Notes</option>
            <option value="archived">Archived</option>
            <option value="trash">Trash</option>
          </select>

          {/* 🌙 Theme Toggle */}
          <button
            onClick={() =>
              setTheme((prev) => (prev === "light" ? "dark" : "light"))
            }
            className={`ml-2 px-3 py-1 rounded border ${
              theme === "dark"
                ? "border-gray-500 bg-gray-700 hover:bg-gray-600"
                : "border-white bg-purple-700 hover:bg-purple-800"
            }`}
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="p-4 max-w-5xl mx-auto">
        <NoteForm onAdd={addNote} />
        <NoteList
          notes={filteredNotes}
          onDelete={deleteNote}
          onRestore={restoreNote}
          onArchive={archiveNote}
          onPin={pinNote}
          onPermanentDelete={permanentlyDelete}
          view={view}
          onViewNote={openNoteModal}
        />
      </main>

      {/* Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`${
              theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white"
            } rounded-lg p-6 max-w-lg w-full relative`}
          >
            <button
              onClick={() => {
                setSelectedNote(null);
                setIsEditing(false);
              }}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-200 text-xl"
            >
              ×
            </button>

            {isEditing ? (
              <form onSubmit={saveEdit}>
                <h2 className="text-xl font-bold mb-3">Edit Note</h2>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  className="w-full border p-2 rounded mb-2 text-black"
                  placeholder="Title"
                />
                <textarea
                  value={editData.content}
                  onChange={(e) =>
                    setEditData({ ...editData, content: e.target.value })
                  }
                  className="w-full border p-2 rounded mb-2 text-black"
                  rows={4}
                />
                <input
                  type="text"
                  value={editData.tags}
                  onChange={(e) =>
                    setEditData({ ...editData, tags: e.target.value })
                  }
                  className="w-full border p-2 rounded mb-3 text-black"
                  placeholder="Tags (comma separated)"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">{selectedNote.title}</h2>
                <p className="text-gray-300 whitespace-pre-wrap mb-3">
                  {selectedNote.content}
                </p>

                {selectedNote.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedNote.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-purple-100 text-purple-700 px-2 py-1 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-400 mb-4">
                  Created: {new Date(selectedNote.createdAt).toLocaleString()}
                </p>

                <button
                  onClick={startEditing}
                  className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                >
                  Edit Note
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
