import React, { useEffect, useState } from 'react';
import { X, Copy, Heart, Share } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import toast from 'react-hot-toast';
import { api } from '@/services/api';

// ShareModal Component
const ShareModal = ({ isOpen, onClose, postLink }) => {

    const socialPlatforms = [
        { name: 'Twitter', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/twitter.svg', color: 'bg-blue-400', url: `https://twitter.com/intent/tweet?url=${postLink}` },
        { name: 'Facebook', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/facebook.svg', color: 'bg-blue-600', url: `https://www.facebook.com/sharer/sharer.php?u=${postLink}` },
        { name: 'Reddit', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/reddit.svg', color: 'bg-orange-500', url: `https://www.reddit.com/submit?url=${postLink}` },
        { name: 'Discord', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/discord.svg', color: 'bg-indigo-600', url: `https://discordapp.com/channels/@me/${postLink}` },
        { name: 'WhatsApp', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/whatsapp.svg', color: 'bg-green-500', url: `https://api.whatsapp.com/send?text=${postLink}` },
        { name: 'Messenger', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/messenger.svg', color: 'bg-blue-500', url: `https://www.messenger.com/t/${postLink}` },
        { name: 'Telegram', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/telegram.svg', color: 'bg-sky-500', url: `https://t.me/share/url?url=${postLink}` },
        { name: 'Instagram', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/instagram.svg', color: 'bg-pink-500', url: `https://www.instagram.com/?url=${postLink}` },
    ];

    const handleShare = (url) => {
        window.open(url, '_blank');
        onClose();
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(postLink);
            toast.success("Link copied to clipboard!")
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };
    


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[90%] rounded-lg">
                <DialogHeader>
                    <DialogTitle className="justify-start flex text-2xl font-bold">Share post</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-4 gap-4 py-4">
                    {socialPlatforms.map((platform) => (
                        <button
                            key={platform.name}
                            onClick={() => handleShare(platform.url)}
                            className="flex flex-col items-center gap-1 bg-transparent"
                        >
                            <div className={`w-12 h-12 rounded-full  bg-[#E9F6FB] flex items-center justify-center`}>
                                <img
                                    src={platform.icon}
                                    alt={platform.name}
                                    className="w-6 h-6"
                                    style={{ fill: platform.color }}
                                />
                            </div>
                            <span className="text-xs">{platform.name}</span>
                        </button>
                    ))}
                </div>
                <div className="relative mt-4">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={postLink}
                            readOnly
                            className="flex-1 p-2 border rounded-md text-sm bg-[#D9D9D9]"
                        />
                        <button
                            onClick={handleCopyLink}
                            className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// PostActions Component
const PostActions = ({ post, user }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes || 0);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    useEffect(() => {
        const checkLikeStatus = async () => {
            if (user?.uid && post?.id) {
                try {
                    const isLiked = await api.checkIfUserLikedPost(post.id, user.uid);
                    setLiked(isLiked);
                } catch (error) {
                    toast.error(error.message);
                    console.error('Error checking like status:', error);                }
            }
        };
        checkLikeStatus();
    }, [post?.id, user?.uid]);

    const handleLikeClick = async () => {
        if (!user) {
            toast.error('Please sign in to like posts');
            return;
        }

        try {
            // Optimistic update
            const newLikedState = !liked;
            setLiked(newLikedState);
            setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);

            // Update in database
            await api.toggleLike(post.id, user.uid);
        } catch (error) {
            // Revert optimistic update on error
            setLiked(!liked);
            setLikeCount(prev => liked ? prev - 1 : prev + 1);
            toast.error('Failed to update like. Please try again.');
        }
    };

    return (
        <>
            <div className="flex items-center justify-between pt-2">
                <button
                    onClick={handleLikeClick}
                    className="flex items-center gap-1 bg-transparent"
                >
                    <Heart
                        className={`w-6 h-6 ${liked ? 'fill-rose-500 text-rose-500' : 'text-gray-500'}`}
                    />
                    <span className="text-sm">{likeCount}</span>
                </button>
                <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="flex items-center gap-1 bg-[#dfdbe2] rounded-full px-3 py-2"
                >
                    <Share className="w-5 h-5" />
                    <span>Share</span>
                </button>
            </div>

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                postLink={`${import.meta.env.VITE_WEB_PROD_URL}feed/${post.id}`}
            />
        </>
    );
};

export default PostActions;