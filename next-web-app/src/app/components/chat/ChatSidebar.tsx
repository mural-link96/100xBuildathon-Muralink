// src/app/components/chat/ChatSidebar.tsx
'use client';

import React from 'react';
import { MessageCircle, Plus, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../common/Button';
import { SlideIn, FadeInUp } from '../common/animations';

// Local utility function
const formatTimestamp = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
};

interface ChatHistoryItem {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  roomType: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  chatHistory: ChatHistoryItem[];
  currentChatId: string | null;
  className?: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  isCollapsed,
  onToggleCollapse,
  onClose,
  onNewChat,
  onSelectChat,
  chatHistory,
  currentChatId,
  className = ''
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative top-0 left-0 h-full bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-xl z-50 lg:z-auto
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20 w-20' : 'lg:w-80 w-80'}
        ${className}
      `}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className={`border-b border-gray-200/50 flex items-center justify-between bg-white/50 backdrop-blur-sm p-4 min-h-[82px] flex-shrink-0`}>
            {!isCollapsed && (
              <h2 className="text-xl font-bold text-gray-900 flex items-center truncate">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mr-3 shadow-lg flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="truncate bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Conversations
                </span>
              </h2>
            )}
            <div className={`flex items-center space-x-2 ${isCollapsed ? 'justify-center w-full' : ''}`}>
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex p-3 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all duration-300 flex-shrink-0 hover:scale-105"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
              <button
                onClick={onClose}
                className="lg:hidden p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* New Chat Button */}
          <div className={`${isCollapsed ? 'p-3' : 'p-6'} border-b border-gray-100/50 flex-shrink-0`}>
            <Button
              onClick={onNewChat}
              variant="primary"
              className={`${isCollapsed ? 'w-full p-3 min-w-0' : 'w-full py-4'} flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 text-white rounded-2xl border-0`}
              title="Start New Design"
            >
              <Plus className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5'}`} />
              {!isCollapsed && <span className="ml-3 font-semibold">New Design</span>}
            </Button>
          </div>

          {/* Chat History List */}
          <div className={`flex-1 overflow-y-auto space-y-3 ${isCollapsed ? 'p-3' : 'p-6'} min-h-0`}>
            {chatHistory.length === 0 ? (
              <div className={`text-center py-12 ${isCollapsed ? 'hidden' : ''}`}>
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm font-medium">No designs yet</p>
                <p className="text-gray-400 text-xs mt-2">Start creating your dream space</p>
              </div>
            ) : (
              chatHistory.map((chat, index) => (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`
                    rounded-2xl cursor-pointer transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg
                    ${currentChatId === chat.id 
                      ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-md' 
                      : 'bg-white/70 border border-gray-200/80 hover:border-indigo-300 hover:bg-gradient-to-br hover:from-indigo-50/50 hover:to-purple-50/50'
                    }
                    ${isCollapsed ? 'p-3 flex justify-center' : 'p-4'}
                  `}
                  title={isCollapsed ? chat.title : ''}
                >
                  {isCollapsed ? (
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-5 h-5 text-indigo-600" />
                    </div>
                  ) : (
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-indigo-700 truncate transition-colors">
                        {chat.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-3 truncate leading-relaxed">
                        {chat.lastMessage}
                      </p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1.5 rounded-xl truncate max-w-[120px] font-medium">
                          {chat.roomType}
                        </span>
                        <span className="flex items-center text-gray-500 flex-shrink-0 ml-3">
                          <Clock className="w-3 h-3 mr-1.5" />
                          {formatTimestamp(chat.timestamp)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {!isCollapsed && (
            <div className="p-6 border-t border-gray-100/50 flex-shrink-0 bg-gradient-to-t from-gray-50/50 to-transparent">
              <div className="text-center">
                <p className="text-xs text-gray-500 font-medium">✨ AI-Powered Interior Design</p>
                <p className="text-xs text-gray-400 mt-1">Made with ❤️ by Muralink</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;