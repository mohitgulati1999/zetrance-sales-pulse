const API_BASE_URL = 'http://localhost:5000';

export const api = {
  // User endpoints
  createUser: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    return response.json();
  },

  loginUser: async (loginData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    if (!response.ok) {
      throw new Error('Failed to login');
    }
    return response.json();
  },

  // Sales session endpoints
  createSalesSession: async (sessionData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/salesessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });
    if (!response.ok) {
      throw new Error('Failed to create sales session');
    }
    return response.json();
  },

  // Analytics endpoints
  analyzeSession: async (sessionId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to analyze session');
    }
    return response.json();
  },

  getUserAnalytics: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to get user analytics');
    }
    return response.json();
  },

  getStoreAnalytics: async (storeId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/store/${storeId}`);
    if (!response.ok) {
      throw new Error('Failed to get store analytics');
    }
    return response.json();
  },

  getZoneAnalytics: async (zoneId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/zone/${zoneId}`);
    if (!response.ok) {
      throw new Error('Failed to get zone analytics');
    }
    return response.json();
  },
};