import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import LocationPicker from "@/components/organisms/LocationPicker";
import LocationChip from "@/components/molecules/LocationChip";
import ModuleNav from "@/components/molecules/ModuleNav";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ 
  currentLocation, 
  onLocationChange, 
  activeModule, 
  onModuleChange,
  onSearch,
  onProfileToggle = () => {}
}) => {
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="MapPin" className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                LocalHub
              </h1>
            </div>

            {/* Search and Location */}
            <div className="flex items-center gap-4 flex-1 max-w-2xl mx-8">
              <div className="flex-1">
                <SearchBar 
                  onSearch={onSearch}
                  placeholder="Search questions, businesses, events..."
                />
              </div>
              <LocationChip 
                location={currentLocation}
                onClick={() => setShowLocationPicker(true)}
              />
            </div>

            {/* Profile placeholder */}
<button
              onClick={onProfileToggle}
              className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              <ApperIcon name="User" size={16} className="text-white" />
            </button>
          </div>

          {/* Module Navigation */}
          <div className="pb-3">
            <ModuleNav 
              activeModule={activeModule}
              onModuleChange={onModuleChange}
            />
          </div>
        </div>
      </header>

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <LocationPicker
          currentLocation={currentLocation}
          onLocationSelect={(location) => {
            onLocationChange(location);
            setShowLocationPicker(false);
          }}
          onClose={() => setShowLocationPicker(false)}
        />
      )}
    </>
  );
};

export default Header;