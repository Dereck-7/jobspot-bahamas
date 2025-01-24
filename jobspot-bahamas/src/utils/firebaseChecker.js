import { auth } from '../config/firebase';

export const checkFirebaseServices = async () => {
    try {
        // Check if auth is initialized
        if (!auth) {
            throw new Error('Firebase Auth is not initialized');
        }
        
        // Test authentication state
        const currentUser = auth.currentUser;
        console.log('Firebase Auth initialized successfully');
        return true;
    } catch (error) {
        console.error('Firebase service check failed:', error);
        return false;
    }
};
