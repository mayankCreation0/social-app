// src/utils/toast.js
import toast from 'react-hot-toast';

export const showToast = {
    success: (message) => {
        toast.success(message, {
            duration: 3000,
            position: 'top-center',
            style: {
                background: '#10B981',
                color: '#fff',
            },
        });
    },
    error: (message) => {
        toast.error(message, {
            duration: 4000,
            position: 'top-center',
            style: {
                background: '#EF4444',
                color: '#fff',
            },
        });
    },
    loading: (message) => {
        return toast.loading(message, {
            position: 'top-center',
        });
    },
};