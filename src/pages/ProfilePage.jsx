/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Plus, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import CreatePostModal from '@/components/CreatePostModal';
import { showToast } from '@/utils/toast';
import { updateProfile } from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';
import { auth } from '@/config/firebaseConfig';

const ProfilePage = () => {
    const { user, setUser } = useApp();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({
        displayName: user?.displayName || '',
        bio: user?.bio || "Just someone who loves designing, sketching, and finding beauty in the little things❤️",
        photoURL: user?.photoURL || null,
        coverPhotoURL: user?.coverPhotoURL || null
    });
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

    const handleCreatePost = () => {
        setIsCreatePostModalOpen(true);
    };

    // Fetch user's posts
    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const posts = await api.fetchUserPosts(user.uid);
                setUserPosts(posts);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.uid) {
            fetchUserPosts();
        }
    }, [user?.uid]);

    const handleSaveProfile = async () => {
        try {
            setLoading(true);

            if (editedData.displayName !== user?.displayName) {
                await updateProfile(auth.currentUser, {
                    displayName: editedData.displayName
                });
            }

            const profileUpdates = {
                displayName: editedData.displayName || user?.displayName,
                bio: editedData.bio,
                updatedAt: serverTimestamp()
            };

            if (editedData.photoURL) {
                profileUpdates.photoURL = editedData.photoURL;
            }

            if (editedData.coverPhotoURL) {
                profileUpdates.coverPhotoURL = editedData.coverPhotoURL;
            }

            const cleanUpdates = Object.fromEntries(
                Object.entries(profileUpdates).filter(([_, value]) => value !== undefined)
            );

            await api.updateUserProfile(user.uid, cleanUpdates);

            setUser(prev => ({
                ...prev,
                ...cleanUpdates
            }));

            showToast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            showToast.error('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="relative">
                <div className="relative h-48 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
                    {user?.coverPhotoURL && (
                        <img
                            src={user.coverPhotoURL}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    )}
                    {isEditing && (
                        <button className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white">
                            <Pencil className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 p-2 text-white bg-transparent"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="absolute -bottom-16 left-6 flex items-end">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden">
                            <img
                                src={user?.photoURL || '/placeholder-avatar.png'}
                                alt={user?.displayName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {isEditing && (
                            <button className="absolute bottom-0 right-0 p-2 bg-black/50 rounded-full text-white">
                                <Pencil className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="ml-6 w-[208px] h-[32px] px-4 py-1.5 border border-gray-300 rounded-full text-sm bg-white"
                    >
                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </button>
                </div>
            </div>

            <div className="mt-20 px-6">
                <div className="flex flex-col gap-2">
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                value={editedData.displayName}
                                onChange={(e) => setEditedData(prev => ({ ...prev, displayName: e.target.value }))}
                                className="text-xl font-bold bg-gray-100 rounded p-2"
                            />
                            <textarea
                                value={editedData.bio}
                                onChange={(e) => setEditedData(prev => ({ ...prev, bio: e.target.value }))}
                                className="text-gray-600 text-sm bg-gray-100 rounded p-2 resize-none"
                                rows={3}
                            />
                        </>
                    ) : (
                        <>
                            <h1 className="text-xl font-bold">{user?.displayName}</h1>
                            <p className="text-gray-600 text-sm">
                                {editedData.bio}
                            </p>
                        </>
                    )}
                </div>
            </div>

            {isEditing && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 w-full max-w-[328px]">
                    <button
                        onClick={handleSaveProfile}
                        className="w-full h-[48px] bg-black text-white rounded-[36px] font-medium"
                    >
                        Save
                    </button>
                </div>
            )}

            {!isEditing && (
                <div className="px-6 mt-6">
                    <h2 className="text-lg font-medium mb-4">My Posts</h2>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {userPosts.map(post => (
                                <div
                                    key={post.id}
                                    className="relative aspect-square rounded-xl overflow-hidden bg-gray-100"
                                >
                                    {post.imageURLs?.[0] && (
                                        <img
                                            src={post.imageURLs[0]}
                                            alt={post.content}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    {/* Preview Info */}
                                    <div className="absolute inset-0 bg-black/30 flex items-end">
                                        <div className="p-3 text-white">
                                            <h3 className="font-medium">{post.title || 'Untitled'}</h3>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span>❤️</span>
                                                <span className="text-sm">{post.likes || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {!isEditing && (
                <button
                    onClick={handleCreatePost}
                    className="fixed bottom-6 right-6 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
                    aria-label="Create new post"
                >
                    <Plus className="w-6 h-6" />
                </button>
            )}
            <CreatePostModal
                isOpen={isCreatePostModalOpen}
                onClose={() => setIsCreatePostModalOpen(false)}
            />
        </div>
    );
};

export default ProfilePage;