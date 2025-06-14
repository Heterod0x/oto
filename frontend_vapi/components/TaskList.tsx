import { usePrivy } from "@privy-io/react-auth";
import { Calendar, Clock, Download, ExternalLink, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { VAPIClient } from "../lib/api-client";
import { ActionResponse, getActions, updateAction } from "../lib/oto-api";
import { LoadingSpinner } from "./LoadingSpinner";
import { useToast } from "./Toast";
import { Button } from "./ui/button";

/**
 * Task interface representing a task item
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;
  /** Type of task (TODO, Calendar event, or general TASK) */
  type: "TODO" | "CAL" | "TASK";
  /** Task title */
  title: string;
  /** Optional task description */
  description?: string;
  /** Optional due date in ISO string format */
  dueDate?: string;
  /** Task priority level */
  priority?: "low" | "medium" | "high";
  /** Whether the task is completed */
  completed?: boolean;
  /** Creation timestamp in ISO string format */
  createdAt: string;
}

/**
 * Props for TaskList component
 */
export interface TaskListProps {
  /** Additional CSS class names */
  className?: string;
}

/**
 * TaskList component that displays and manages tasks extracted from AI conversations
 * Provides functionality to view, complete, and navigate to task details
 *
 * @param props - Component props
 * @returns React component for task list management
 */
export function TaskList({ className }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const router = useRouter();
  const { user } = usePrivy();

  const apiClient = new VAPIClient();

  // Get user ID from Privy authentication (similar to record.tsx)
  const userId = useMemo(() => {
    const walletAddress = user?.wallet?.address;
    const privyId = user?.id;

    // Use wallet address if available (shorter and more standard)
    if (walletAddress) {
      console.log("👤 Using wallet address as user ID:", walletAddress);
      return walletAddress;
    }

    // Fallback to Privy ID but truncate if too long
    if (privyId) {
      const truncatedId = privyId.length > 42 ? privyId.substring(0, 42) : privyId;
      console.log("👤 Using truncated Privy ID as user ID:", truncatedId);
      return truncatedId;
    }

    console.warn("⚠️ No user ID available");
    return "";
  }, [user]);

  // Get API configuration from environment variables
  const apiEndpoint = process.env.NEXT_PUBLIC_OTO_API_ENDPOINT;
  const apiKey = process.env.NEXT_PUBLIC_OTO_API_KEY;

  useEffect(() => {
    loadTasks();
  }, [userId]);

  /**
   * Transforms ActionResponse from API to Task interface
   */
  const transformActionToTask = useCallback((action: ActionResponse): Task => {
    // Map action type to task type
    const getTaskType = (type: string): "TODO" | "CAL" | "TASK" => {
      switch (type) {
        case "todo":
          return "TODO";
        case "calendar":
          return "CAL";
        case "research":
          return "TASK";
        default:
          return "TASK";
      }
    };

    // Determine priority based on action content or type
    const getPriority = (action: ActionResponse): "low" | "medium" | "high" | undefined => {
      // Set priority based on action type
      if (action.type === "calendar") return "high"; // Calendar events are high priority
      if (action.type === "todo") return "medium"; // TODOs are medium priority  
      return "low"; // Research tasks are low priority
    };

    // Create a comprehensive description
    const getDescription = (action: ActionResponse): string => {
      if (action.inner.body) return action.inner.body;
      if (action.inner.query) return `Research: ${action.inner.query}`;
      // Truncate transcript if it's too long
      const transcript = action.relate.transcript;
      return transcript.length > 200 ? transcript.substring(0, 200) + "..." : transcript;
    };

    return {
      id: action.id,
      type: getTaskType(action.type),
      title: action.inner.title,
      description: getDescription(action),
      dueDate: action.inner.datetime,
      priority: getPriority(action),
      completed: action.status === "completed",
      createdAt: action.created_at,
    };
  }, []);

  /**
   * Loads tasks from the API using the real getActions endpoint
   */
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we have the required configuration
      if (!apiEndpoint || !apiKey) {
        console.warn("⚠️ API endpoint or key not configured");
        setError("API configuration missing. Please check environment variables.");
        setTasks([]);
        return;
      }

      if (!userId) {
        console.warn("⚠️ User ID not available");
        setError("Please authenticate to view your tasks");
        setTasks([]);
        return;
      }

      console.log("📥 Fetching tasks from API...");
      
      // Fetch actions from the API
      const actions = await getActions(userId, apiKey, apiEndpoint, {
        // Get all tasks (created, accepted, completed) but exclude deleted ones
        // You can add filters here based on user preferences
      });

      console.log("📦 Retrieved actions:", actions);

      // Filter out deleted actions on the client side
      const activeActions = actions.filter(action => action.status !== "deleted");

      // Transform actions to tasks
      const transformedTasks = activeActions.map(transformActionToTask);
      
      setTasks(transformedTasks);
      console.log("✅ Tasks loaded successfully:", transformedTasks.length);
    } catch (err) {
      console.error("❌ Failed to load tasks:", err);
      setError("Failed to load tasks from API");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      if (!apiEndpoint || !apiKey || !userId) {
        showToast({
          type: "error",
          title: "Cannot update task - API not configured",
        });
        return;
      }

      const newStatus = task.completed ? "created" : "completed";
      
      console.log("🔄 Updating task status...", { taskId, newStatus });

      // Call the API to update the task status
      const result = await updateAction(taskId, newStatus, userId, apiKey, apiEndpoint);

      if (result.success) {
        // Update local state only if API call was successful
        const updatedTask = { ...task, completed: !task.completed };
        setTasks((prevTasks) => prevTasks.map((t) => (t.id === taskId ? updatedTask : t)));

        showToast({
          type: "success",
          title: updatedTask.completed 
            ? "Task marked as completed" 
            : "Task marked as incomplete",
        });
      } else {
        showToast({
          type: "error",
          title: "Failed to update task status",
        });
      }
    } catch (err) {
      console.error("Failed to update task:", err);
      showToast({
        type: "error",
        title: "Failed to update task",
      });
    }
  };

  const handleAddToCalendar = async (task: Task, calendarType: "google" | "ios") => {
    try {
      let result;
      if (calendarType === "google") {
        result = await apiClient.addToGoogleCalendar(task);
      } else {
        result = await apiClient.addToIosCalendar(task);
      }

      if (result.success) {
        showToast({
          type: "success",
          title: calendarType === "google" 
            ? "Google Calendar opened with event details" 
            : "Calendar file downloaded successfully",
        });
      } else {
        throw new Error("Calendar operation failed");
      }
    } catch (err) {
      console.error("Failed to add to calendar:", err);
      showToast({
        type: "error",
        title: `Failed to add to ${calendarType === "google" ? "Google" : "iOS"} Calendar`,
      });
    }
  };

  /**
   * Handles task deletion by marking it as deleted
   */
  const handleDeleteTask = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      if (!apiEndpoint || !apiKey || !userId) {
        showToast({
          type: "error",
          title: "Cannot delete task - API not configured",
        });
        return;
      }

      console.log("🗑️ Deleting task...", { taskId });

      // Call the API to mark the task as deleted
      const result = await updateAction(taskId, "deleted", userId, apiKey, apiEndpoint);

      if (result.success) {
        // Remove the task from local state
        setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));

        showToast({
          type: "success",
          title: "Task deleted successfully",
        });
      } else {
        showToast({
          type: "error",
          title: "Failed to delete task",
        });
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
      showToast({
        type: "error",
        title: "Failed to delete task",
      });
    }
  };

  const getPriorityColor = (priority?: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadTasks} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className || ""}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Task List</h1>
            <Button
              onClick={loadTasks}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </Button>
          </div>
          <p className="text-gray-600">View and manage tasks extracted from voice conversations</p>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-gray-400 mb-4">
              <Plus size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
            <p className="text-gray-600 mb-6">
              Record a conversation to automatically extract tasks and action items
            </p>
            <Button
              onClick={() => router.push("/record")}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Plus size={20} className="mr-2" />
              Start recording conversation
            </Button>
          </div>
        ) : (
          <div>
            {/* Task Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.completed).length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-orange-600">
                  {tasks.filter(t => !t.completed).length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-white rounded-lg shadow-sm border transition-all duration-200 ${
                    task.completed ? "opacity-75" : "hover:shadow-md"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleComplete(task.id)}
                          className="mt-1 h-4 w-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                        />
                        <div className="flex-1">
                          <h3
                            className={`text-lg font-medium mb-1 ${
                              task.completed ? "line-through text-gray-500" : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </h3>
                          <p
                            className={`text-sm mb-3 ${
                              task.completed ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {task.description}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority === "high"
                          ? "High"
                          : task.priority === "medium"
                            ? "Med"
                            : task.priority === "low"
                              ? "Low"
                              : "-"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>Created: {formatDate(task.createdAt)}</span>
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>Due: {formatDate(task.dueDate)}</span>
                          </div>
                        )}
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">{task.type}</span>
                      </div>                    {!task.completed && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddToCalendar(task, "google")}
                          className="text-xs flex items-center gap-1"
                        >
                          <ExternalLink size={12} />
                          Google
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddToCalendar(task, "ios")}
                          className="text-xs flex items-center gap-1"
                        >
                          <Download size={12} />
                          iOS
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-xs text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 size={12} className="mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
