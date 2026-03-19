// js/utils/storage.js
export const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('[Storage Error]', e);
            return false;
        }
    },
    get: (key, fallback = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : fallback;
        } catch (e) {
            return fallback;
        }
    },
    remove: (key) => localStorage.removeItem(key)
};
