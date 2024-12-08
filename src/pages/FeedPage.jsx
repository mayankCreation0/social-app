// src/pages/FeedPage.jsx
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { showToast } from '../utils/toast';
import { Loader } from '../components/common/Loader';
import { Plus } from 'lucide-react';
import CreatePostModal from '@/components/CreatePostModal';
import { useNavigate } from 'react-router-dom';

const FeedPage = () => {
    const navigate = useNavigate()
    const { user, posts, setPosts } = useApp();
    const [loading, setLoading] = useState(true);
    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

    useEffect(() => {
        console.log(user?.photoURL);
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const { posts: fetchedPosts } = await api.fetchPosts();
            setPosts(fetchedPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            showToast.error('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (timestamp) => {
        if (!timestamp?.toDate) return '';
        try {
            const seconds = Math.floor((new Date() - timestamp.toDate()) / 1000);
            let interval = seconds / 3600;
            if (interval > 24) {
                return Math.floor(interval / 24) + ' days ago';
            }
            if (interval >= 1) {
                return Math.floor(interval) + ' hours ago';
            }
            interval = seconds / 60;
            if (interval >= 1) {
                return Math.floor(interval) + ' mins ago';
            }
            return 'Just now';
        } catch (error) {
            console.log("Error: " + error)
            return '';
        }
    };

    const handleCreatePost = () => {
        setIsCreatePostModalOpen(true);
    };

    const handleRedirect = () =>{
        navigate('/profile')
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 bg-white px-4 pt-4 pb-3">
                <div className="w-full max-w-md mx-auto">
                    {/* User Info Row */}
                    <div className="flex items-center space-x-3 mb-4">
                        <img
                            src={user?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                            alt={user?.displayName || 'User'}
                            className="w-12 h-12 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                            onClick={handleRedirect}
                        />
                        <div>
                            <span className="text-[10px] font-[Kumbh Sans] text-gray-500 leading-[12.4px]">
                                Welcome Back,
                            </span>
                            <h2 className="text-lg font-[Kumbh Sans] font-semibold leading-[19.84px]">
                                {user?.displayName || 'User'}
                            </h2>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold mt-7">Feeds</h1>
                </div>
            </header>

            {/* Content */}
            <main className="w-full max-w-md mx-auto px-4 pb-20">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No posts yet. Be the first to share something!
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        {posts.map(post => (
                            <article key={post.id} className="bg-white rounded-2xl p-4 shadow-sm">
                                {/* Author Info */}
                                <div className="flex items-center space-x-3 mb-3">
                                    <img
                                        src={post.authorPhotoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                                        alt={post.authorName || 'Anonymous'}
                                        className="w-10 h-10 rounded-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                    <div>
                                        <h3 className="font-medium text-sm">
                                            {post.authorName || 'Anonymous'}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {formatTimeAgo(post.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <p className="text-sm text-gray-800 mb-3">{post.content}</p>

                                {/* Post Media */}
                                {post.imageURLs?.length > 0 && (
                                    <div className={`grid ${post.imageURLs.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                                        } gap-2 mb-3 rounded-xl overflow-hidden`}>
                                        {post.imageURLs.map((url, index) => (
                                            <div key={index} className="aspect-square relative">
                                                <img
                                                    src={url}
                                                    alt={`Post content ${index + 1}`}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Post Actions */}
                                <div className="flex items-center justify-between mt-2">
                                    <button className="flex items-center space-x-1 text-rose-500">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                        <span className="text-sm">{post.likes || 0}</span>
                                    </button>
                                    <button className="flex items-center space-x-1 text-gray-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                        <span className="text-sm">Share</span>
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Create Post Button */}
                <button
                    onClick={handleCreatePost}
                    className="fixed bottom-6 right-6 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
                    aria-label="Create new post"
                >
                    <Plus className="w-7 h-7" />
                </button>

                <CreatePostModal
                    isOpen={isCreatePostModalOpen}
                    onClose={() => setIsCreatePostModalOpen(false)}
                />
            </main>
        </div>
    );
};

export default FeedPage;