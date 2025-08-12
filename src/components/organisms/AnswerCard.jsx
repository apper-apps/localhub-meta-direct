import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import VoteButtons from "@/components/molecules/VoteButtons";

const AnswerCard = ({ answer, onVote }) => {
  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
      <VoteButtons
        votes={answer.votes}
        onUpvote={() => onVote(answer.Id, 1)}
        onDownvote={() => onVote(answer.Id, -1)}
        className="scale-90"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          {answer.isAccepted && (
            <Badge variant="success" className="gap-1">
              <ApperIcon name="Check" className="h-3 w-3" />
              Accepted
            </Badge>
          )}
          <span className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
          </span>
        </div>

        <p className="text-gray-700 leading-relaxed">{answer.content}</p>
      </div>
    </div>
  );
};

export default AnswerCard;