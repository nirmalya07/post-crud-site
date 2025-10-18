let posts = JSON.parse(localStorage.getItem('posts')) || [];
let currentPage = 1;
let postsPerPage = parseInt(localStorage.getItem('postsPerPage')) || 5;

document.getElementById('perPage').value = postsPerPage;

function savePost() {
  const id = document.getElementById('postId').value;
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const content = document.getElementById('content').value.trim();
  const tags = document.getElementById('tags').value.split(',').map(t => t.trim()).filter(t => t);

  if (!title || !author || !content) {
    alert("All fields are required");
    return;
  }

  if (id) {
    posts = posts.map(p => p.id === id ? { ...p, title, author, content, tags, updatedAt: new Date().toISOString() } : p);
  } else {
    const newPost = {
      id: Date.now().toString(),
      title,
      author,
      content,
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    posts.push(newPost);
  }

  localStorage.setItem('posts', JSON.stringify(posts));
  resetForm();
  renderPosts();
}

function editPost(id) {
  const post = posts.find(p => p.id === id);
  if (post) {
    document.getElementById('postId').value = post.id;
    document.getElementById('title').value = post.title;
    document.getElementById('author').value = post.author;
    document.getElementById('content').value = post.content;
    document.getElementById('tags').value = post.tags.join(', ');
  }
}

function deletePost(id) {
  posts = posts.filter(p => p.id !== id);
  localStorage.setItem('posts', JSON.stringify(posts));
  renderPosts();
  resetForm();
}

function resetForm() {
  document.getElementById('postId').value = '';
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('content').value = '';
  document.getElementById('tags').value = '';
}

function changePostsPerPage() {
  postsPerPage = parseInt(document.getElementById('perPage').value);
  localStorage.setItem('postsPerPage', postsPerPage);
  currentPage = 1;
  renderPosts();
}

function renderPosts() {
  const search = document.getElementById('search').value.toLowerCase();
  const filtered = posts.filter(p => p.title.toLowerCase().includes(search));

  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  const paginatedPosts = filtered.slice(start, end);

  const postList = document.getElementById('postList');
  postList.innerHTML = '';

  paginatedPosts.forEach(post => {
    const div = document.createElement('div');
    div.className = 'post';
    div.innerHTML = `
      <h3>${post.title}</h3>
      <p><b>Author:</b> ${post.author}</p>
      <p>${post.content}</p>
      <div class="tags">${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <small>Created: ${new Date(post.createdAt).toLocaleString()}</small><br>
      <small>Updated: ${new Date(post.updatedAt).toLocaleString()}</small>
      <div>
        <button class="edit" onclick="editPost('${post.id}')">Edit</button>
        <button class="delete" onclick="deletePost('${post.id}')">Delete</button>
      </div>
    `;
    postList.appendChild(div);
  });

  if (filtered.length === 0) {
    postList.innerHTML = '<p>No posts found.</p>';
  }

  renderPagination(filtered.length);
}

function renderPagination(totalPosts) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const totalPages = Math.ceil(totalPosts / postsPerPage);
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.innerText = i;
    btn.onclick = () => { currentPage = i; renderPosts(); };
    if (i === currentPage) btn.style.fontWeight = 'bold';
    pagination.appendChild(btn);
  }
}

renderPosts();
