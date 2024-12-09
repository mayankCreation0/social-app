import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { showToast } from '../utils/toast';
import { Loader } from '../components/common/Loader';
import { Plus } from 'lucide-react';
import CreatePostModal from '@/components/CreatePostModal';
import { useNavigate } from 'react-router-dom';
import PostActions from '@/components/common/ShareModal';

const FeedPage = () => {
    const navigate = useNavigate()
    const { user, posts, setPosts } = useApp();
    const [loading, setLoading] = useState(true);
    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, [user?.photoURL]); 

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const { posts: fetchedPosts } = await api.fetchPosts();

            const updatedPosts = fetchedPosts.map(post => {
                if (post.authorId === user?.uid) {
                    return {
                        ...post,
                        authorPhotoURL: user.photoURL,
                        authorName: user.displayName
                    };
                }
                return post;
            });

            setPosts(updatedPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            showToast.error('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    const updatePostsWithUserInfo = (userId, updatedInfo) => {
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.authorId === userId) {
                    return {
                        ...post,
                        ...updatedInfo
                    };
                }
                return post;
            })
        );
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

    const handleRedirect = () => {
        navigate('/profile')
    }
    const renderPost = (post) => (
        <article key={post.id} className="bg-[#F7EBFF] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <img
                        src={post.authorPhotoURL || '/placeholder-avatar.png'}
                        alt={post.authorName || 'Anonymous'}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-[Kumbh Sans] font-medium text-sm">
                                {post.authorName || 'Anonymous'}
                            </h3>
                            {post.authorId === user?.uid && (
                                <span className="text-xs text-gray-500">(You)</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">
                            {formatTimeAgo(post.createdAt)}
                        </p>
                    </div>
                </div>
            </div>

            <p className="text-sm text-gray-800 mt-7 mb-3 font-[Kumbh Sans]">
                {post.content}
            </p>

            {post.imageURLs?.length > 0 && (
                <div className={`grid ${post.imageURLs.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 rounded-xl overflow-hidden mb-3`}>
                    {post.imageURLs.map((url, index) => (
                        <div key={index} className="relative aspect-square">
                            <img
                                src={url}
                                alt={`Post ${index + 1}`}
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>
                    ))}
                </div>
            )}

            <PostActions
                post={post}
                user={user}
                onLikeToggle={(isLiked) => {
                    console.log(`Post ${post.id} ${isLiked ? 'liked' : 'unliked'}`);
                }}
            />
        </article>
    );
    return (
        <div className="min-h-screen bg-white">
            {/* Fixed Header */}
            <header className="fixed top-0 left-0 right-0 bg-white z-10">
                <div className="w-full max-w-md mx-auto px-4 pt-4 pb-3">
                    {/* User Info Row */}
                    <div className="flex items-center space-x-3 mb-4">
                        <img
                            src={user?.photoURL || '/placeholder-avatar.png'}
                            alt={user?.displayName || 'User'}
                            className="w-10 h-10 rounded-full object-cover cursor-pointer"
                            onClick={handleRedirect}
                        />
                        <div>
                            <span className="text-[10px] font-[Kumbh Sans] text-gray-500 leading-[12.4px]">
                                Welcome Back,
                            </span>
                            <h2 className="text-base font-[Kumbh Sans] font-semibold leading-[19.84px]">
                                {user?.displayName || 'User'}
                            </h2>
                        </div>
                    </div>
                    <h1 className="text-2xl mt-5 font-bold">Feeds</h1>
                </div>
            </header>

            <main className="w-full max-w-md mx-auto px-4 pt-32 pb-20">
                {loading ? (
                    <Loader />
                ) : posts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No posts yet. Be the first to share something!
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map(post => renderPost(post))}
                    </div>
                )}

                <button
                    onClick={handleCreatePost}
                    className="fixed bottom-6 right-6 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
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