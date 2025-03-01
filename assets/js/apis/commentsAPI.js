const commentsAPI = {

    getComments: function () {
        return JSON.parse(localStorage.getItem('comments')) || [];
    },

    getComment: function (cno) {
        const comments = this.getComments();
        return comments.find(comment => comment.cno === cno) || null;
    },

    getCommentsByPost: function (pno) {
        const comments = this.getComments();
        return comments.filter(comment => comment.pno === pno);
    },

    createComment: function (newComment) {
        let comments = this.getComments();
        const maxCno = comments.reduce((max, comment) => comment.cno > max ? comment.cno : max, 0);
        newComment.cno = maxCno + 1;
        newComment.created_at = new Date().toISOString();
        comments.push(newComment);
        localStorage.setItem('comments', JSON.stringify(comments));
        return newComment;
    },

    updateComment: function (updatedComment) {
        let comments = this.getComments();
        const index = comments.findIndex(comment => comment.cno === updatedComment.cno);
        if (index === -1) {
            return null;
        }
        updatedComment.modified_at = new Date().toISOString();
        comments[index] = { ...comments[index], ...updatedComment };
        localStorage.setItem('comments', JSON.stringify(comments));
        return comments[index];
    },

    deleteComment: function (cno) {
        let comments = this.getComments();
        comments = comments.filter(comment => comment.cno !== cno);
        localStorage.setItem('comments', JSON.stringify(comments));
        return true;
    }
};

window.commentsAPI = commentsAPI;
