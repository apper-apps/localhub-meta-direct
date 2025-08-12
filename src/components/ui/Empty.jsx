import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Be the first to contribute!",
  actionLabel = "Get Started",
  onAction,
  icon = "MessageSquare"
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-card">
      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="h-8 w-8 text-primary-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md">{description}</p>
      {onAction && (
        <Button onClick={onAction} className="gap-2 bg-gradient-to-r from-primary-500 to-primary-600">
          <ApperIcon name="Plus" className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;