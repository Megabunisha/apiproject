# Blog REST API with CRUD Operations (Week 06 Minor Project)

A robust, modular **RESTful Blog API** engineered with **Node.js** and **Express.js**, adhering strictly to REST conventions, standardized HTTP response formats, request validation, and JSON file storage persistence.

---

## 📌 Project Overview

This project satisfies all requirements for **Web Development – Week 06 Minor Project**:
- **RESTful Architecture:** Clear, intuitive URI resource endpoints (`/posts`, `/posts/:id`).
- **Complete CRUD Operations:**
  - **Create:** `POST /posts` with validation for required fields (`title`, `content`, `author`, `category`).
  - **Read All:** `GET /posts` returning structured JSON arrays with optional query filters.
  - **Read Single:** `GET /posts/:id` retrieving a specific post by unique ID (with 404 handling).
  - **Update:** `PUT /posts/:id` modifying title, content, author, or category.
  - **Delete:** `DELETE /posts/:id` removing a post by ID.
- **Data Persistence:** Stored in `data/posts.json` with synchronous/asynchronous file I/O caching. Data is preserved across server restarts.
- **Middleware Integration:**
  - `cors`: Cross-Origin Resource Sharing enabled.
  - `express.json()`: Body parser.
  - Custom Request Logger: Visual terminal logging with HTTP method, URI, status codes, and latency timing.
  - Validation Middleware: Rejects invalid or missing payloads with descriptive `400 Bad Request` JSON error arrays.
  - Global 404 & Centralized Error Handlers: Standardized error responses.
- **Built-in Interactive Dashboard:** Includes a web-based testing console at `http://localhost:5000` to test endpoints and view live JSON payloads directly in your browser without requiring external software!
- **Postman / Thunder Client Export:** Pre-configured `postman_collection.json` ready for 1-click import.

---

## 🛠️ Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Fast, unopinionated web framework for Node.js |
| **CORS** | Enables cross-origin HTTP requests |
| **Dotenv** | Environment variable configuration |
| **Nodemon** | Development server hot-reloading tool |
| **HTML5 & Vanilla CSS** | Interactive browser testing dashboard |

---

## 📂 Project Structure

```
famithaproject2/
├── controllers/
│   └── postController.js       # Business logic for all 5 CRUD operations
├── routes/
│   └── postRoutes.js           # Express Router mapping HTTP verbs to controllers
├── middleware/
│   ├── validator.js            # Input validation middleware (400 error handling)
│   ├── logger.js               # Colored console request logging
│   └── errorHandler.js         # Centralized error handler and 404 middleware
├── models/
│   └── postModel.js            # Data access layer with JSON file persistence
├── data/
│   └── posts.json              # Persistent JSON database (pre-seeded with 5 posts)
├── public/
│   ├── index.html              # Interactive API Testing Console UI
│   ├── style.css               # Styling for API dashboard
│   └── app.js                  # Frontend fetch client for live testing
├── postman_collection.json     # Postman & Thunder Client ready collection
├── server.js                   # Express application entry point & listener
├── app.js                      # Export alias for the Express app
├── package.json                # Project dependencies & scripts
└── README.md                   # Comprehensive documentation
```

---

## 🚀 Installation & Running Steps

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed (v18 or higher recommended).
- [npm](https://www.npmjs.com/) (bundled with Node.js).

### 2. Install Dependencies
Navigate into the project directory and run:
```bash
cd famithaproject2
npm install
```

### 3. Start the Server

**Production Mode:**
```bash
npm start
```

**Development Mode (with auto-reload via Nodemon):**
```bash
npm run dev
```

You will see:
```text
======================================================
🚀 Blog REST API Server Running Successfully!
📡 URL:        http://localhost:5000
📚 Endpoints:  http://localhost:5000/posts
⚡ Dashboard:  http://localhost:5000
======================================================
```

---

## 📖 API Endpoints Specification

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| **GET** | `/posts` | Retrieve all blog posts (supports `?search`, `?category`, `?sort`) | `200 OK` |
| **GET** | `/posts/:id` | Retrieve a single blog post by ID | `200 OK`, `404 Not Found` |
| **POST** | `/posts` | Create a new blog post | `201 Created`, `400 Bad Request` |
| **PUT** | `/posts/:id` | Update an existing blog post by ID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **DELETE** | `/posts/:id` | Delete a blog post by ID | `200 OK`, `404 Not Found` |

*(Note: `/api/posts` is also mounted as an alias for all endpoints above).*

---

## 🧪 Testing Instructions

### Option 1: Built-In Web Testing Dashboard (Easiest)
1. Open your browser and navigate to **[http://localhost:5000](http://localhost:5000)**.
2. Click any preset button (`GET All Posts`, `GET Single Post`, `POST Create Post`, `PUT Update Post`, `DELETE Post`).
3. Click **"Send Request"** to inspect live status badges, latency in milliseconds, and formatted JSON output.

---

### Option 2: Testing with Postman / Thunder Client / Insomnia
1. Open **Postman** (or **Thunder Client** in VS Code).
2. Click **Import** → Select [`postman_collection.json`](file:///c:/famithaproject1/famithaproject2/postman_collection.json).
3. All 7 test cases (CRUD + validation tests) will be loaded automatically!

---

### Option 3: Testing with cURL Terminal Commands

#### 1. GET All Blog Posts
```bash
curl -X GET http://localhost:5000/posts
```

#### 2. GET Single Blog Post by ID
```bash
curl -X GET http://localhost:5000/posts/post-101
```

#### 3. POST Create a New Blog Post
```bash
curl -X POST http://localhost:5000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Deep Dive into Node.js Event Loop",
    "content": "Understanding the call stack, poll phase, microtasks, and timer phases.",
    "author": "Famitha",
    "category": "Node.js"
  }'
```

#### 4. PUT Update an Existing Blog Post
```bash
curl -X PUT http://localhost:5000/posts/post-101 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mastering RESTful APIs with Node.js and Express (2026 Edition)",
    "category": "Advanced Node.js"
  }'
```

#### 5. DELETE a Blog Post
```bash
curl -X DELETE http://localhost:5000/posts/post-105
```

#### 6. Test Validation Failure (Missing Required Fields - Returns 400)
```bash
curl -X POST http://localhost:5000/posts \
  -H "Content-Type: application/json" \
  -d '{"title": ""}'
```

#### 7. Test 404 Not Found (Invalid ID)
```bash
curl -X GET http://localhost:5000/posts/non-existent-id
```

---

## 📝 Author & Submission Info
- **Project:** Web Development – Week 06 Minor Project
- **Topic:** Blog REST API with CRUD Operations
- **Student Name:** Famitha
- **Status:** Completed & Validated
