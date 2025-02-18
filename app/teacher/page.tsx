"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { LogOut } from "lucide-react";

const TeacherDashboard = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername.toUpperCase());
    } else {
      router.push("/teacher/sign-in");
    }

    const storedQuizzes = localStorage.getItem("quizzes");
    if (storedQuizzes) {
      setQuizzes(JSON.parse(storedQuizzes));
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="flex justify-between items-center bg-blue-300 p-3 text-white text-xl font-semibold shadow-md">
        <span>Welcome, {username || "TEACHER"}!</span>
        <button
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          onClick={() => router.push("/teacher/createquiz")}
        >
          <Plus size={20} />
        </button>
      </header>

      <main className="flex flex-col items-center justify-center p-4">
        <div className="w-full flex flex-wrap gap-2 justify-center mt-3">
          <h2 className="text-xl font-bold mb-2 w-full text-center">Quizzes Created</h2>
          {quizzes.length > 0 ? (
            quizzes.map((quiz, index) => (
              <div
                key={index}
                className="bg-blue-500 p-4 rounded-lg shadow-md w-1/3 min-w-[250px]"
              >
                <h3 className="text-lg font-bold">{quiz.title}</h3>
                <p>{quiz.questions.length} Questions</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No quizzes created yet.</p>
          )}
        </div>
      </main>
      <footer className="fixed bottom-4 right-4">
        <button 
          onClick={() => router.push("/teacher/sign-in")} 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition flex items-center gap-2"
        >
          <LogOut size={20} />
        </button>
      </footer>
    </div>
  );
};

export default TeacherDashboard;
