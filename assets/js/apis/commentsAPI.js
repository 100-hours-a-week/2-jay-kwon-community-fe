class CommentsAPI extends BaseAPI {
    constructor() {
        super('comments');
    }

    getComment(cno) {
        return this.getOne('cno', cno);
    }

    getComments() {
        return this.getAll();
    }

    getCommentsByPost(pno) {
        return this.getComments().filter(comment => comment.pno === pno);
    }

    createComment(newComment) {
        return this.create('cno', newComment);
    }

    updateComment(updatedComment) {
        return this.update('cno', updatedComment);
    }

    deleteComment(cno) {
        return this.delete('cno', cno);
    }
}

window.commentsAPI = new CommentsAPI();
