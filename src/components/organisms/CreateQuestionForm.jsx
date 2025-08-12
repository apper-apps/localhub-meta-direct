import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";

const CreateQuestionForm = ({ currentLocation, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
    tags: ""
  });

  const categories = [
    "General", "Recommendations", "Events", "Local News", "Help", "Discussion"
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const questionData = {
      ...formData,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      location: currentLocation
    };

    onSubmit(questionData);
    setFormData({
      title: "",
      description: "",
      category: "General",
      tags: ""
    });
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <ApperIcon name="MessageSquare" className="h-6 w-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">Ask a Question</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Question Title"
          name="title"
          placeholder="What would you like to know?"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Provide more details about your question..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <FormField
          label="Tags"
          name="tags"
          placeholder="Add tags separated by commas"
          value={formData.tags}
          onChange={(e) => handleChange("tags", e.target.value)}
        />

        {currentLocation && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <ApperIcon name="MapPin" className="h-4 w-4" />
            <span>
              This question will be visible to people in {currentLocation.city}, {currentLocation.state}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" className="gap-2">
            <ApperIcon name="Send" className="h-4 w-4" />
            Post Question
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateQuestionForm;