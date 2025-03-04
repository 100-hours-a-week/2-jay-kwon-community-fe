class BaseAPI {
    constructor(storageKey) {
        this.storageKey = storageKey;
    }

    getOne(key, value) {
        return this.getAll().find(item => item[key] === value) || null;
    }

    getAll() {
        return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }

    create(idField, newItem) {
        const items = this.getAll();
        const maxId = items.reduce((max, item) => item[idField] > max ? item[idField] : max, 0);
        newItem[idField] = maxId + 1;
        newItem.created_at = new Date().toISOString();
        items.push(newItem);
        localStorage.setItem(this.storageKey, JSON.stringify(items));
        return newItem;
    }

    update(idField, updatedItem) {
        const items = this.getAll();
        const index = items.findIndex(item => item[idField] === updatedItem[idField]);
        if (index === -1) return null;
        updatedItem.modified_at = new Date().toISOString();
        items[index] = { ...items[index], ...updatedItem };
        localStorage.setItem(this.storageKey, JSON.stringify(items));
        return items[index];
    }

    delete(idField, idValue) {
        let items = this.getAll();
        items = items.filter(item => item[idField] !== idValue);
        localStorage.setItem(this.storageKey, JSON.stringify(items));
        return true;
    }
}

window.BaseAPI = BaseAPI;
