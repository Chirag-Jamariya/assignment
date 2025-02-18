"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AttendQuiz = () => {
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch quiz questions from API
    const fetchQuizQuestions = async () => {
      try {
        const response = await fetch("https://67a2383c409de5ed5254b5ba.mockapi.io/users");
        const data = await response.json();
        setQuizQuestions(data.slice(0, 5)); // Take first 5 questions
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
      }
    };

    fetchQuizQuestions();
  }, []);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) return;
  
    setScore((prevScore) => {
      const newScore =
        selectedAnswer === quizQuestions[currentQuestion].correctanswers
          ? prevScore + 1
          : prevScore;
  
      localStorage.setItem("quiz_score", newScore.toString()); // Save the updated score
      return newScore;
    });
  
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col items-center justify-center p-4">
      {!quizCompleted ? (
        quizQuestions.length > 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md w-[90%] md:w-1/2">
            <h2 className="text-xl font-bold mb-4">Question {currentQuestion + 1}:</h2>
            <p className="text-lg font-semibold mb-4">{quizQuestions[currentQuestion].questions}</p>

            {/* Display Image if available */}
            {quizQuestions[currentQuestion].image && (
              <div className="mb-4">
                <img
                  src={quizQuestions[currentQuestion].image}
                  alt="Question Image"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}

            {/* Display Answer Options */}
            <div className="grid grid-cols-2 gap-4">
              {quizQuestions[currentQuestion].answers.map((answer: string, index: number) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded border text-lg font-semibold transition ${
                    selectedAnswer === answer
                      ? answer === quizQuestions[currentQuestion].correctanswers
                        ? "border-green-500 bg-green-200"
                        : "border-red-500 bg-red-200"
                      : "border-gray-300 bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => handleAnswerSelect(answer)}
                  disabled={!!selectedAnswer}
                >
                  {answer}
                </button>
              ))}
            </div>

            {/* Next Question Button */}
            <button
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
            >
              {currentQuestion + 1 === quizQuestions.length ? "Finish Quiz" : "Next Question"}
            </button>
          </div>
        ) : (
          <p className="text-gray-400">Loading quiz...</p>
        )
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md w-[90%] md:w-1/2 text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-lg">Your Score: {score} / {quizQuestions.length}</p>
          <button
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => router.push("/student")}
          >
            Go Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendQuiz;
