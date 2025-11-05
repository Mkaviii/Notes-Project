import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import SearchBar from "./components/SearchBar";

function App() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState("");

  // Load notes from localStorage
  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(storedNotes);
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Create new note
  const addNote = (title, description, tags) => {
    const newNote = {
      id: uuidv4(),
      title,
      description,
      tags,
      status: "active",
      pinned: false,
      createdAt: new Date().toLocaleString(),
    };
    setNotes([newNote, ...notes]);
  };

  // Move note to trash
  const moveToTrash = (id) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, status: "trash" } : n)));
  };

  // Restore note
  const restoreNote = (id) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, status: "active" } : n)));
  };

  // Permanently delete note
  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  // Archive note
  const archiveNote = (id) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, status: "archive" } : n)));
  };

  // Pin/unpin note
  const togglePin = (id) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  };

  // Filter logic
  const filteredNotes = notes.filter(
    (n) =>
      n.status === "active" &&
      (n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterTag ? n.tags.includes(filterTag) : true)
  );

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const otherNotes = filteredNotes.filter((n) => !n.pinned);
  const archivedNotes = notes.filter((n) => n.status === "archive");
  const trashNotes = notes.filter((n) => n.status === "trash");

  // Collect all tags
  const allTags = [...new Set(notes.flatMap((n) => n.tags || []))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">📝 Notes App</h1>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg mb-6">
        <NoteForm onAddNote={addNote} />
      </div>

      <div className="max-w-5xl mx-auto mb-8">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterTag={filterTag}
          setFilterTag={setFilterTag}
          allTags={allTags}
        />
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pinnedNotes.length > 0 && (
          <NoteList
            title="📌 Pinned Notes"
            notes={pinnedNotes}
            onTrash={moveToTrash}
            onArchive={archiveNote}
            onPin={togglePin}
          />
        )}

        <NoteList
          title="Active Notes"
          notes={otherNotes}
          onTrash={moveToTrash}
          onArchive={archiveNote}
          onPin={togglePin}
        />

        <NoteList
          title="Archived Notes"
          notes={archivedNotes}
          onRestore={restoreNote}
          onTrash={moveToTrash}
        />

        <NoteList
          title="Trash"
          notes={trashNotes}
          onRestore={restoreNote}
          onDelete={deleteNote}
        />
      </div>
    </div>
  );
}

export default App;
