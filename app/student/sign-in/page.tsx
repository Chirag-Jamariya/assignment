"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignIn = () => {
  const [student_username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", { student_username, password });
    if (student_username.trim() === "") {
        alert("Please enter a username");
        return;
      }
  
      localStorage.setItem("student_username", student_username);
    router.push("/student")

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-300 text-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Welcome Students</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={student_username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Log in
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          or, <Link href="/teacher/page.tsx" className="text-blue-500">sign up</Link>
        </p>
        <p className=" text-left mt-4 text-black" >
            if Teacher sign in <a href="/teacher/sign-in" className="text-blue-500">here</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
