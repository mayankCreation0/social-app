/* eslint-disable react-hooks/rules-of-hooks */
// src/pages/CreatePost.jsx
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { showToast } from '@/utils/toast';

const CreatePost = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get images from router state
    const selectedImages = location.state?.selectedImages || [];

    // Redirect if no images
    if (selectedImages.length === 0) {
        navigate('/feed');
        return null;
    }

    const [caption, setCaption] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            // Ensure we have valid image data
            const validImages = selectedImages.filter(img => img && (img.file || img.url));

            if (validImages.length === 0) {
                showToast.error('Please select at least one valid image');
                return;
            }

            const postData = {
                content: caption.trim(),
            };

            await api.createPost(postData, validImages);
            showToast.success('Post created successfully!');
            navigate('/feed');
        } catch (error) {
            console.error('Error creating post:', error);
            showToast.error(error.message || 'Failed to create post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-start gap-5 px-4 py-3 border-b border-gray-100">
                <button onClick={handleBack} className="p-1 bg-transparent">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-extrabold">New post</h1>
                <div className="w-6" />
            </header>

            {/* Content */}
            <div className="flex-1">
                {/* Image Preview Container */}
                <div className="p-4 relative">
                    {/* Preview Card with exact dimensions */}
                    <div className="relative w-[280px] h-[285px] mx-auto rounded-xl bg-black">
                        <img
                            src={selectedImages[currentImageIndex].url}
                            alt="Post preview"
                            className="w-full h-full object-cover rounded-xl"
                        />

                        {selectedImages.length > 1 && (
                            <>
                                {/* Invisible click areas for navigation */}
                                <button
                                    onClick={() => setCurrentImageIndex(i => Math.max(0, i - 1))}
                                    className="absolute inset-y-0 left-0 w-1/3 bg-transparent cursor-pointer focus:outline-none"
                                    disabled={currentImageIndex === 0}
                                />
                                <button
                                    onClick={() => setCurrentImageIndex(i => Math.min(selectedImages.length - 1, i + 1))}
                                    className="absolute inset-y-0 right-0 w-1/3 bg-transparent cursor-pointer focus:outline-none"
                                    disabled={currentImageIndex === selectedImages.length - 1}
                                />

                                {/* Small Image Counter */}
                                <div className="absolute top-2 right-2 bg-black/50 px-2 py-0.5 rounded-full text-white text-[10px] font-medium">
                                    {currentImageIndex + 1}/{selectedImages.length}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Dot indicators outside preview card */}
                    {selectedImages.length > 1 && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center justify-center gap-[6px]">
                            {selectedImages.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-[4px] h-[4px] rounded-full transition-all cursor-pointer ${idx === currentImageIndex
                                            ? 'bg-black'
                                            : 'bg-gray-300'
                                        }`}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    role="button"
                                    tabIndex={0}
                                />
                            ))}
                        </div>
                    )}
                    
                </div>

                {/* Caption Input */}
                <div className="px-4 pt-4">
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Write a caption..."
                        className="w-full min-h-[100px] bg-gray-100 font-[Kumbh Sans] text-base resize-none rounded-xl p-4 focus:ring-0 focus:outline-none"
                    />
                </div>
            </div>

            {/* Create Button */}
            <div className="p-4">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !caption.trim()}
                    className="w-full bg-black text-white py-3 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Creating...' : 'CREATE'}
                </button>
            </div>
        </div>
    );
};

export default CreatePost;