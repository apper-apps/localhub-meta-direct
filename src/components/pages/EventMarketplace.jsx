import { useState, useEffect } from "react";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import EventCard from "@/components/organisms/EventCard";
import eventService from "@/services/api/eventService";

const EventMarketplace = ({ currentLocation, filters }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEvents();
  }, [currentLocation, filters]);

  const loadEvents = async () => {
    setLoading(true);
    setError("");
    try {
      let data = await eventService.getAll();
      
      // Apply location filter
      if (currentLocation) {
        data = data.filter(e => 
          e.location.city === currentLocation.city && 
          e.location.state === currentLocation.state
        );
      }

      // Apply category filter
      if (filters.category) {
        data = data.filter(e => e.category === filters.category);
      }

      // Sort by date
      data.sort((a, b) => new Date(a.date) - new Date(b.date));

      setEvents(data);
    } catch (err) {
      setError("Failed to load events. Please try again.");
      console.error("Error loading events:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadEvents} />;

  if (events.length === 0) {
    return (
      <Empty
        title="No events found"
        description={
          currentLocation 
            ? `No events found in ${currentLocation.city} with your current filters.`
            : "No events found with your current filters."
        }
        actionLabel="Clear Filters"
        icon="Calendar"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
      {events.map((event) => (
        <EventCard key={event.Id} event={event} />
      ))}
    </div>
  );
};

export default EventMarketplace;