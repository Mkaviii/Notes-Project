import React from "react";

function SearchBar({ searchQuery, setSearchQuery, filterTag, setFilterTag, allTags }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white shadow-md rounded-xl p-4">
      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 w-full md:w-2/3 focus:ring-2 focus:ring-purple-400 outline-none"
      />

      <select
        value={filterTag}
        onChange={(e) => setFilterTag(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400 outline-none"
      >
        <option value="">All Tags</option>
        {allTags.map((tag, idx) => (
          <option key={idx} value={tag}>
            {tag}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SearchBar;
