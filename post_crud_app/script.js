const postForm = document.getElementById('postForm');
const postsContainer = document.getElementById('posts');

let posts = JSON.parse(localStorage.getItem('posts')) || [];

function savePosts() {
  localStorage.setItem('posts', JSON.stringify(posts));
}

function renderPosts() {
  postsContainer.innerHTML = '';
  posts.forEach((post, index) => {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    postDiv.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <div class="actions">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>
    `;

    // Delete functionality
    postDiv.querySelector('.delete').addEventListener('click', () => {
      posts.splice(index, 1);
      savePosts();
      renderPosts();
    });

    // Edit functionality
    postDiv.querySelector('.edit').addEventListener('click', () => {
      const newTitle = prompt('Edit title:', post.title);
      const newContent = prompt('Edit content:', post.content);
      if (newTitle !== null && newContent !== null) {
        posts[index].title = newTitle;
        posts[index].content = newContent;
        savePosts();
        renderPosts();
      }
    });

    postsContainer.appendChild(postDiv);
  });
}

postForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;

  posts.push({ title, content });
  savePosts();
  renderPosts();

  postForm.reset();
});

// Initial render
renderPosts();