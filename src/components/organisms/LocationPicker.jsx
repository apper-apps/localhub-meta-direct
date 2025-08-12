import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import locationService from "@/services/api/locationService";

const LocationPicker = ({ currentLocation, onLocationSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPopularLocations();
  }, []);

  const loadPopularLocations = async () => {
    setLoading(true);
    try {
      const data = await locationService.getPopularLocations();
      setLocations(data);
    } catch (error) {
      console.error("Error loading locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      loadPopularLocations();
      return;
    }

    setLoading(true);
    try {
      const results = await locationService.searchLocations(query);
      setLocations(results);
    } catch (error) {
      console.error("Error searching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    // In a real app, this would use the Geolocation API
    const mockCurrentLocation = {
      Id: 999,
      city: "San Francisco",
      state: "CA",
      country: "USA",
      coordinates: { lat: 37.7749, lng: -122.4194 }
    };
    onLocationSelect(mockCurrentLocation);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Choose Location</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <ApperIcon 
              name="Search" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
            />
            <Input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className="pl-10"
            />
          </div>

          <Button
            variant="outline"
            onClick={handleUseCurrentLocation}
            className="w-full mt-3 gap-2 text-primary-600 border-primary-200 hover:bg-primary-50"
          >
            <ApperIcon name="Navigation" className="h-4 w-4" />
            Use Current Location
          </Button>
        </div>

        {/* Locations List */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {loading ? (
            <div className="p-6">
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-2">
              {locations.map((location) => (
                <button
                  key={location.Id}
                  onClick={() => onLocationSelect(location)}
                  className={`
                    w-full text-left p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200
                    flex items-center justify-between
                    ${currentLocation?.Id === location.Id ? "bg-primary-50 text-primary-700" : ""}
                  `}
                >
                  <div>
                    <div className="font-medium">
                      {location.city}, {location.state}
                    </div>
                    <div className="text-sm text-gray-500">{location.country}</div>
                  </div>
                  {currentLocation?.Id === location.Id && (
                    <ApperIcon name="Check" className="h-5 w-5 text-primary-600" />
                  )}
                </button>
              ))}

              {!loading && locations.length === 0 && (
                <div className="text-center p-6 text-gray-500">
                  No locations found
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LocationPicker;