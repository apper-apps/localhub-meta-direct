import { useState, useEffect } from "react";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import BusinessCard from "@/components/organisms/BusinessCard";
import businessService from "@/services/api/businessService";

const BusinessDirectory = ({ currentLocation, filters }) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBusinesses();
  }, [currentLocation, filters]);

  const loadBusinesses = async () => {
    setLoading(true);
    setError("");
    try {
      let data = await businessService.getAll();
      
      // Apply location filter
      if (currentLocation) {
        data = data.filter(b => 
          b.location.city === currentLocation.city && 
          b.location.state === currentLocation.state
        );
      }

      // Apply category filter
      if (filters.category) {
        data = data.filter(b => b.category === filters.category);
      }

      setBusinesses(data);
    } catch (err) {
      setError("Failed to load businesses. Please try again.");
      console.error("Error loading businesses:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadBusinesses} />;

  if (businesses.length === 0) {
    return (
      <Empty
        title="No businesses found"
        description={
          currentLocation 
            ? `No businesses found in ${currentLocation.city} with your current filters.`
            : "No businesses found with your current filters."
        }
        actionLabel="Clear Filters"
        icon="Building2"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
      {businesses.map((business) => (
        <BusinessCard key={business.Id} business={business} />
      ))}
    </div>
  );
};

export default BusinessDirectory;