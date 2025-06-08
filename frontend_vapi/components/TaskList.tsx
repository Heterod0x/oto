import { Calendar, Clock, Plus } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { VAPIClient } from '../lib/api-client';
import { LoadingSpinner } from './LoadingSpinner';
import { useToast } from './Toast';
import { Button } from './ui/button';

/**
 * Task interface representing a task item
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;
  /** Type of task (TODO, Calendar event, or general TASK) */
  type: 'TODO' | 'CAL' | 'TASK';
  /** Task title */
  title: string;
  /** Optional task description */
  description?: string;
  /** Optional due date in ISO string format */
  dueDate?: string;
  /** Task priority level */
  priority?: 'low' | 'medium' | 'high';
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

  const apiClient = new VAPIClient();

  useEffect(() => {
    loadTasks();
  }, []);

  /**
   * Loads tasks from the API
   * Currently uses mock data but can be extended to use real API endpoints
   */
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, use mock data since we don't have a direct getTasks method
      // In a real implementation, you would use streamTasks or another API endpoint
      const mockTasks: Task[] = [];
      setTasks(mockTasks);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedTask = { ...task, completed: !task.completed };
      // Note: VAPIClient doesn't have updateTask method yet
      // await apiClient.updateTask(taskId, updatedTask);
      
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === taskId ? updatedTask : t)
      );
      
      showToast({
        type: updatedTask.completed ? 'success' : 'success',
        title: updatedTask.completed ? 'Task marked as completed' : 'Task marked as incomplete'
      });
    } catch (err) {
      console.error('Failed to update task:', err);
      showToast({
        type: 'error',
        title: 'Failed to update task'
      });
    }
  };

  const handleAddToCalendar = async (task: Task, calendarType: 'google' | 'ios') => {
    try {
      if (calendarType === 'google') {
        await apiClient.addToGoogleCalendar(task);
      } else {
        await apiClient.addToIosCalendar(task);
      }
      showToast({
        type: 'success',
        title: `Added to ${calendarType === 'google' ? 'Google' : 'iOS'} Calendar`
      });
    } catch (err) {
      console.error('Failed to add to calendar:', err);
      showToast({
        type: 'error',
        title: 'Failed to add to calendar'
      });
    }
  };

  const getPriorityColor = (priority?: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
    <div className={`p-6 ${className || ''}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task List</h1>
          <p className="text-gray-600">
            View and manage tasks extracted from voice conversations
          </p>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-gray-400 mb-4">
              <Plus size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tasks yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start a conversation with the agent to create tasks
            </p>
            <Button
              onClick={() => router.push('/agent')}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Plus size={20} className="mr-2" />
              Start conversation with agent
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-lg shadow-sm border transition-all duration-200 ${
                  task.completed ? 'opacity-75' : 'hover:shadow-md'
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
                        <h3 className={`text-lg font-medium mb-1 ${
                          task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                        <p className={`text-sm mb-3 ${
                          task.completed ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {task.description}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority === 'high' ? 'High' : task.priority === 'medium' ? 'Med' : task.priority === 'low' ? 'Low' : '-'}
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
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {task.type}
                      </span>
                    </div>

                    {!task.completed && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddToCalendar(task, 'google')}
                          className="text-xs"
                        >
                          Google Calendar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddToCalendar(task, 'ios')}
                          className="text-xs"
                        >
                          iOS Calendar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}