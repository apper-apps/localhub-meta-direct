import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import QuestionCard from "@/components/organisms/QuestionCard";
import CreateQuestionForm from "@/components/organisms/CreateQuestionForm";
import questionService from "@/services/api/questionService";
import answerService from "@/services/api/answerService";

const QAFeed = ({ currentLocation, filters }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [currentLocation, filters]);

  const loadQuestions = async () => {
    setLoading(true);
    setError("");
    try {
      let data = await questionService.getAll();
      
      // Apply location filter
      if (currentLocation) {
        data = data.filter(q => 
          q.location.city === currentLocation.city && 
          q.location.state === currentLocation.state
        );
      }

      // Apply category filter
      if (filters.category) {
        data = data.filter(q => q.category === filters.category);
      }

      setQuestions(data);

      // Load answers for all questions
      const answerPromises = data.map(async (question) => {
        const questionAnswers = await answerService.getByQuestionId(question.Id);
        return { questionId: question.Id, answers: questionAnswers };
      });

      const answerResults = await Promise.all(answerPromises);
      const answersMap = {};
      answerResults.forEach(({ questionId, answers }) => {
        answersMap[questionId] = answers;
      });
      setAnswers(answersMap);

    } catch (err) {
      setError("Failed to load questions. Please try again.");
      console.error("Error loading questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (questionData) => {
    try {
      const newQuestion = await questionService.create(questionData);
      setQuestions(prev => [newQuestion, ...prev]);
      setShowCreateForm(false);
      toast.success("Question posted successfully!");
    } catch (err) {
      toast.error("Failed to post question. Please try again.");
      console.error("Error creating question:", err);
    }
  };

  const handleVoteQuestion = async (questionId, voteValue) => {
    try {
      const updatedQuestion = await questionService.vote(questionId, voteValue);
      setQuestions(prev => 
        prev.map(q => q.Id === questionId ? updatedQuestion : q)
      );
      toast.success(voteValue > 0 ? "Upvoted!" : "Downvoted!");
    } catch (err) {
      toast.error("Failed to vote. Please try again.");
      console.error("Error voting on question:", err);
    }
  };

  const handleAnswer = async (questionId, content) => {
    try {
      const newAnswer = await answerService.create({
        questionId: questionId,
        content: content
      });
      
      // Update answers
      setAnswers(prev => ({
        ...prev,
        [questionId]: [...(prev[questionId] || []), newAnswer]
      }));

      // Update question answer count
      setQuestions(prev => 
        prev.map(q => 
          q.Id === questionId 
            ? { ...q, answerCount: (q.answerCount || 0) + 1 }
            : q
        )
      );

      toast.success("Answer posted successfully!");
    } catch (err) {
      toast.error("Failed to post answer. Please try again.");
      console.error("Error posting answer:", err);
    }
  };

  const handleVoteAnswer = async (answerId, voteValue) => {
    try {
      const updatedAnswer = await answerService.vote(answerId, voteValue);
      
      // Update answers in state
      setAnswers(prev => {
        const newAnswers = { ...prev };
        Object.keys(newAnswers).forEach(questionId => {
          newAnswers[questionId] = newAnswers[questionId].map(answer =>
            answer.Id === answerId ? updatedAnswer : answer
          );
        });
        return newAnswers;
      });

      toast.success(voteValue > 0 ? "Upvoted!" : "Downvoted!");
    } catch (err) {
      toast.error("Failed to vote. Please try again.");
      console.error("Error voting on answer:", err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadQuestions} />;

  return (
    <div className="space-y-6">
      {/* Create Question Button */}
      {!showCreateForm && (
        <div className="flex justify-center">
          <Button
            onClick={() => setShowCreateForm(true)}
            className="gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
          >
            <ApperIcon name="Plus" className="h-5 w-5" />
            Ask a Question
          </Button>
        </div>
      )}

      {/* Create Question Form */}
      {showCreateForm && (
        <CreateQuestionForm
          currentLocation={currentLocation}
          onSubmit={handleCreateQuestion}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Questions List */}
      {questions.length === 0 ? (
        <Empty
          title="No questions yet"
          description={
            currentLocation 
              ? `Be the first to ask a question in ${currentLocation.city}!`
              : "Be the first to ask a question in your area!"
          }
          actionLabel="Ask a Question"
          onAction={() => setShowCreateForm(true)}
          icon="MessageSquare"
        />
      ) : (
        <div className="space-y-6">
          {questions.map((question) => (
            <QuestionCard
              key={question.Id}
              question={question}
              answers={answers[question.Id] || []}
              onVote={handleVoteQuestion}
              onAnswer={handleAnswer}
              onAnswerVote={handleVoteAnswer}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QAFeed;