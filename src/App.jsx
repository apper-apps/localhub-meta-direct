import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import QAFeed from "@/components/pages/QAFeed";
import BusinessDirectory from "@/components/pages/BusinessDirectory";
import EventMarketplace from "@/components/pages/EventMarketplace";
import JobsPage from "@/components/pages/JobsPage";
import RealEstatePage from "@/components/pages/RealEstatePage";
import CarsPage from "@/components/pages/CarsPage";
import UserProfileSidebar from "@/components/organisms/UserProfileSidebar";
import locationService from "@/services/api/locationService";
function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [activeModule, setActiveModule] = useState("qa");
const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);
  useEffect(() => {
    // Set default location (San Francisco)
    const defaultLocation = {
      Id: 1,
      city: "San Francisco",
      state: "CA",
      country: "USA",
      coordinates: { lat: 37.7749, lng: -122.4194 }
    };
    setCurrentLocation(defaultLocation);
  }, []);

  const handleLocationChange = (location) => {
    setCurrentLocation(location);
    // Clear filters when location changes
    setFilters({});
  };

  const handleModuleChange = (moduleId) => {
    setActiveModule(moduleId);
    // Clear filters when module changes
    setFilters({});
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // In a real app, this would trigger search across modules
    console.log("Searching for:", query);
  };

  const renderModuleContent = () => {
    const commonProps = {
      currentLocation,
      filters,
      searchQuery
    };

    switch (activeModule) {
      case "qa":
        return <QAFeed {...commonProps} />;
      case "businesses":
        return <BusinessDirectory {...commonProps} />;
      case "events":
        return <EventMarketplace {...commonProps} />;
      case "jobs":
        return <JobsPage {...commonProps} />;
      case "realestate":
        return <RealEstatePage {...commonProps} />;
      case "cars":
        return <CarsPage {...commonProps} />;
      default:
        return <QAFeed {...commonProps} />;
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header
          currentLocation={currentLocation}
          onLocationChange={handleLocationChange}
          activeModule={activeModule}
          onModuleChange={handleModuleChange}
          onSearch={handleSearch}
        />

        <Routes>
<Route path="/*" element={
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex gap-6">
                {/* Profile Sidebar */}
                {profileSidebarOpen && (
                  <aside className="w-80 flex-shrink-0 hidden lg:block">
                    <UserProfileSidebar
                      activeModule={activeModule}
                      onClose={() => setProfileSidebarOpen(false)}
                      className="sticky top-24"
                    />
                  </aside>
                )}

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  {renderModuleContent()}
                </div>

                {/* Filter Sidebar */}
                <aside className="w-80 flex-shrink-0 hidden lg:block">
                  <FilterSidebar
                    activeModule={activeModule}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    className="sticky top-24"
                  />
                </aside>
              </div>
            </main>
          } />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="toast-container"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;