const postsAPI = {

    getPosts: function () {
        return JSON.parse(localStorage.getItem('posts')) || [];
    },

    getPost: function (pno) {
        const posts = this.getPosts();
        return posts.find(post => post.pno === pno) || null;
    },

    createPost: function (newPost) {
        let posts = this.getPosts();
        const maxId = posts.reduce((max, post) => (post.pno > max ? post.pno : max), 0);
        newPost.pno = maxId + 1;
        newPost.created_at = new Date().toISOString();
        newPost.views = newPost.views || 0;
        posts.push(newPost);
        localStorage.setItem('posts', JSON.stringify(posts));
        return newPost;
    },

    updatePost: function (updatedPost) {
        let posts = this.getPosts();
        const index = posts.findIndex(post => post.pno === updatedPost.pno);
        if (index === -1) {
            return null;
        }
        updatedPost.modified_at = new Date().toISOString();
        posts[index] = { ...posts[index], ...updatedPost };
        localStorage.setItem('posts', JSON.stringify(posts));
        return posts[index];
    },

    deletePost: function (pno) {
        let posts = this.getPosts();
        posts = posts.filter(post => post.pno !== pno);
        localStorage.setItem('posts', JSON.stringify(posts));
        return true;
    }
};

window.postsAPI = postsAPI;
