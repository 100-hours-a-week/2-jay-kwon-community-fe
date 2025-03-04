class HeartsAPI extends BaseAPI {
    constructor() {
        super('hearts');
    }

    getHearts() {
        return this.getAll();
    }

    getHeartsByPost(pno) {
        return this.getHearts().filter(heart => heart.pno === pno);
    }

    getHeartByUserAndPost(mno, pno) {
        return this.getHearts().find(heart => heart.mno === mno && heart.pno === pno) || null;
    }

    createHeart(newHeart) {
        return this.create('hno', newHeart);
    }

    deleteHeart(hno) {
        return this.delete('hno', hno);
    }
}

window.heartsAPI = new HeartsAPI();
