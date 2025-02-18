"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Editor, useEditor } from "@tiptap/react"; // Import useEditor directly
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import ListItem from "@tiptap/extension-list-item";
import { FaTrash } from "react-icons/fa";

// Dynamically import EditorContent with SSR disabled
const EditorContent = dynamic(
  () => import("@tiptap/react").then((mod) => mod.EditorContent),
  { 
    ssr: false,
    loading: () => <div className="min-h-[150px] bg-gray-800 rounded-lg p-4" />
  }
);

const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const router = useRouter();

  // Initialize editor directly in the component body
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      Image,
      TextStyle,
      Color,
      ListItem,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setCurrentQuestion(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert min-h-[150px] w-full max-w-none p-4 focus:outline-none",
      },
    },
    immediatelyRender: false, // Explicitly disable SSR rendering
  });

  // Ensure editor is only initialized on the client side
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!editor) return;

    // Any client-side specific initialization can go here
  }, [editor]);

  const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null;

    return (
      <div className="flex flex-wrap gap-2 p-2 bg-gray-800 rounded-t-lg border-b border-gray-600">
         <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("bold") ? "bg-gray-600 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("italic") ? "bg-gray-600 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("strike") ? "bg-gray-600 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("heading", { level: 1 })
              ? "bg-gray-600 text-white"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-600 text-white"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("bulletList") ? "bg-gray-600 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
        >
          Bullet List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("orderedList") ? "bg-gray-600 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
        >
          Ordered List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("blockquote") ? "bg-gray-600 text-white" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
        >
          Quote
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("#958DF1").run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("textStyle", { color: "#958DF1" })
              ? "bg-gray-600 text-white"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
        >
          Purple
        </button>
      </div>
    );
  };

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setImage(reader.result as string);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const addQuestion = () => {
    if (!currentQuestion || correctAnswers.length === 0) return alert("Fill all fields!");
    setQuestions([...questions, { question: currentQuestion, options, correctAnswers, image }]);
    editor?.commands.clearContent();
    setOptions(["", "", "", ""]);
    setCorrectAnswers([]);
    setImage(null);
  };

  const submitQuiz = () => {
    if (!title || questions.length === 0) return alert("Complete the quiz!");
    if (typeof window !== "undefined") {
      const storedQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
      localStorage.setItem("quizzes", JSON.stringify([...storedQuizzes, { title, questions }]));
    }
    router.push("/teacher");
  };

  const toggleCorrectAnswer = (index: number) => {
    setCorrectAnswers((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const addOption = () => {
    if (options.length < 6) setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
      setCorrectAnswers(correctAnswers.filter((i) => i !== index));
    }
  };

  if (!editor) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
        <h1 className="text-3xl font-bold mb-6">Create Quiz</h1>
        <div className="w-full max-w-md mb-4">
          <div className="border border-gray-600 rounded-lg overflow-hidden">
            <div className="bg-gray-800 h-[150px] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Return statement follows here
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
    <h1 className="text-3xl font-bold mb-6">Create Quiz</h1>

    <input
      type="text"
      placeholder="Quiz Title"
      className="w-full max-w-md p-2 mb-4 rounded-lg bg-gray-800 text-white"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />

    <div className="w-full max-w-md mb-4">
      <label className="text-lg font-bold mb-2">Question:</label>
      <div className="border border-gray-600 rounded-lg overflow-hidden">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} className="bg-gray-800" />
      </div>
    </div>

    <button
      className="bg-blue-500 px-4 py-2 rounded-lg text-white mt-2 hover:bg-blue-600 transition mb-4"
      onClick={addImage}
    >
      Add Image
    </button>
    {image && (
      <div className="mt-4">
        <img src={image} alt="Uploaded" className="max-w-xs rounded-lg" />
      </div>
    )}

    {options.map((opt, index) => (
      <div key={index} className="flex items-center w-full max-w-md mb-2">
        <input
          type="text"
          placeholder={`Option ${index + 1}`}
          className="w-full p-2 rounded-lg bg-gray-800 text-white"
          value={opt}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[index] = e.target.value;
            setOptions(newOptions);
          }}
        />
        <input
          type="checkbox"
          checked={correctAnswers.includes(index)}
          onChange={() => toggleCorrectAnswer(index)}
          className="ml-2 w-5 h-5"
        />
        <button
          className="ml-2 text-red-500 hover:text-red-400 transition-colors p-1"
          onClick={() => removeOption(index)}
          aria-label="Remove option"
        >
          <FaTrash className="w-4 h-4" />
        </button>
      </div>
    ))}

    <button
      className="bg-gray-500 px-4 py-2 rounded-lg text-white mt-2 hover:bg-gray-600 transition mb-4"
      onClick={addOption}
    >
      Add Option
    </button>

    <button
      className="bg-green-500 px-6 py-2 rounded-lg text-white mb-4 hover:bg-green-600 transition"
      onClick={addQuestion}
    >
      Add Question
    </button>

    <button
      className="bg-blue-500 px-6 py-2 rounded-lg text-white hover:bg-blue-600 transition"
      onClick={submitQuiz}
    >
      Submit Quiz
    </button>

    <div className="mt-6 w-full max-w-md">
      <h2 className="text-xl font-bold">Questions Preview</h2>
      {questions.map((q, index) => (
        <div key={index} className="bg-gray-800 p-4 rounded-lg mt-2">
          <div dangerouslySetInnerHTML={{ __html: q.question }} className="font-bold"></div>
          {q.image && <img src={q.image} alt="Question" className="w-20 h-20 mt-2" />}
          <ul className="list-disc list-inside">
            {q.options.map((opt: string, idx: number) => (
              <li key={idx} className={q.correctAnswers.includes(idx) ? 'text-green-500' : ''}>
                {opt}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
  );
};

export default CreateQuiz;