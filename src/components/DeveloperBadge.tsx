import { useState } from 'react';
import { Globe, Mail, Linkedin, Instagram, Facebook, Twitter, Github } from 'lucide-react';
import avatarImage from '/vishmay.jpg?url';

const DeveloperBadge = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    // Developer details - replace with actual information
    const developerInfo = {
        name: 'Vishmay Karbotkar',
        title: 'Full Stack Developer | DevOps',
        links: {
            website: 'https://vishcodes.com',
            email: 'vishcode@gmail.com',
            github: 'https://github.com/vishmaycode',
            linkedin: 'https://in.linkedin.com/in/vishmay',
            instagram: 'https://www.instagram.com/__vishmay__',
            facebook: 'https://www.facebook.com/vishmay.karbotkar',
            twitter: 'https://x.com/VishmayK7',
        },
    };

    return (
        <>
            {/* Badge */}
            <div className="fixed top-[70px] -right-1 z-50">
                <button
                    className="border-b border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800 transition-colors duration-300 dark:text-white text-gray-800 font-bold py-2 px-4 rounded shadow-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={togglePopup}
                    type="button"
                    aria-label="Show Developer Info"    
                >
                    &lt;/&gt;
                </button>
            </div>

            {/* Modal */}
            {isPopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fade-in">
                        {/* Close Button */}
                        <button
                            type="button"
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold"
                            onClick={togglePopup}
                            aria-label="Close"
                        >
                            ×
                        </button>

                        {/* Developer Info */}
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-3">This website is developed and maintained by</h3>
                            <div className="mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800" style={{ width: '8rem', height: '8rem' }}>
                                <img
                                    src={avatarImage}
                                    alt="Developer Avatar"
                                    className="rounded-full object-cover"
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </div>
                            <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-1">{developerInfo.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{developerInfo.title}</p>

                            {/* Social Links */}
                            <div className="grid grid-cols-3 gap-3 mt-4">
                                <a
                                    href={developerInfo.links.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center p-3 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                                >
                                    <Globe size={24} className="text-blue-700 dark:text-blue-300 mb-1" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Website</span>
                                </a>
                                <a
                                    href={developerInfo.links.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center p-3 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                                >
                                    <Github size={24} className="text-blue-700 dark:text-blue-300 mb-1" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">GitHub</span>
                                </a>
                                <a
                                    href={`mailto:${developerInfo.links.email}`}
                                    className="flex flex-col items-center p-3 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                                >
                                    <Mail size={24} className="text-blue-700 dark:text-blue-300 mb-1" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Email</span>
                                </a>
                                <a
                                    href={developerInfo.links.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center p-3 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                                >
                                    <Linkedin size={24} className="text-blue-700 dark:text-blue-300 mb-1" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">LinkedIn</span>
                                </a>
                                <a
                                    href={developerInfo.links.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center p-3 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                                >
                                    <Instagram size={24} className="text-blue-700 dark:text-blue-300 mb-1" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Instagram</span>
                                </a>
                                <a
                                    href={developerInfo.links.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center p-3 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                                >
                                    <Facebook size={24} className="text-blue-700 dark:text-blue-300 mb-1" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Facebook</span>
                                </a>
                                <a
                                    href={developerInfo.links.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center p-3 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                                >
                                    <Twitter size={24} className="text-blue-700 dark:text-blue-300 mb-1" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Twitter</span>
                                </a>
                            </div>

                            <div className="mt-4">
                                <p className="text-blue-700 dark:text-blue-300 text-sm">Thank you for visiting!</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeveloperBadge;
