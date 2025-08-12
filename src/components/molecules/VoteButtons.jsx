import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const VoteButtons = ({ votes = 0, onUpvote, onDownvote, className = "" }) => {
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={onUpvote}
        className="p-1 h-8 w-8 hover:bg-success-50 hover:text-success-600"
      >
        <ApperIcon name="ChevronUp" className="h-5 w-5" />
      </Button>
      
      <span className="text-sm font-medium text-gray-700 min-w-[2rem] text-center">
        {votes}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onDownvote}
        className="p-1 h-8 w-8 hover:bg-red-50 hover:text-red-600"
      >
        <ApperIcon name="ChevronDown" className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default VoteButtons;