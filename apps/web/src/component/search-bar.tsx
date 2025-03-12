'use client'; // Tambahkan ini di bagian atas file

import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    onSearch(value); // Panggil fungsi onSearch yang diterima dari parent
  };

  return (
    <input
      type="text"
      placeholder="Search..."
      value={query}
      onChange={handleInputChange}
      className="w-full p-2 border border-gray-300 rounded"
    />
  );
};

export default SearchBar;
