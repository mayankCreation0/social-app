import React from 'react';
import { Github, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className=" bottom-0 left-0 right-0 bg-transparent py-2 text-sm">
            <div className="container mx-auto flex items-center justify-center gap-1 text-gray-600">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-rose-500 animate-pulse" fill="#f43f5e" />
                <span>by</span>
                <a
                    href="https://github.com/mayankCreation0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-800 hover:text-gray-600 transition-colors duration-200"
                >
                    <Github className="w-4 h-4" />
                    <span className="font-medium">mayankCreation0</span>
                </a>
            </div>
        </footer>
    );
};

export default Footer;