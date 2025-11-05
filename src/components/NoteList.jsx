import React from "react";

function NoteList({ title, notes, onTrash, onRestore, onDelete, onArchive, onPin }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <h2 className="text-xl font-semibold text-purple-700 mb-4">{title}</h2>

      {notes.length === 0 ? (
        <p className="text-gray-400 text-center italic">No notes available</p>
      ) : (
        <div className="flex flex-col gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all bg-gradient-to-br from-white to-purple-50"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
                {onPin && (
                  <button
                    onClick={() => onPin(note.id)}
                    className={`text-sm ${
                      note.pinned
                        ? "text-yellow-600 hover:text-yellow-700"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    📌
                  </button>
                )}
              </div>

              <p className="text-gray-600 mt-1">{note.description}</p>

              {note.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {note.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-400 mt-2">{note.createdAt}</p>

              <div className="flex gap-3 mt-3 flex-wrap">
                {onArchive && (
                  <button
                    onClick={() => onArchive(note.id)}
                    className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
                  >
                    Archive
                  </button>
                )}
                {onTrash && (
                  <button
                    onClick={() => onTrash(note.id)}
                    className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md hover:bg-yellow-200"
                  >
                    Move to Trash
                  </button>
                )}
                {onRestore && (
                  <button
                    onClick={() => onRestore(note.id)}
                    className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200"
                  >
                    Restore
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(note.id)}
                    className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200"
                  >
                    Delete Permanently
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NoteList;
