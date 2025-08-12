const STORAGE_KEY = 'localhub_bookmarks';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get bookmarks from localStorage
const getStoredBookmarks = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading bookmarks from localStorage:', error);
    return [];
  }
};

// Helper to save bookmarks to localStorage
const saveBookmarks = (bookmarks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Error saving bookmarks to localStorage:', error);
  }
};

let bookmarks = getStoredBookmarks();

const bookmarkService = {
  async getAll() {
    await delay(200);
    return bookmarks.map(b => ({ ...b }));
  },

  async getByModule(module) {
    await delay(200);
    return bookmarks
      .filter(b => b.module === module)
      .map(b => ({ ...b }));
  },

  async add(itemId, module, title, data = {}) {
    await delay(300);
    
    // Check if already bookmarked
    const existingIndex = bookmarks.findIndex(b => b.itemId === itemId && b.module === module);
    if (existingIndex !== -1) {
      throw new Error('Item is already bookmarked');
    }

    const newBookmark = {
      Id: Date.now(),
      itemId: parseInt(itemId),
      module,
      title,
      data,
      createdAt: new Date().toISOString()
    };

    bookmarks.unshift(newBookmark);
    saveBookmarks(bookmarks);
    
    return { ...newBookmark };
  },

  async remove(itemId, module) {
    await delay(200);
    
    const index = bookmarks.findIndex(b => b.itemId === itemId && b.module === module);
    if (index === -1) {
      throw new Error('Bookmark not found');
    }

    bookmarks.splice(index, 1);
    saveBookmarks(bookmarks);
    
    return true;
  },

  async isBookmarked(itemId, module) {
    await delay(100);
    return bookmarks.some(b => b.itemId === itemId && b.module === module);
  },

  async clear() {
    await delay(200);
    bookmarks = [];
    saveBookmarks(bookmarks);
    return true;
  }
};

export default bookmarkService;