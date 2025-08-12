import { useNavigate } from "react-router-dom";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
const BusinessCard = ({ business }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/business/${business.Id}`);
  };

  return (
    <Card className="p-6 hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {business.name}
          </h3>
          <p className="text-gray-600 text-sm mb-2">{business.description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ApperIcon name="MapPin" className="h-4 w-4" />
            <span>{business.location.city}, {business.location.state}</span>
          </div>
        </div>
        <Badge variant="outline">{business.category}</Badge>
      </div>

      <div className="space-y-3">
        {business.contact.phone && (
          <div className="flex items-center gap-3">
            <ApperIcon name="Phone" className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">{business.contact.phone}</span>
          </div>
        )}

        {business.contact.email && (
          <div className="flex items-center gap-3">
            <ApperIcon name="Mail" className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">{business.contact.email}</span>
          </div>
        )}

        {business.hours && (
          <div className="flex items-center gap-3">
            <ApperIcon name="Clock" className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">{business.hours}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Button size="sm" onClick={handleViewDetails} className="gap-2">
          <ApperIcon name="ExternalLink" className="h-4 w-4" />
          View Details
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <ApperIcon name="Bookmark" className="h-4 w-4" />
          Save
        </Button>
      </div>
    </Card>
  );
};

export default BusinessCard;