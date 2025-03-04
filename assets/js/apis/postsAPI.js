class PostsAPI extends BaseAPI {
    constructor() {
        super('posts');
    }

    getPost(pno) {
        return this.getOne('pno', pno);
    }

    getPosts() {
        return this.getAll();
    }

    createPost(newPost) {
        return this.create('pno', newPost);
    }

    updatePost(updatedPost) {
        return this.update('pno', updatedPost);
    }

    deletePost(pno) {
        return this.delete('pno', pno);
    }
}

window.postsAPI = new PostsAPI();
