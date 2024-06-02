document.getElementById('fetch-posts').addEventListener('click', fetchPosts);

async function fetchPosts() {
    try {
        // Fetch posts and users in parallel
        const [postsResponse, usersResponse] = await Promise.all([
            fetch('https://jsonplaceholder.typicode.com/posts'),
            fetch('https://jsonplaceholder.typicode.com/users')
        ]);
        
        const posts = await postsResponse.json();
        const users = await usersResponse.json();
        
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = '';

        posts.forEach(post => {
            const user = users.find(user => user.id === post.userId);

            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <p><strong>User:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
            `;
            
            // Add event listener to display comments when the post is clicked
            postElement.addEventListener('click', async () => {
                try {
                    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`);
                    const comments = await response.json();
                    // Create a container to display comments
                    const commentsContainer = document.createElement('div');
                    commentsContainer.classList.add('comments');
                    // Append comments to the container
                    comments.forEach(comment => {
                        const commentElement = document.createElement('div');
                        commentElement.classList.add('comment');
                        commentElement.innerHTML = `
                            <p><strong>Name:</strong> ${comment.name}</p>
                            <p><strong>Email:</strong> ${comment.email}</p>
                            <p><strong>Body:</strong> ${comment.body}</p>
                        `;
                        commentsContainer.appendChild(commentElement);
                    });
                    // Append comments container to the post element
                    postElement.appendChild(commentsContainer);
                } catch (error) {
                    console.error('Error fetching comments:', error);
                }
            });
            
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error fetching posts or users:', error);
    }
}
