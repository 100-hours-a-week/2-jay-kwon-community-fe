class UsersAPI extends BaseAPI {
    constructor() {
        super('users');
    }

    getUser(mno) {
        return this.getOne('mno', mno);
    }

    getUsers() {
        return this.getAll();
    }

    getUserByEmail(email) {
        return this.getAll().find(user => user.email === email) || null;
    }

    createUser(newUser) {
        return this.create('mno', newUser);
    }

    updateUser(updatedUser) {
        return this.update('mno', updatedUser);
    }

    deleteUser(mno) {
        return this.delete('mno', mno);
    }
}

window.usersAPI = new UsersAPI();
