import React from "react";

export default function NoteList({
  notes,
  onDelete,
  onRestore,
  onArchive,
  onPin,
  onPermanentDelete,
  view,
  onViewNote,
}) {
  if (notes.length === 0)
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
        No notes found.
      </p>
    );

  return (
    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mt-4">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onViewNote(note)}
          className={`relative cursor-pointer border rounded-xl p-4 transition-all duration-300
          ${note.pinned ? "border-yellow-400" : "border-transparent"}
          bg-white dark:bg-gray-800 
          shadow hover:shadow-xl dark:shadow-gray-900/40 hover:scale-[1.02]`}
        >
          {/* Pin Indicator */}
          {note.pinned && (
            <div className="absolute top-2 right-2 text-yellow-500 text-lg">📌</div>
          )}

          {/* Title */}
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
            {note.title}
          </h3>

          {/* Content */}
          <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
            {note.content || "No content"}
          </p>

          {/* Tags */}
          {note.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200 text-xs px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div
            className="flex flex-wrap gap-2 mt-2"
            onClick={(e) => e.stopPropagation()} // prevent modal open
          >
            {view === "trash" ? (
              <>
                <button
                  onClick={() => onRestore(note.id)}
                  className="text-green-600 dark:text-green-400 hover:underline"
                >
                  Restore
                </button>
                <button
                  onClick={() => onPermanentDelete(note.id)}
                  className="text-red-600 dark:text-red-400 hover:underline"
                >
                  Delete Permanently
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onPin(note.id)}
                  className="text-yellow-600 dark:text-yellow-400 hover:underline"
                >
                  {note.pinned ? "Unpin" : "Pin"}
                </button>
                <button
                  onClick={() => onArchive(note.id)}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Archive
                </button>
                <button
                  onClick={() => onDelete(note.id)}
                  className="text-red-600 dark:text-red-400 hover:underline"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
