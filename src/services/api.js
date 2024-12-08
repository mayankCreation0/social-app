// src/services/api.js
import {
    collection,
    query,
    orderBy,
    limit,
    startAfter,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, firestore, storage } from '../config/firebaseConfig';

export const api = {
    // Posts
    async fetchPosts(lastDoc = null, pageSize = 20) {
        try {
            const postsRef = collection(firestore, 'posts');
            let q = query(
                postsRef,
                orderBy('createdAt', 'desc'),
                limit(pageSize)
            );

            if (lastDoc) {
                q = query(q, startAfter(lastDoc));
            }

            const snapshot = await getDocs(q);
            const lastVisible = snapshot.docs[snapshot.docs.length - 1];

            const posts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return { posts, lastVisible };
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    },

    async createPost(postData, imageFiles = []) {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error('User must be logged in to create a post');

            // Upload images if any
            const imageURLs = await Promise.all(
                imageFiles.map(async (file) => {
                    const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
                    const snapshot = await uploadBytes(storageRef, file);
                    return getDownloadURL(snapshot.ref);
                })
            );

            // Create post document with author information
            const post = {
                ...postData,
                imageURLs,
                authorId: currentUser.uid,
                authorName: currentUser.displayName,
                authorPhotoURL: currentUser.photoURL,
                createdAt: serverTimestamp(),
                likes: 0,
            };

            const docRef = await addDoc(collection(firestore, 'posts'), post);
            return { id: docRef.id, ...post };
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    },

    // User Profile
    async updateProfile(userId, profileData) {
        try {
            const userRef = doc(firestore, 'users', userId);
            await updateDoc(userRef, {
                ...profileData,
                updatedAt: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    // Comments
    async addComment(postId, commentData) {
        try {
            const commentsRef = collection(firestore, `posts/${postId}/comments`);
            const comment = {
                ...commentData,
                createdAt: serverTimestamp()
            };
            const docRef = await addDoc(commentsRef, comment);
            return { id: docRef.id, ...comment };
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    },
};