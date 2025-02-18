"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const StudentDashboard = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("student_username");
    if (storedUsername) {
      setUsername(storedUsername.toUpperCase());
    } else {
      router.push("/student/sign-in"); 
    }
    const storedScore = localStorage.getItem("quiz_score");
    if (storedScore) {
      setScore(parseInt(storedScore)); 
    }
  }, [router]);


  const handleAttendQuiz = () => {
    router.push("/student/attend-quiz"); 
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <header className="flex justify-between items-center bg-blue-400 p-4 text-white text-2xl font-bold shadow-lg">
        <span>Welcome, {username || "STUDENT"}!</span>
      </header>
  
      <main className="flex flex-col items-center justify-center p-4">
        <div>
          <h2 className="text-xl font-bold mb-4">Your Dashboard</h2>
        </div>
  
        <div className="flex justify-center w-full mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-md font-semibold hover:bg-blue-600 transition flex items-center justify-center"
          onClick={handleAttendQuiz}
        >
          Quiz-1
        </button>
        </div>
  
        {/* Display the score if available */}
        {score !== null && (
          <div className="mt-4 text-lg font-semibold items-end flex justify-end">
            <p>Your Score: {score}</p>
          </div>
        )}
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
}
    
export default StudentDashboard;
