"use client";
import { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Corrected: Assuming this is the intended import

// Define types
type Topic = {
  _id: string; // Assuming _id is always present after creation/fetch
  name: string;
};
type Course = Topic; // Assuming Course has the same structure for this context

// Define a type for notification messages
type Notification = {
  message: string;
  type: "success" | "error";
} | null;

// Icon for the "Create" page
const CreateIcon = () => (
  <svg
    className="mx-auto h-10 w-auto text-purple-600 sm:h-12" // Adjusted size for mobile
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="12" y1="18" x2="12" y2="12"></line>
    <line x1="9" y1="15" x2="15" y2="15"></line>
  </svg>
);

// Loading Spinner Component
const Spinner = () => (
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
);

export default function CreatePage() {
  // Input states
  const [topicName, setTopicName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [goalName, setGoalName] = useState("");

  // Data states
  const [topics, setTopics] = useState<Topic[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // Selection states
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  // UI states
  const [notification, setNotification] = useState<Notification>(null);
  const [isLoadingInitialData, setIsLoadingInitialData] =
    useState<boolean>(false);
  const [isSubmittingTopic, setIsSubmittingTopic] = useState<boolean>(false);
  const [isSubmittingCourse, setIsSubmittingCourse] = useState<boolean>(false);
  const [isSubmittingGoal, setIsSubmittingGoal] = useState<boolean>(false);

  const router = useRouter();

  // Effect to check for authentication token and redirect if not found
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login"); // Redirect to login page
    }
  }, [router]);

  // Fetch initial topics and courses
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingInitialData(true);
      setNotification(null);
      try {
        // Simulate API calls if actual endpoints are not available
        // const topicsRes = await axios.get<Topic[]>("/api/topic");
        // const coursesRes = await axios.get<Course[]>("/api/course");
        // setTopics(topicsRes.data);
        // setCourses(coursesRes.data);

        // Mock data for demonstration if API endpoints are placeholders
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
        setTopics([
          { _id: "topic1", name: "Introduction to React" },
          { _id: "topic2", name: "Advanced JavaScript" },
          { _id: "topic3", name: "State Management with Redux" },
        ]);
        setCourses([
          { _id: "course1", name: "Frontend Development Bootcamp" },
          { _id: "course2", name: "Full-Stack Web Development" },
        ]);
      } catch (err) {
        console.error("Error fetching initial data", err);
        setNotification({
          message:
            "Failed to load existing topics/courses. Displaying mock data.", // Updated message for mock
          type: "error",
        });
        // Fallback to mock data on error as well for UI demonstration
        setTopics([
          { _id: "topic1_mock", name: "Mock: Intro to Web" },
          { _id: "topic2_mock", name: "Mock: CSS Fundamentals" },
        ]);
        setCourses([{ _id: "course1_mock", name: "Mock: Web Design Basics" }]);
      } finally {
        setIsLoadingInitialData(false);
      }
    };
    fetchInitialData();
  }, []);

  // Generic function to handle API errors and set notifications
  const handleApiError = (err: unknown, defaultMessage: string) => {
    console.error(defaultMessage, err);
    const message =
      (axios.isAxiosError(err) && err.response?.data?.message) ||
      defaultMessage;
    setNotification({ message, type: "error" });
  };

  // Create Topic
  const handleCreateTopic = async (e: FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) {
      setNotification({
        message: "Topic name cannot be empty.",
        type: "error",
      });
      return;
    }
    setIsSubmittingTopic(true);
    setNotification(null);
    try {
      // const res = await axios.post<Topic>("/api/topic", { name: topicName });
      // Replace with your actual API endpoint
      // For demonstration, simulate API call and add to local state
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newTopic = { _id: `topic_${Date.now()}`, name: topicName };
      setTopics((prev) => [...prev, newTopic]);
      setTopicName("");
      setNotification({
        message: `Topic "${newTopic.name}" created successfully! (Mock)`,
        type: "success",
      });
    } catch (err) {
      handleApiError(err, "Error creating topic.");
    } finally {
      setIsSubmittingTopic(false);
    }
  };

  // Create Course
  const handleCreateCourse = async (e: FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) {
      setNotification({
        message: "Course name cannot be empty.",
        type: "error",
      });
      return;
    }
    if (selectedTopicIds.length === 0) {
      setNotification({
        message: "Please select at least one topic for the course.",
        type: "error",
      });
      return;
    }
    setIsSubmittingCourse(true);
    setNotification(null);
    try {
      // const res = await axios.post<Course>("/api/course", {
      //   name: courseName,
      //   topicIds: selectedTopicIds,
      // });
      // Replace with your actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newCourse = { _id: `course_${Date.now()}`, name: courseName }; // Assuming API returns the new course
      setCourses((prev) => [...prev, newCourse]);
      setCourseName("");
      setSelectedTopicIds([]);
      setNotification({
        message: `Course "${newCourse.name}" created successfully! (Mock)`,
        type: "success",
      });
    } catch (err) {
      handleApiError(err, "Error creating course.");
    } finally {
      setIsSubmittingCourse(false);
    }
  };

  // Create Goal
  const handleCreateGoal = async (e: FormEvent) => {
    e.preventDefault();
    if (!goalName.trim()) {
      setNotification({ message: "Goal name cannot be empty.", type: "error" });
      return;
    }
    if (selectedCourseIds.length === 0) {
      setNotification({
        message: "Please select at least one course for the goal.",
        type: "error",
      });
      return;
    }
    setIsSubmittingGoal(true);
    setNotification(null);
    try {
      // await axios.post("/api/goal", {
      //   name: goalName,
      //   courseIds: selectedCourseIds,
      // });
      // Replace with your actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 500));
      setGoalName("");
      setSelectedCourseIds([]);
      setNotification({
        message: `Goal "${goalName}" created successfully! (Mock)`,
        type: "success",
      });
    } catch (err) {
      handleApiError(err, "Error creating goal.");
    } finally {
      setIsSubmittingGoal(false);
    }
  };

  // Common Tailwind classes for inputs
  const commonInputClasses =
    "block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 text-sm leading-6 bg-white disabled:opacity-70 disabled:cursor-not-allowed transition duration-150 ease-in-out"; // Changed sm:text-sm to text-sm

  // Common Tailwind classes for buttons
  const commonButtonClasses =
    "flex w-full justify-center rounded-lg bg-purple-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-md hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";

  // Common Tailwind classes for cards
  const cardClasses =
    "bg-white/30 backdrop-blur-md border border-white/40 shadow-xl rounded-xl p-4 sm:p-6 md:p-8"; // Adjusted padding for smaller screens

  return (
    <div className="font-inter bg-gradient-to-tr from-fuchsia-100 via-purple-200 to-slate-300 min-h-screen flex flex-col items-center justify-center p-4 pt-16 sm:pt-4">
      {" "}
      {/* Added top padding for mobile nav */}
      {/* Navigation Links - Adjusted for better mobile layout */}
      <div className="absolute top-4 right-4 flex flex-col space-y-1 items-end sm:flex-row sm:space-y-0 sm:space-x-3 sm:items-center">
        {/* Replace <a> with <Link href="/admin/assign"> for Next.js */}
        <a
          href="/admin/assign" // Placeholder: replace with Next.js Link if needed
          className="text-xs sm:text-sm font-semibold text-purple-700 hover:text-purple-900 bg-white/50 px-2 py-1 rounded-md shadow hover:shadow-lg transition-shadow"
        >
          Assign Page
        </a>
        {/* Replace <a> with <Link href="/login"> for Next.js */}
        <a
          href="/login" // Placeholder: replace with Next.js Link if needed
          className="text-xs sm:text-sm font-semibold text-purple-700 hover:text-purple-900 bg-white/50 px-2 py-1 rounded-md shadow hover:shadow-lg transition-shadow"
        >
          Login Page
        </a>
      </div>
      <div className="w-full max-w-xl space-y-6 sm:space-y-8">
        {" "}
        {/* Adjusted max-width and spacing */}
        {/* Page Header */}
        <div className="text-center">
          <CreateIcon />
          <h1 className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            {" "}
            {/* Responsive font size */}
            Admin - Create Content
          </h1>
          <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-700">
            {" "}
            {/* Responsive font size */}
            Add new topics, courses, and goals.
          </p>
        </div>
        {/* General Notification Area */}
        {notification && (
          <div
            className={`p-3 sm:p-4 rounded-md text-xs sm:text-sm text-center ${
              notification.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border-red-300"
            }`}
          >
            {notification.message}
          </div>
        )}
        {/* Loading Indicator */}
        {isLoadingInitialData && (
          <div className="text-center text-purple-700 py-4">
            <Spinner /> Loading initial data...
          </div>
        )}
        {/* Create Topic Card */}
        {!isLoadingInitialData && ( // Only render forms after initial data load attempt
          <>
            <form onSubmit={handleCreateTopic} className={cardClasses}>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 text-center">
                {" "}
                {/* Responsive font size */}
                Add New Topic
              </h2>
              <div>
                <label
                  htmlFor="topicName"
                  className="block text-xs sm:text-sm font-medium leading-6 text-gray-900 mb-1"
                >
                  Topic Name
                </label>
                <input
                  id="topicName"
                  name="topicName" // Added name attribute
                  type="text" // Added type attribute
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder="e.g., Advanced CSS Techniques"
                  className={commonInputClasses}
                  disabled={isSubmittingTopic}
                />
              </div>
              <button
                type="submit"
                className={`mt-4 ${commonButtonClasses}`}
                disabled={isSubmittingTopic}
              >
                {isSubmittingTopic ? <Spinner /> : "Create Topic"}
              </button>
            </form>

            {/* Create Course Card */}
            <form onSubmit={handleCreateCourse} className={cardClasses}>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 text-center">
                {" "}
                {/* Responsive font size */}
                Add New Course
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label
                    htmlFor="courseName"
                    className="block text-xs sm:text-sm font-medium leading-6 text-gray-900 mb-1"
                  >
                    Course Name
                  </label>
                  <input
                    id="courseName"
                    name="courseName" // Added name attribute
                    type="text" // Added type attribute
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="e.g., Mastering Frontend Development"
                    className={commonInputClasses}
                    disabled={isSubmittingCourse}
                  />
                </div>
                <div>
                  <label
                    htmlFor="selectTopics"
                    className="block text-xs sm:text-sm font-medium leading-6 text-gray-900 mb-1"
                  >
                    Select Topics for this Course
                  </label>
                  <select
                    id="selectTopics"
                    name="selectTopics" // Added name attribute
                    multiple
                    value={selectedTopicIds}
                    onChange={(e) =>
                      setSelectedTopicIds(
                        Array.from(e.target.selectedOptions, (o) => o.value)
                      )
                    }
                    className={`${commonInputClasses} h-32 sm:h-40 resize-none`} // Responsive height
                    disabled={
                      isSubmittingCourse ||
                      isLoadingInitialData ||
                      topics.length === 0
                    }
                  >
                    {isLoadingInitialData && (
                      <option disabled>Loading topics...</option>
                    )}
                    {!isLoadingInitialData && topics.length === 0 && (
                      <option disabled>No topics available to select</option>
                    )}
                    {topics.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className={`mt-4 sm:mt-6 ${commonButtonClasses}`}
                disabled={isSubmittingCourse || topics.length === 0}
              >
                {isSubmittingCourse ? <Spinner /> : "Create Course"}
              </button>
            </form>

            {/* Create Goal Card */}
            <form onSubmit={handleCreateGoal} className={cardClasses}>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 text-center">
                {" "}
                {/* Responsive font size */}
                Add New Goal
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label
                    htmlFor="goalName"
                    className="block text-xs sm:text-sm font-medium leading-6 text-gray-900 mb-1"
                  >
                    Goal Name
                  </label>
                  <input
                    id="goalName"
                    name="goalName" // Added name attribute
                    type="text" // Added type attribute
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    placeholder="e.g., Become a Full-Stack Developer"
                    className={commonInputClasses}
                    disabled={isSubmittingGoal}
                  />
                </div>
                <div>
                  <label
                    htmlFor="selectCourses"
                    className="block text-xs sm:text-sm font-medium leading-6 text-gray-900 mb-1"
                  >
                    Select Courses for this Goal
                  </label>
                  <select
                    id="selectCourses"
                    name="selectCourses" // Added name attribute
                    multiple
                    value={selectedCourseIds}
                    onChange={(e) =>
                      setSelectedCourseIds(
                        Array.from(e.target.selectedOptions, (o) => o.value)
                      )
                    }
                    className={`${commonInputClasses} h-32 sm:h-40 resize-none`} // Responsive height
                    disabled={
                      isSubmittingGoal ||
                      isLoadingInitialData ||
                      courses.length === 0
                    }
                  >
                    {isLoadingInitialData && (
                      <option disabled>Loading courses...</option>
                    )}
                    {!isLoadingInitialData && courses.length === 0 && (
                      <option disabled>No courses available to select</option>
                    )}
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className={`mt-4 sm:mt-6 ${commonButtonClasses}`}
                disabled={isSubmittingGoal || courses.length === 0}
              >
                {isSubmittingGoal ? <Spinner /> : "Create Goal"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
