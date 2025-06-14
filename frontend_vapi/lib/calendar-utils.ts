/**
 * Calendar utilities for creating and downloading .ics files
 * Based on: https://qiita.com/bananbo/items/281f2c98419355d7324c
 */

import { EventAttributes, createEvent } from "ics";

export interface CalendarTask {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  type: "TODO" | "CAL" | "TASK";
}

/**
 * Create and download .ics calendar file for iOS/macOS Calendar
 * @param task - Task to add to calendar
 * @returns Promise with success status and event details
 */
export async function createAndDownloadIcsFile(
  task: CalendarTask,
): Promise<{ success: boolean; filename?: string }> {
  try {
    // Parse due date or use current date as default
    const eventDate = task.dueDate ? new Date(task.dueDate) : new Date();
    
    // Set default duration (1 hour for calendar events, all-day for todos)
    const isCalendarEvent = task.type === "CAL";
    const duration = isCalendarEvent ? { hours: 1 } : { hours: 0, minutes: 30 };

    // Create event attributes for .ics file
    const eventSource: EventAttributes = {
      title: task.title,
      description: task.description 
        ? `${task.description}\n\n--- \nCreated from Oto Voice Task (${task.type})`
        : `Task created from Oto Voice Conversation\nType: ${task.type}`,
      start: [
        eventDate.getFullYear(),
        eventDate.getMonth() + 1, // ics expects 1-12, not 0-11
        eventDate.getDate(),
        eventDate.getHours(),
        eventDate.getMinutes(),
      ],
      duration: duration,
      // Add task type as category
      categories: [task.type, "Oto", "Voice Task"],
      // Set different alarms based on task type
      alarms: isCalendarEvent ? [
        {
          action: "display",
          description: `Reminder: ${task.title}`,
          trigger: { minutes: 15, before: true },
        },
      ] : [
        {
          action: "display", 
          description: `TODO: ${task.title}`,
          trigger: { hours: 1, before: true },
        },
      ],
      // Add status for TODO items  
      status: task.type === "TODO" ? "TENTATIVE" : "CONFIRMED",
      // Add URL back to the app (if needed)
      url: `${window.location.origin}/tasks`,
    };

    console.log("📅 Creating calendar event:", eventSource);

    // Create .ics content
    const { error, value: icsContent } = createEvent(eventSource);
    
    if (error) {
      console.error("❌ Error creating .ics content:", error);
      return { success: false };
    }

    if (!icsContent) {
      console.error("❌ No .ics content generated");
      return { success: false };
    }

    // Create filename with task title (sanitized)
    const sanitizedTitle = task.title
      .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .substring(0, 50); // Limit length

    const filename = `${sanitizedTitle}_task.ics`;

    // Create file and download
    const file = new File([icsContent], filename, { type: "text/calendar" });
    const url = URL.createObjectURL(file);

    // Create download link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    
    // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up object URL
    URL.revokeObjectURL(url);

    console.log("✅ Calendar file downloaded:", filename);

    return {
      success: true,
      filename: filename,
    };
  } catch (error) {
    console.error("❌ Error creating calendar file:", error);
    return { success: false };
  }
}

/**
 * Check if the current device/browser supports .ics file downloads
 * @returns boolean indicating support
 */
export function isIcsDownloadSupported(): boolean {
  // Check if we're in a browser environment
  if (typeof window === "undefined") return false;
  
  // Check if File constructor is available
  if (typeof File === "undefined") return false;
  
  // Check if URL.createObjectURL is available
  if (typeof URL === "undefined" || !URL.createObjectURL) return false;
  
  return true;
}

/**
 * Get user-friendly message for calendar integration
 * @param deviceType - Type of device/OS
 * @returns Instructions for the user
 */
export function getCalendarInstructions(deviceType?: "ios" | "android" | "desktop"): string {
  if (!deviceType) {
    // Try to detect device type
    if (typeof navigator !== "undefined") {
      const userAgent = navigator.userAgent;
      if (/iPhone|iPad|iPod/i.test(userAgent)) {
        deviceType = "ios";
      } else if (/Android/i.test(userAgent)) {
        deviceType = "android";
      } else {
        deviceType = "desktop";
      }
    }
  }

  switch (deviceType) {
    case "ios":
      return "The calendar file will be downloaded. Tap to open it in your Calendar app.";
    case "android":
      return "The calendar file will be downloaded. Open it with your preferred calendar app.";
    case "desktop":
    default:
      return "The calendar file will be downloaded. Open it with your calendar application (Calendar, Outlook, etc.).";
  }
}

/**
 * Create Google Calendar URL for adding events
 * @param task - Task to add to Google Calendar
 * @returns Google Calendar URL
 */
export function createGoogleCalendarUrl(task: CalendarTask): string {
  const baseUrl = "https://calendar.google.com/calendar/render";
  
  // Parse due date or use current date
  const eventDate = task.dueDate ? new Date(task.dueDate) : new Date();
  
  // Format date for Google Calendar (YYYYMMDDTHHMMSS)
  const formatGoogleDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${year}${month}${day}T${hour}${minute}00`;
  };

  // Calculate end time (add 1 hour for calendar events, 30 minutes for tasks)
  const endDate = new Date(eventDate);
  const durationMinutes = task.type === "CAL" ? 60 : 30;
  endDate.setMinutes(endDate.getMinutes() + durationMinutes);

  const startTime = formatGoogleDate(eventDate);
  const endTime = formatGoogleDate(endDate);

  // Build Google Calendar URL parameters
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: task.title,
    dates: `${startTime}/${endTime}`,
    details: task.description 
      ? `${task.description}\n\n---\nCreated from Oto Voice Task (${task.type})`
      : `Task created from Oto Voice Conversation\nType: ${task.type}`,
    location: "", // Can be added if needed
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Open Google Calendar with pre-filled event
 * @param task - Task to add to Google Calendar
 * @returns Promise with success status
 */
export async function openGoogleCalendar(
  task: CalendarTask,
): Promise<{ success: boolean; url?: string }> {
  try {
    const calendarUrl = createGoogleCalendarUrl(task);
    
    console.log("📅 Opening Google Calendar:", calendarUrl);

    // Open in new tab/window
    const newWindow = window.open(calendarUrl, "_blank");
    
    if (newWindow) {
      return {
        success: true,
        url: calendarUrl,
      };
    } else {
      // Popup blocked, provide fallback
      console.warn("⚠️ Popup blocked, providing URL for manual opening");
      return {
        success: false,
        url: calendarUrl,
      };
    }
  } catch (error) {
    console.error("❌ Error opening Google Calendar:", error);
    return { success: false };
  }
}
