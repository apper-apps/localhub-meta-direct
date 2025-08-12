import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg shadow-card">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops!</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="gap-2">
          <ApperIcon name="RefreshCw" className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;