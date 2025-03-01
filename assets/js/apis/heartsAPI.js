const heartsAPI = {

    getHearts: function () {
        return JSON.parse(localStorage.getItem('hearts')) || [];
    },

    getHeartsByPost: function (pno) {
        const hearts = this.getHearts();
        return hearts.filter(heart => heart.pno === pno);
    },

    getHeartByUserAndPost: function (mno, pno) {
        const hearts = this.getHearts();
        return hearts.find(heart => heart.mno === mno && heart.pno === pno) || null;
    },

    createHeart: function (newHeart) {
        let hearts = this.getHearts();
        const maxId = hearts.reduce((max, heart) => heart.hno > max ? heart.hno : max, 0);
        newHeart.hno = maxId + 1;
        newHeart.created_at = new Date().toISOString();
        hearts.push(newHeart);
        localStorage.setItem('hearts', JSON.stringify(hearts));
        return newHeart;
    },

    deleteHeart: function (hno) {
        let hearts = this.getHearts();
        hearts = hearts.filter(heart => heart.hno !== hno);
        localStorage.setItem('hearts', JSON.stringify(hearts));
        return true;
    }
};

window.heartsAPI = heartsAPI;
