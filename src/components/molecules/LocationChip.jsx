import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const LocationChip = ({ location, onClick }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="gap-2 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white/90"
    >
      <ApperIcon name="MapPin" className="h-4 w-4 text-primary-500" />
      <span className="text-sm font-medium">
        {location ? `${location.city}, ${location.state}` : "Set Location"}
      </span>
    </Button>
  );
};

export default LocationChip;