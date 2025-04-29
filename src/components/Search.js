function Search({ searchTerm, setSearchTerm }) {
  return (
    <input
      type="text"
      placeholder="Search Plants..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}

export default Search;
