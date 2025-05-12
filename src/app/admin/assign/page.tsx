"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Define types for Goal and User
type Goal = {
  _id: string;
  name: string;
};

type User = {
  _id: string;
  email: string;
};

// Define a type for notification messages
type Notification = {
  message: string;
  type: "success" | "error";
} | null;

// Icon for the page
const AssignmentIcon = () => (
  <svg
    className="mx-auto h-12 w-auto text-purple-600"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6H8.25A2.25 2.25 0 006 8.25v7.5A2.25 2.25 0 008.25 18h7.5A2.25 2.25 0 0018 15.75V8.25A2.25 2.25 0 0015.75 6z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6V7.5M12 16.5V18M8.25 12H6.75M17.25 12H15.75"
    />
  </svg>
);

export default function AssignPage() {
  // State for goals, users, selected IDs, and notification
  const [goals, setGoals] = useState<Goal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [notification, setNotification] = useState<Notification>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  // Effect to check for authentication token and redirect if not found
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
  }, [router]);

  // Fetch initial data for goals and users
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch goals
        const goalsRes = await axios.get<Goal[]>("/api/goal"); // Replace with your actual API endpoint
        setGoals(goalsRes.data);

        // Fetch users
        const usersRes = await axios.get<User[]>("/api/user"); // Replace with your actual API endpoint
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
        setNotification({
          message: "Failed to load data. Please try again.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle assigning a goal to a user
  const handleAssignGoal = async () => {
    if (!selectedGoalId || !selectedUserId) {
      setNotification({
        message: "Please select both a goal and a user.",
        type: "error",
      });
      return;
    }
    setIsLoading(true);
    setNotification(null); // Clear previous notification

    try {
      await axios.post("/api/goal/assign", {
        // Replace with your actual API endpoint
        goalId: selectedGoalId,
        userId: selectedUserId,
      });
      setNotification({
        message: "Goal assigned successfully!",
        type: "success",
      });
      // Optionally, reset selections
      // setSelectedGoalId("");
      // setSelectedUserId("");
    } catch (err) {
      console.error("Error assigning goal", err);
      const errorMessage =
        (axios.isAxiosError(err) && err.response?.data?.message) ||
        "An unexpected error occurred.";
      setNotification({
        message: `Error assigning goal: ${errorMessage}`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Main container with background gradient and centering, using Inter font
    <div className="font-inter bg-gradient-to-tr from-fuchsia-100 via-purple-200 to-slate-300 min-h-screen flex flex-col items-center justify-center p-4">
      {/* Navigation Links: Adjusted for better mobile responsiveness */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end space-y-2 p-2 sm:flex-row sm:space-y-0 sm:space-x-4">
        {/* Replace <a> with <Link href="/admin/create"> for Next.js */}
        <a
          href="/admin/create"
          className="text-sm font-semibold text-purple-700 hover:text-purple-900"
        >
          Go to Create Page
        </a>
        {/* Replace <a> with <Link href="/login"> for Next.js */}
        <a
          href="/login"
          className="text-sm font-semibold text-purple-700 hover:text-purple-900"
        >
          Go to Login Page
        </a>
      </div>

      {/* Form Card Container: Limits width and centers the card */}
      <div className="w-full max-w-lg">
        {/* Form Container with Glassmorphism effect and responsive padding */}
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl rounded-xl p-6 sm:p-8 md:p-12">
          {/* Header Section */}
          <div className="text-center mb-6 md:mb-8">
            <AssignmentIcon />
            <h1 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Assign Goal to User
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-gray-700">
              Select a goal and a user to create an assignment.
            </p>
          </div>

          {/* Notification Area */}
          {notification && (
            <div
              className={`mb-4 p-3 rounded-md text-sm ${
                notification.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {notification.message}
            </div>
          )}

          {/* Form for assigning goals */}
          <div className="space-y-6">
            {/* Select Goal Dropdown */}
            <div>
              <label
                htmlFor="goal"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Select Goal
              </label>
              <div className="mt-2">
                <select
                  id="goal"
                  value={selectedGoalId}
                  onChange={(e) => setSelectedGoalId(e.target.value)}
                  disabled={isLoading}
                  className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out bg-white disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <option value="">Select a goal</option>
                  {goals.map((goal) => (
                    <option key={goal._id} value={goal._id}>
                      {goal.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Select User Dropdown */}
            <div>
              <label
                htmlFor="user"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Select User
              </label>
              <div className="mt-2">
                <select
                  id="user"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  disabled={isLoading}
                  className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out bg-white disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.email}{" "}
                      {/* Displaying email, assuming it's unique enough */}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Assign Button */}
            <div>
              <button
                type="button" // Changed from submit as it's not a traditional form submission
                onClick={handleAssignGoal}
                disabled={isLoading}
                className="flex w-full justify-center rounded-lg bg-purple-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-md hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Assign Goal"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
