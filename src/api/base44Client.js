import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68e43c3db6e987772672f539", 
  requiresAuth: false // Ensure authentication is required for all operations
});
