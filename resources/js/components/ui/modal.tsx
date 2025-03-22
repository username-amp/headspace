import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    // Handle escape key press
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent scrolling when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-all duration-300" 
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div 
                    className="relative w-full max-w-md transform rounded-3xl bg-[#1a1f2e] p-8 text-white shadow-2xl ring-1 ring-white/10 transition-all duration-300 animate-in fade-in zoom-in-95"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Content wrapper */}
                    <div className="space-y-6">
                        {/* Title - assuming first child is h2 */}
                        <div className="space-y-2">
                            <div className="modal-title text-2xl font-semibold tracking-tight text-white/90">
                                {React.Children.map(children, child => {
                                    if (React.isValidElement(child) && child.type === 'h2') {
                                        return child;
                                    }
                                })}
                            </div>
                        </div>

                        {/* Form content */}
                        <div className="space-y-4">
                            {React.Children.map(children, child => {
                                if (React.isValidElement(child) && child.type !== 'h2') {
                                    return child;
                                }
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Styles for form elements */}
            <style>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .animate-gradient {
                    animation: gradient 3s ease infinite;
                    background-size: 200% 200%;
                }

                .modal-title h2 {
                    font-size: 1.5rem;
                    line-height: 2rem;
                    font-weight: 600;
                    color: white;
                    margin: 0;
                }
                
                .${isOpen ? 'modal-content' : ''} label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #94a3b8;
                    font-size: 0.875rem;
                    font-weight: 500;
                }
                
                .${isOpen ? 'modal-content' : ''} select,
                .${isOpen ? 'modal-content' : ''} input,
                .${isOpen ? 'modal-content' : ''} textarea {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border-radius: 0.75rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    margin-bottom: 1rem;
                    transition: all 0.2s;
                    font-size: 0.925rem;
                }
                
                .${isOpen ? 'modal-content' : ''} select:focus,
                .${isOpen ? 'modal-content' : ''} input:focus,
                .${isOpen ? 'modal-content' : ''} textarea:focus {
                    outline: none;
                    border-color: rgba(139, 92, 246, 0.5);
                    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.25);
                    background: rgba(255, 255, 255, 0.07);
                }
                
                .${isOpen ? 'modal-content' : ''} button {
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: 0.75rem;
                    background: linear-gradient(to right, #701a75, #86198f);
                    color: white;
                    font-weight: 500;
                    transition: all 0.2s;
                    margin-top: 1rem;
                    position: relative;
                    overflow: hidden;
                }
                
                .${isOpen ? 'modal-content' : ''} button:before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 200%;
                    height: 100%;
                    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
                    transition: all 0.5s ease;
                }
                
                .${isOpen ? 'modal-content' : ''} button:hover {
                    opacity: 0.95;
                    transform: translateY(-1px);
                    box-shadow: 0 0 20px rgba(192, 38, 211, 0.4);
                }
                
                .${isOpen ? 'modal-content' : ''} button:hover:before {
                    left: 100%;
                }
                
                .${isOpen ? 'modal-content' : ''} button:active {
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};

export default Modal; 