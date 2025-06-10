/**
 * Environment configuration for the client application
 * Uses Vite environment variables with fallback defaults
 */

export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    defaultUserId: import.meta.env.VITE_DEFAULT_USER_ID || 'test-user-123',
    authToken: import.meta.env.VITE_AUTH_TOKEN || 'Bearer cHLnhvOEr8l6RkvEwjAk4sjN5XgES'
  }
} as const;

/**
 * Helper function to get API configuration
 */
export const getApiConfig = () => ({
  baseUrl: config.api.baseUrl,
  userId: config.api.defaultUserId,
  authToken: config.api.authToken
});
