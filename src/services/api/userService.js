const ACTIVITY_STORAGE_KEY = 'localhub_user_activity';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get activity from localStorage
const getStoredActivity = () => {
  try {
    const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading activity from localStorage:', error);
    return [];
  }
};

// Helper to save activity to localStorage
const saveActivity = (activities) => {
  try {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activities));
  } catch (error) {
    console.error('Error saving activity to localStorage:', error);
  }
};

let userActivity = getStoredActivity();

// Mock user data
const mockUser = {
  Id: 1,
  name: 'Local User',
  email: 'user@localhub.com',
  location: 'San Francisco, CA',
  joinedAt: '2024-01-01T00:00:00Z',
  preferences: {
    notifications: true,
    publicProfile: false,
    emailUpdates: true
  }
};

const userService = {
  async getCurrentUser() {
    await delay(200);
    return { ...mockUser };
  },

  async updateProfile(updateData) {
    await delay(500);
    Object.assign(mockUser, updateData);
    return { ...mockUser };
  },

  async getActivity() {
    await delay(300);
    return userActivity
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(a => ({ ...a }));
  },

  async addActivity(type, description, module, metadata = {}) {
    await delay(200);
    
    const newActivity = {
      Id: Date.now(),
      type,
      description,
      module,
      metadata,
      createdAt: new Date().toISOString()
    };

    userActivity.unshift(newActivity);
    
    // Keep only the last 100 activities
    if (userActivity.length > 100) {
      userActivity = userActivity.slice(0, 100);
    }
    
    saveActivity(userActivity);
    return { ...newActivity };
  },

  async clearActivity() {
    await delay(200);
    userActivity = [];
    saveActivity(userActivity);
    return true;
  },

  async getStats() {
    await delay(200);
    
    const activityTypes = userActivity.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {});

    const moduleActivity = userActivity.reduce((acc, activity) => {
      acc[activity.module] = (acc[activity.module] || 0) + 1;
      return acc;
    }, {});

    return {
      totalActivity: userActivity.length,
      activityTypes,
      moduleActivity,
      joinedAt: mockUser.joinedAt
    };
  }
};

export default userService;