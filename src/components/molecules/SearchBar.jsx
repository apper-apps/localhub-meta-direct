import { useState } from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ onSearch, placeholder = "Search..." }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    // Debounced search would go here in a real app
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          className="pl-10 pr-4"
        />
      </div>
    </form>
  );
};

export default SearchBar;