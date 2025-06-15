/**
 * Environment configuration for the client application
 * Uses Vite environment variables with fallback defaults
 */

export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    defaultUserId: import.meta.env.VITE_DEFAULT_USER_ID || 'test-user-123',
    authToken: import.meta.env.VITE_AUTH_TOKEN || 'Bearer cHLnhvOEr8l6RkvEwjAk4sjN5XgES',
    llmApiBaseUrl: import.meta.env.VITE_LLM_API_BASE_URL || 'http://localhost:3002'
  },
  vapi: {
    apiKey: import.meta.env.VITE_VAPI_API_KEY || '',
    assistantId: import.meta.env.VITE_VAPI_ASSISTANT_ID || ''
  }
} as const;

/**
 * Helper function to get API configuration
 */
export const getApiConfig = () => {
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = config.api.defaultUserId;
  }

  return {
  baseUrl: config.api.baseUrl,
  userId: userId,
  authToken: config.api.authToken,
  llmApiBaseUrl: config.api.llmApiBaseUrl
  };
};

export const getDefaultApiConfig = () => ({
  baseUrl: config.api.baseUrl,
  userId: config.api.defaultUserId,
  authToken: config.api.authToken,
  llmApiBaseUrl: config.api.llmApiBaseUrl
});

/**
 * Helper function to get VAPI configuration
 */
export const getVapiConfig = () => ({
  apiKey: config.vapi.apiKey,
  assistantId: config.vapi.assistantId
});
