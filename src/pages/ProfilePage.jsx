/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
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
    const coverInputRef = useRef(null);
    const profileInputRef = useRef(null);
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

    useEffect(() => {
        const fetchUserPosts = async () => {
            if (user?.uid) {
                try {
                    const posts = await api.fetchUserPosts(user.uid);
                    setUserPosts(posts);
                } catch (error) {
                    console.error('Error fetching user posts:', error);
                    showToast.error('Failed to load posts');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserPosts();
    }, [user?.uid]);

    // Modify the fetchProfileData useEffect
    useEffect(() => {
        const fetchProfileData = async () => {
            if (user?.uid) {
                try {
                    const profileData = await api.fetchUserProfile(user.uid);
                    if (profileData) {
                        // Update editedData with profile data
                        setEditedData({
                            displayName: profileData.displayName || user.displayName || '',
                            bio: profileData.bio || "Just someone who loves designing, sketching, and finding beauty in the little things❤️",
                            photoURL: profileData.photoURL || user.photoURL || null,
                            coverPhotoURL: profileData.coverPhotoURL || null
                        });

                        // Update user context
                        setUser(prev => ({
                            ...prev,
                            ...profileData
                        }));
                    }
                } catch (error) {
                    console.error('Error fetching profile data:', error);
                    showToast.error('Failed to load profile data');
                }
            }
        };

        fetchProfileData();
    }, [user?.uid, setUser]);

    const handleImageUpload = async (file, type) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            const imageUrl = data.secure_url;

            if (type === 'cover') {
                setEditedData(prev => ({ ...prev, coverPhotoURL: imageUrl }));
                await api.updateUserProfile(user.uid, { coverPhotoURL: imageUrl });
            } else {
                setEditedData(prev => ({ ...prev, photoURL: imageUrl }));
                await updateProfile(auth.currentUser, { photoURL: imageUrl });
                await api.updateUserProfile(user.uid, { photoURL: imageUrl });
            }

            setUser(prev => ({
                ...prev,
                [type === 'cover' ? 'coverPhotoURL' : 'photoURL']: imageUrl
            }));

            showToast.success('Image uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            showToast.error('Failed to upload image');
        }
    };

    const handleImageChange = async (event, type) => {
        const file = event.target.files?.[0];
        if (file) {
            await handleImageUpload(file, type);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setLoading(true);

            if (editedData.displayName !== user?.displayName) {
                await updateProfile(auth.currentUser, {
                    displayName: editedData.displayName
                });
            }

            const profileUpdates = {
                displayName: editedData.displayName,
                bio: editedData.bio,
                updatedAt: serverTimestamp(),
                photoURL: editedData.photoURL || user?.photoURL,
                coverPhotoURL: editedData.coverPhotoURL || user?.coverPhotoURL
            };

            await api.updateUserProfile(user.uid, profileUpdates);

            setUser(prev => ({
                ...prev,
                ...profileUpdates
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
        <div className="min-h-screen bg-white w-[100vw]">
            <div className="relative">
                <div className="relative h-48 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
                    {editedData.coverPhotoURL && (
                        <img
                            src={editedData.coverPhotoURL}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    )}
                    {isEditing && (
                        <>
                            <input
                                ref={coverInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, 'cover')}
                                className="hidden"
                            />
                            <button
                                onClick={() => coverInputRef.current?.click()}
                                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white"
                            >
                                <Pencil className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 p-2 text-white bg-[#F5F5F5]"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="absolute -bottom-16 left-6 flex items-end">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden">
                            <img
                                src={editedData.photoURL || '/placeholder-avatar.png'}
                                alt={editedData.displayName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {isEditing && (
                            <>
                                <input
                                    ref={profileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, 'profile')}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => profileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 p-2 bg-black/50 rounded-full text-white"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            </>
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
                <div className="flex flex-col gap-4 max-w-md mx-auto">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600 font-medium">Name</label>
                                <input
                                    type="text"
                                    value={editedData.displayName}
                                    onChange={(e) => setEditedData(prev => ({ ...prev, displayName: e.target.value }))}
                                    className="w-full p-2 border-b border-gray-200 focus:border-gray-400 outline-none bg-transparent text-xl font-medium"
                                    placeholder="Your name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-600 font-medium">Bio</label>
                                <textarea
                                    value={editedData.bio}
                                    onChange={(e) => setEditedData(prev => ({ ...prev, bio: e.target.value }))}
                                    className="w-full p-2 border-b border-gray-200 focus:border-gray-400 outline-none bg-transparent text-sm resize-none"
                                    rows={3}
                                    placeholder="Tell us about yourself"
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-xl font-bold">{editedData.displayName}</h1>
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