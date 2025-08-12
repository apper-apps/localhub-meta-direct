import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const EventCard = ({ event }) => {
  return (
    <Card className="p-6 hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {event.title}
          </h3>
          <p className="text-gray-600 mb-3 line-clamp-2">
            {event.description}
          </p>
        </div>
        <Badge variant="accent">{event.category}</Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3">
          <ApperIcon name="Calendar" className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-700">
            {format(new Date(event.date), "MMM d, yyyy 'at' h:mm a")}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ApperIcon name="MapPin" className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-700">
            {event.location.address || `${event.location.city}, ${event.location.state}`}
          </span>
        </div>

        {event.price !== undefined && (
          <div className="flex items-center gap-3">
            <ApperIcon name="DollarSign" className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">
              {event.price === 0 ? "Free" : `$${event.price}`}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" className="gap-2">
          <ApperIcon name="Calendar" className="h-4 w-4" />
          Add to Calendar
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <ApperIcon name="Share2" className="h-4 w-4" />
          Share
        </Button>
      </div>
    </Card>
  );
};

export default EventCard;