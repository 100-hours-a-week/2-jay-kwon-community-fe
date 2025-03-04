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
        return this.create(['mno', 'pno'], newHeart);
    }

    deleteHeart(mno, pno) {
        return this.delete({ mno, pno });
    }
}

window.heartsAPI = new HeartsAPI();
