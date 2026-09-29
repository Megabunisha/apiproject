// DOM Elements
const requestMethod = document.getElementById('requestMethod');
const requestUrl = document.getElementById('requestUrl');
const requestBody = document.getElementById('requestBody');
const sendBtn = document.getElementById('sendBtn');
const responseCode = document.getElementById('responseCode');
const responseLatency = document.getElementById('responseLatency');
const responseMeta = document.getElementById('responseMeta');
const postsContainer = document.getElementById('postsContainer');
const totalPostsCount = document.getElementById('totalPostsCount');
const refreshPostsBtn = document.getElementById('refreshPostsBtn');

// Preset Templates
const PRESETS = {
  GET_ALL: {
    method: 'GET',
    url: '/posts',
    body: '',
  },
  GET_ONE: {
    method: 'GET',
    url: '/posts/post-101',
    body: '',
  },
  POST_NEW: {
    method: 'POST',
    url: '/posts',
    body: JSON.stringify(
      {
        title: 'Building High-Performance APIs with Express',
        content: 'Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.',
        author: 'Famitha',
        category: 'Backend Architecture'
      },
      null,
      2
    ),
  },
  PUT_UPDATE: {
    method: 'PUT',
    url: '/posts/post-101',
    body: JSON.stringify(
      {
        title: 'Mastering RESTful APIs with Node.js and Express (Updated Edition)',
        category: 'Advanced Node.js'
      },
      null,
      2
    ),
  },
  DELETE_ONE: {
    method: 'DELETE',
    url: '/posts/post-105',
    body: '',
  },
};

window.setPreset = (presetKey) => {
  const preset = PRESETS[presetKey];
  if (!preset) return;

  requestMethod.value = preset.method;
  requestUrl.value = preset.url;
  requestBody.value = preset.body;
};

// Send API Request
async function sendRequest() {
  const method = requestMethod.value;
  const url = requestUrl.value.trim();
  const rawBody = requestBody.value.trim();

  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';

  const startTime = performance.now();

  try {
    const options = {
      method,
      headers: {
        'Accept': 'application/json',
      },
    };

    if (method !== 'GET' && method !== 'HEAD' && rawBody) {
      try {
        JSON.parse(rawBody); // Validate JSON format
        options.headers['Content-Type'] = 'application/json';
        options.body = rawBody;
      } catch (jsonErr) {
        showResponse(
          400,
          {
            error: 'Client JSON Parse Error',
            details: 'The request body is not valid JSON. Please check syntax.',
          },
          0
        );
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send Request';
        return;
      }
    }

    const response = await fetch(url, options);
    const duration = Math.round(performance.now() - startTime);
    const data = await response.json().catch(() => ({ message: response.statusText }));

    showResponse(response.status, data, duration);

    // Refresh live posts if state-changing operation succeeded
    if (['POST', 'PUT', 'DELETE'].includes(method) && response.status < 400) {
      loadLivePosts();
    }
  } catch (err) {
    const duration = Math.round(performance.now() - startTime);
    showResponse(500, { error: 'Network Error', message: err.message }, duration);
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send Request';
  }
}

// Display API Response
function showResponse(status, data, latency) {
  responseLatency.textContent = `${latency} ms`;

  // Status Badge Class
  let badgeClass = 'status-200';
  if (status >= 500) badgeClass = 'status-500';
  else if (status >= 400) badgeClass = 'status-400';
  else if (status === 201) badgeClass = 'status-201';

  responseMeta.innerHTML = `
    <span class="status-badge ${badgeClass}">${status} ${getStatusText(status)}</span>
    <span class="latency">${latency} ms</span>
  `;

  responseCode.textContent = JSON.stringify(data, null, 2);
}

function getStatusText(status) {
  const map = {
    200: 'OK',
    201: 'Created',
    400: 'Bad Request',
    404: 'Not Found',
    500: 'Internal Server Error',
  };
  return map[status] || '';
}

// Load and Render Live Posts from GET /posts
async function loadLivePosts() {
  try {
    const res = await fetch('/posts');
    const json = await res.json();
    const posts = json.data || [];

    totalPostsCount.textContent = posts.length;

    if (posts.length === 0) {
      postsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius);">
          No blog posts found in database. Create one using the POST endpoint!
        </div>
      `;
      return;
    }

    postsContainer.innerHTML = posts
      .map(
        (p) => `
        <div class="post-card">
          <div class="post-card-header">
            <span class="post-category">${escapeHtml(p.category || 'General')}</span>
            <span class="post-id-badge">${escapeHtml(p.id)}</span>
          </div>
          <h4 class="post-title">${escapeHtml(p.title)}</h4>
          <p class="post-content">${escapeHtml(p.content)}</p>
          <div class="post-footer">
            <span>By <strong>${escapeHtml(p.author)}</strong></span>
            <div class="post-actions">
              <button class="action-btn" onclick="testViewPost('${p.id}')">View</button>
              <button class="action-btn" onclick="testEditPost('${p.id}', '${escapeAttr(p.title)}')">Edit</button>
              <button class="action-btn delete" onclick="testDeletePost('${p.id}')">Delete</button>
            </div>
          </div>
        </div>
      `
      )
      .join('');
  } catch (err) {
    console.error('Failed to load posts:', err);
  }
}

// Helpers for card actions
window.testViewPost = (id) => {
  requestMethod.value = 'GET';
  requestUrl.value = `/posts/${id}`;
  requestBody.value = '';
  sendRequest();
  window.scrollTo({ top: 320, behavior: 'smooth' });
};

window.testEditPost = (id, currentTitle) => {
  requestMethod.value = 'PUT';
  requestUrl.value = `/posts/${id}`;
  requestBody.value = JSON.stringify(
    {
      title: `${currentTitle} (Edited)`,
    },
    null,
    2
  );
  window.scrollTo({ top: 320, behavior: 'smooth' });
};

window.testDeletePost = (id) => {
  requestMethod.value = 'DELETE';
  requestUrl.value = `/posts/${id}`;
  requestBody.value = '';
  sendRequest();
  window.scrollTo({ top: 320, behavior: 'smooth' });
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// Event Listeners
sendBtn.addEventListener('click', sendRequest);
refreshPostsBtn.addEventListener('click', loadLivePosts);

// Initial Load
loadLivePosts();
