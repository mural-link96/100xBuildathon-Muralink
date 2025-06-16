// src/app/components/common/Modal.tsx
import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  maxWidth = 'max-w-lg',
  title 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className={`bg-white rounded-3xl p-6 md:p-8 ${maxWidth} w-full relative animate-slideInUp`}>
        <button
          onClick={onClose}
          className="absolute top-4 md:top-6 right-4 md:right-6 text-gray-400 hover:text-gray-600 transition-colors hover:rotate-90 transform duration-300"
        >
          <X className="w-6 h-6" />
        </button>
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-indigo-600 pr-8">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;