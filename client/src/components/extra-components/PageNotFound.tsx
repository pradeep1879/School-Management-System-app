import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-red-500">404</h1>

        <p className="text-gray-600">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="px-4 py-2 bg-black text-white rounded"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}