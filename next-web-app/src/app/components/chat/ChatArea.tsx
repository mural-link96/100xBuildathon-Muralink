// src/app/components/chat/ChatArea.tsx
'use client';

import React, { useState } from 'react';
import { MessageCircle, Sparkles, ArrowRight, Upload, Heart } from 'lucide-react';
import Button from '../common/Button';
import { FadeInUp, ScaleIn } from '../common/animations';
import MessageInput from './MessageInput';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'saumya';
  timestamp: Date;
  image?: string;
}

interface ChatAreaProps {
  currentChatId: string | null;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onStartNewChat: () => void;
  onStartChatFlow: () => void;
  isLoading?: boolean;
  className?: string;
}

const ChatView: React.FC<{ messages: ChatMessage[]; onSendMessage: (message: string) => void; isLoading: boolean; }> = ({ messages, onSendMessage, isLoading }) => {
  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <FadeInUp key={message.id} delay={index * 100}>
              <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    message.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-200'
                  }`}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Shared image"
                      className="w-full h-32 md:h-48 object-cover rounded-lg mb-2"
                    />
                  )}
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-indigo-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </FadeInUp>
          ))}
          
          {isLoading && (
            <FadeInUp>
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-200 px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </FadeInUp>
          )}
        </div>
      </div>

      {/* Message input */}
      <MessageInput onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
};

const ChatArea: React.FC<ChatAreaProps> = ({
  currentChatId,
  messages,
  onSendMessage,
  isLoading = false,
  className = ''
}) => {
  return (
    <div className={`flex-1 flex flex-col bg-gray-50 ${className}`}>
      <ChatView 
        messages={messages} 
        onSendMessage={onSendMessage} 
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatArea;