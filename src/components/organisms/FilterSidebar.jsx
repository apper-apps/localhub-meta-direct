import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const FilterSidebar = ({ 
  activeModule, 
  filters, 
  onFilterChange,
  onClearFilters,
  className = "" 
}) => {
  const getModuleFilters = () => {
    switch (activeModule) {
      case "qa":
        return [
          {
            key: "category",
            label: "Category",
            options: ["General", "Recommendations", "Events", "Local News", "Help", "Discussion"]
          }
        ];
      case "businesses":
        return [
          {
            key: "category",
            label: "Business Type",
            options: ["Restaurant", "Retail", "Service", "Healthcare", "Automotive", "Beauty"]
          }
        ];
      case "events":
        return [
          {
            key: "category",
            label: "Event Type",
            options: ["Music", "Food & Drink", "Sports", "Community", "Business", "Arts"]
          }
        ];
      case "jobs":
        return [
          {
            key: "type",
            label: "Job Type",
            options: ["Full-time", "Part-time", "Contract", "Remote", "Internship"]
          },
          {
            key: "category",
            label: "Industry",
            options: ["Technology", "Healthcare", "Retail", "Education", "Finance", "Marketing"]
          }
        ];
      case "realestate":
        return [
          {
            key: "type",
            label: "Property Type",
            options: ["House", "Apartment", "Condo", "Townhouse", "Commercial"]
          },
          {
            key: "priceRange",
            label: "Price Range",
            options: ["Under $500k", "$500k-$750k", "$750k-$1M", "$1M+"]
          }
        ];
      case "cars":
        return [
          {
            key: "type",
            label: "Vehicle Type",
            options: ["Sedan", "SUV", "Truck", "Hatchback", "Convertible", "Electric"]
          },
          {
            key: "priceRange",
            label: "Price Range",
            options: ["Under $20k", "$20k-$40k", "$40k-$60k", "$60k+"]
          }
        ];
      default:
        return [];
    }
  };

  const moduleFilters = getModuleFilters();
  const hasActiveFilters = Object.keys(filters).some(key => filters[key]);

  return (
    <Card className={`p-6 h-fit ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-primary-600 hover:text-primary-700"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {moduleFilters.map((filter) => (
          <div key={filter.key}>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              {filter.label}
            </h4>
            <div className="space-y-2">
              {filter.options.map((option) => (
                <label key={option} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters[filter.key] === option}
                    onChange={(e) => {
                      onFilterChange(filter.key, e.target.checked ? option : null);
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Distance Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Distance
          </h4>
          <div className="space-y-2">
            {["5 miles", "10 miles", "25 miles", "50 miles"].map((distance) => (
              <label key={distance} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="distance"
                  checked={filters.distance === distance}
                  onChange={() => onFilterChange("distance", distance)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{distance}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FilterSidebar;