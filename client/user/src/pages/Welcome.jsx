import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-indigo-500 to-blue-500 text-white text-center">
      <h1 className="text-5xl font-bold mb-6">Welcome to AI Code Converter</h1>
      <p className="mb-10 text-lg">Convert code between programming languages using AI</p>
      <div className="flex space-x-4">
        <Link to="/register" className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold shadow">
          Register
        </Link>
        <Link to="/login" className="border border-white px-6 py-2 rounded-lg font-semibold">
          Login
        </Link>
      </div>
    </div>
  );
}
