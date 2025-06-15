// src/app/components/chat/MessageInput.tsx
'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Send, Paperclip, Mic, Image as ImageIcon } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string, attachment?: File) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message...",
  className = ''
}) => {
  const [message, setMessage] = useState<string>('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if ((message.trim() || attachment) && !disabled) {
      onSendMessage(message.trim(), attachment || undefined);
      setMessage('');
      setAttachment(null);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setAttachment(file);
    }
  };

  const removeAttachment = (): void => {
    setAttachment(null);
  };

  return (
    <div className={`bg-white border-t border-gray-200 p-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Attachment preview */}
        {attachment && (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 truncate">{attachment.name}</span>
            </div>
            <button
              onClick={removeAttachment}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          <div className="flex-1">
            <div
              className={`
                relative border rounded-2xl transition-all duration-200
                ${isDragOver ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300'}
                ${disabled ? 'opacity-50' : 'hover:border-indigo-400 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200'}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <textarea
                value={message}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                placeholder={isDragOver ? "Drop image here..." : placeholder}
                disabled={disabled}
                rows={1}
                className="w-full px-4 py-3 pr-12 border-none outline-none resize-none rounded-2xl bg-transparent"
                style={{
                  minHeight: '48px',
                  maxHeight: '120px'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }
                }}
              />
              
              {/* Attachment button */}
              <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                <label className="p-2 text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors rounded-full hover:bg-indigo-50">
                  <Paperclip className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={disabled}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={disabled || (!message.trim() && !attachment)}
            className={`
              p-3 rounded-full transition-all duration-200 transform
              ${(message.trim() || attachment) && !disabled
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-110 active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Quick actions */}
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Press Enter to send, Shift+Enter for new line</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>✨ AI-powered design assistant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;