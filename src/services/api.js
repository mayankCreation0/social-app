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
    serverTimestamp,
    where,
    getDoc,
    setDoc
} from 'firebase/firestore';
import { auth, firestore } from '../config/firebaseConfig';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

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

            // Upload images to Cloudinary
            const imageURLs = await Promise.all(
                imageFiles.map(async (imageData) => {
                    // Create FormData
                    const formData = new FormData();

                    // If we have a file object directly
                    if (imageData.file instanceof File) {
                        formData.append('file', imageData.file);
                    }
                    // If we have a URL, send the URL directly
                    else if (imageData.url) {
                        formData.append('file', imageData.url);
                    }

                    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

                    try {
                        const response = await fetch(
                            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                            {
                                method: 'POST',
                                body: formData,
                            }
                        );

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.error?.message || 'Upload failed');
                        }

                        const data = await response.json();
                        return data.secure_url;
                    } catch (uploadError) {
                        console.error('Image upload error:', uploadError);
                        throw uploadError;
                    }
                })
            );

            // Filter out any undefined URLs
            const validImageURLs = imageURLs.filter(url => url);

            // Create post document
            const post = {
                content: postData.content || '',
                imageURLs: validImageURLs,
                authorId: currentUser.uid,
                authorName: currentUser.displayName || 'Anonymous',
                authorPhotoURL: currentUser.photoURL || null,
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

    async fetchUserPosts(userId) {
        try {
            const postsRef = collection(firestore, 'posts');
            const q = query(
                postsRef,
                where('authorId', '==', userId),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching user posts:', error);
            throw error;
        }
    },

    // In api.js
    async updateUserProfile(userId, profileData) {
        try {
            const userRef = doc(firestore, 'users', userId);

            // Remove any undefined values
            const cleanData = Object.fromEntries(
                Object.entries(profileData).filter(([_, value]) => value !== undefined)
            );

            // First check if document exists
            const docSnap = await getDoc(userRef);

            if (!docSnap.exists()) {
                // If document doesn't exist, create it
                await setDoc(userRef, cleanData);
            } else {
                // If it exists, update it
                await updateDoc(userRef, cleanData);
            }

            return true;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }
};