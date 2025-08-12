import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import VoteButtons from "@/components/molecules/VoteButtons";
import AnswerForm from "@/components/organisms/AnswerForm";
import AnswerCard from "@/components/organisms/AnswerCard";

const QuestionCard = ({ 
  question, 
  answers = [], 
  onVote, 
  onAnswer, 
  onAnswerVote 
}) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  const handleAnswer = (content) => {
    onAnswer(question.Id, content);
    setShowAnswerForm(false);
  };

  return (
    <Card className="p-6 hover:shadow-card-hover transition-all duration-200">
      <div className="flex gap-4">
        {/* Vote Buttons */}
        <VoteButtons
          votes={question.votes}
          onUpvote={() => onVote(question.Id, 1)}
          onDownvote={() => onVote(question.Id, -1)}
        />

        {/* Question Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
              {question.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 ml-4">
              <ApperIcon name="MapPin" className="h-4 w-4" />
              <span>{question.location.city}, {question.location.state}</span>
            </div>
          </div>

          <p className="text-gray-700 mb-4 leading-relaxed">
            {question.description}
          </p>

          <div className="flex items-center gap-3 mb-4">
            <Badge variant="primary">{question.category}</Badge>
            {question.tags && question.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAnswers(!showAnswers)}
                className="gap-2 text-gray-600 hover:text-gray-900"
              >
                <ApperIcon name="MessageSquare" className="h-4 w-4" />
                {question.answerCount || 0} {question.answerCount === 1 ? "Answer" : "Answers"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAnswerForm(!showAnswerForm)}
                className="gap-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50"
              >
                <ApperIcon name="Reply" className="h-4 w-4" />
                Answer
              </Button>
            </div>

            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
            </span>
          </div>

          {/* Answer Form */}
          {showAnswerForm && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <AnswerForm
                onSubmit={handleAnswer}
                onCancel={() => setShowAnswerForm(false)}
              />
            </div>
          )}

          {/* Answers */}
          {showAnswers && answers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
              {answers.map((answer) => (
                <AnswerCard
                  key={answer.Id}
                  answer={answer}
                  onVote={onAnswerVote}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default QuestionCard;