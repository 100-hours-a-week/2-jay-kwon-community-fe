const usersAPI = {

    getUsers: function () {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users;
    },

    getUser: function (mno) {
        const users = this.getUsers();
        return users.find(user => user.mno === mno) || null;
    },

    getUserByEmail: function (email) {
        const users = this.getUsers();
        return users.find(user => user.email === email) || null;
    },

    createUser: function (newUser) {
        let users = this.getUsers();
        const maxId = users.reduce((max, user) => (user.mno > max ? user.mno : max), 0);
        newUser.mno = maxId + 1;
        newUser.created_at = new Date().toISOString();

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return newUser;
    },

    updateUser: function (updatedUser) {
        let users = this.getUsers();
        const index = users.findIndex(user => user.mno === updatedUser.mno);
        if (index === -1) {
            return null;
        }
        updatedUser.modified_at = new Date().toISOString();
        users[index] = { ...users[index], ...updatedUser };
        localStorage.setItem('users', JSON.stringify(users));
        return users[index];
    },

    deleteUser: function (mno) {
        let users = this.getUsers();
        const newUsers = users.filter(user => user.mno !== mno);
        localStorage.setItem('users', JSON.stringify(newUsers));
        return true;
    }
};
