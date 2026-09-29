import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/posts.json');

// In-memory cache synced with JSON file
let postsCache = [];

/**
 * Initialize cache by reading posts.json from disk
 */
const initStorage = async () => {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    postsCache = JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      postsCache = [];
      await saveToFile();
    } else {
      console.error('Error reading posts.json:', err);
    }
  }
};

/**
 * Persist cache back to JSON file
 */
const saveToFile = async () => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(postsCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving to posts.json:', err);
  }
};

// Initial load
await initStorage();

export const PostModel = {
  /**
   * Retrieve all posts with optional filtering and sorting
   * @param {Object} filters - { search, category, author, sort }
   */
  async getAll(filters = {}) {
    let result = [...postsCache];

    // Filter by search query (title or content)
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      result = result.filter(
        (p) => p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Filter by author
    if (filters.author) {
      result = result.filter(
        (p) => p.author.toLowerCase().includes(filters.author.toLowerCase())
      );
    }

    // Sort by date: 'newest' (default) or 'oldest'
    if (filters.sort === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  },

  /**
   * Retrieve a single post by ID
   * @param {string} id
   */
  async getById(id) {
    return postsCache.find((p) => p.id === id) || null;
  },

  /**
   * Create a new blog post
   * @param {Object} postData - { title, content, author, category }
   */
  async create({ title, content, author, category }) {
    const newPost = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      category: category.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    postsCache.unshift(newPost);
    await saveToFile();
    return newPost;
  },

  /**
   * Update an existing post by ID
   * @param {string} id
   * @param {Object} updateData - { title, content, author, category }
   */
  async update(id, updateData) {
    const index = postsCache.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const currentPost = postsCache[index];
    const updatedPost = {
      ...currentPost,
      ...(updateData.title && { title: updateData.title.trim() }),
      ...(updateData.content && { content: updateData.content.trim() }),
      ...(updateData.author && { author: updateData.author.trim() }),
      ...(updateData.category && { category: updateData.category.trim() }),
      updatedAt: new Date().toISOString(),
    };

    postsCache[index] = updatedPost;
    await saveToFile();
    return updatedPost;
  },

  /**
   * Delete a post by ID
   * @param {string} id
   */
  async delete(id) {
    const index = postsCache.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const deleted = postsCache.splice(index, 1)[0];
    await saveToFile();
    return deleted;
  },

  /**
   * Reset data to default seed
   */
  async reset() {
    await initStorage();
    return postsCache;
  }
};
