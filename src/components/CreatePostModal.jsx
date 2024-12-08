/* eslint-disable react/prop-types */
// src/components/CreatePostModal.jsx
import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, CameraIcon } from 'lucide-react';
import { useDeviceImages } from '../hooks/useDeviceImages';

const CreatePostModal = ({ isOpen, onClose }) => {
    const { images: mockImages } = useDeviceImages();
    const [deviceImages, setDeviceImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedTab, setSelectedTab] = useState('gallery');
    const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

    useEffect(() => {
        if (isOpen) {
            openDeviceGallery();
        }
        return () => {
            handleReset();
        };
    }, [isOpen]);

    const handleReset = () => {
        setDeviceImages([]);
        setSelectedImages([]);
        setSelectedTab('gallery');
        setCurrentPreviewIndex(0);
    };

    const openNativeCamera = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.click();
        input.onchange = (e) => {
            if (e.target.files?.length > 0) {
                const file = e.target.files[0];
                const newImage = {
                    id: Math.random().toString(36).substr(2, 9),
                    url: URL.createObjectURL(file),
                    file: file
                };
                setSelectedImages([newImage]);
                setCurrentPreviewIndex(0);
            }
        };
    };

    const openDeviceGallery = () => {
        setSelectedTab('gallery');
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'image/*';

        input.onchange = (e) => {
            if (e.target.files?.length > 0) {
                const files = Array.from(e.target.files).map(file => ({
                    id: Math.random().toString(36).substr(2, 9),
                    url: URL.createObjectURL(file),
                    file: file
                }));
                setDeviceImages(prev => [...files, ...prev]);
            }
        };

        input.click();
    };

    const handleImageSelect = (image) => {
        setSelectedImages(prev => {
            const isSelected = prev.some(img => img.id === image.id);
            if (isSelected) {
                const filtered = prev.filter(img => img.id !== image.id);
                if (currentPreviewIndex >= filtered.length) {
                    setCurrentPreviewIndex(Math.max(0, filtered.length - 1));
                }
                return filtered;
            } else {
                const newSelection = [...prev, image];
                if (prev.length === 0) {
                    setCurrentPreviewIndex(0);
                }
                return newSelection;
            }
        });
    };

    const nextPreview = () => {
        if (currentPreviewIndex < selectedImages.length - 1) {
            setCurrentPreviewIndex(prev => prev + 1);
        }
    };

    const prevPreview = () => {
        if (currentPreviewIndex > 0) {
            setCurrentPreviewIndex(prev => prev - 1);
        }
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const handleNext = () => {
        if (selectedImages.length > 0) {
            console.log('Selected images:', selectedImages);
            handleClose();
        }
    };

    const displayImages = [...deviceImages, ...mockImages];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white z-50">
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent">
                <button onClick={handleClose} className="text-white p-1 bg-transparent">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={handleNext}
                    className={`text-white font-medium bg-transparent ${selectedImages.length === 0 ? 'opacity-50' : ''
                        }`}
                    disabled={selectedImages.length === 0}
                >
                    Next
                </button>
            </div>

            {/* Content */}
            <div className="h-screen flex flex-col">
                {/* Preview Slider */}
                <div className="relative flex-1 bg-black max-h-[450px]">
                    {selectedImages.length > 0 ? (
                        <>
                            <img
                                src={selectedImages[currentPreviewIndex].url}
                                alt="Preview"
                                className="w-full h-full object-contain"
                            />
                            {selectedImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevPreview}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 text-white p-2 bg-black/50 rounded-full disabled:opacity-50"
                                        disabled={currentPreviewIndex === 0}
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={nextPreview}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-2 bg-black/50 rounded-full disabled:opacity-50"
                                        disabled={currentPreviewIndex === selectedImages.length - 1}
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                                        {selectedImages.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentPreviewIndex(index)}
                                                className={`w-2 h-2 rounded-full transition-colors ${index === currentPreviewIndex
                                                        ? 'bg-white'
                                                        : 'bg-white/50'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/50">
                            Select images to preview
                        </div>
                    )}
                </div>

                {/* Bottom Section */}
                <div className="bg-white">
                    {/* Gallery Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                        <span className="text-black font-medium">Gallery</span>
                        <div className="flex items-center bg-gray-100 rounded-full">
                            <button
                                onClick={() => setSelectedTab('gallery')}
                                className={`p-2 rounded-full transition-colors ${selectedTab === 'gallery'
                                        ? 'bg-black text-white'
                                        : 'text-gray-500 bg-transparent'
                                    }`}
                            >
                                <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M3.2 3.2C2.77565 3.2 2.36869 3.36857 2.06863 3.66863C1.76857 3.96869 1.6 4.37565 1.6 4.8V8C1.6 8.42435 1.76857 8.83131 2.06863 9.13137C2.36869 9.43143 2.77565 9.6 3.2 9.6V4.8H11.2C11.2 4.37565 11.0314 3.96869 10.7314 3.66863C10.4313 3.36857 10.0243 3.2 9.6 3.2H3.2ZM4.8 8C4.8 7.57565 4.96857 7.16869 5.26863 6.86863C5.56869 6.56857 5.97565 6.4 6.4 6.4H12.8C13.2243 6.4 13.6313 6.56857 13.9314 6.86863C14.2314 7.16869 14.4 7.57565 14.4 8V11.2C14.4 11.6243 14.2314 12.0313 13.9314 12.3314C13.6313 12.6314 13.2243 12.8 12.8 12.8H6.4C5.97565 12.8 5.56869 12.6314 5.26863 12.3314C4.96857 12.0313 4.8 11.6243 4.8 11.2V8Z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedTab('camera');
                                    openNativeCamera();
                                }}
                                className={`p-2 rounded-full transition-colors ${selectedTab === 'camera'
                                        ? 'bg-black text-white'
                                    : 'text-black bg-transparent'
                                    }`}
                                disabled={selectedImages.length > 1}
                            >
                                <CameraIcon className='w-6 h-6'/>
                            </button>
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    <div className="min-h-[430px] overflow-y-auto bg-black">
                        <div className="grid grid-cols-3 gap-0.5 p-0.5">
                            {displayImages.map((image) => (
                                <div
                                    key={image.id}
                                    className="aspect-square relative cursor-pointer"
                                    onClick={() => handleImageSelect(image)}
                                >
                                    <img
                                        src={image.url}
                                        alt={`Gallery image`}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    {selectedImages.some(img => img.id === image.id) && (
                                        <div className="absolute inset-0 bg-black/20">
                                            <div className="absolute top-2 right-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-medium text-black">
                                                {selectedImages.findIndex(img => img.id === image.id) + 1}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;