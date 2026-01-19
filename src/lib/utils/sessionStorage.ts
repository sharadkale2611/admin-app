import type { Storage } from 'redux-persist';

const sessionStorageEngine: Storage = {
    getItem: (key) => {
        if (typeof window === 'undefined') return Promise.resolve(null);
        return Promise.resolve(sessionStorage.getItem(key));
    },
    setItem: (key, value) => {
        if (typeof window === 'undefined') return Promise.resolve();
        sessionStorage.setItem(key, value);
        return Promise.resolve();
    },
    removeItem: (key) => {
        if (typeof window === 'undefined') return Promise.resolve();
        sessionStorage.removeItem(key);
        return Promise.resolve();
    },
};

export default sessionStorageEngine;
