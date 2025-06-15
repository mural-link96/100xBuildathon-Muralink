// src/app/components/chat/ChatTopbar.tsx
'use client';

import React, { useState } from 'react';
import { Menu, User, CreditCard, Settings, Bell, Home, ChevronDown, LogOut } from 'lucide-react';
import Image from 'next/image';

interface ChatTopbarProps {
  onToggleSidebar: () => void;
  userCredits?: number;
  userName?: string;
  userAvatar?: string;
  onNavigateHome?: () => void;
}

const ChatTopbar: React.FC<ChatTopbarProps> = ({
  onToggleSidebar,
  userCredits = 150,
  userName = "John Doe",
  userAvatar,
  onNavigateHome
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="max-h-[82px] bg-white/95 backdrop-blur-xl border-b border-gray-200/50 p-4 lg:px-6 flex items-center justify-between relative z-30">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        {/* Sidebar toggle - only visible on mobile */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-3 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all duration-300 hover:scale-105"
          title="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Muralink
            </span>
            <p className="text-xs text-gray-500 -mt-1">AI Interior Design</p>
          </div>
        </div>

        {/* Home button */}
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className="hidden md:flex items-center space-x-2 px-4 py-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all duration-300 hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </button>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Credits */}
        <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 px-4 py-2.5 rounded-2xl shadow-sm">
          <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <CreditCard className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-yellow-700">{userCredits}</span>
          <span className="text-xs text-yellow-600">credits</span>
        </div>

        {/* Notifications */}
        <button className="relative p-3 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all duration-300 hover:scale-105">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-red-400 to-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-2xl transition-all duration-300 hover:scale-105"
          >
            {userAvatar ? (
              <Image
                src={userAvatar}
                alt={userName}
                width={40}
                height={40}
                className="w-10 h-10 rounded-2xl object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">Premium Plan</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
          </button>

          {/* Dropdown menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200/50 py-2 animate-fadeIn backdrop-blur-xl">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">Premium Plan • {userCredits} credits</p>
              </div>
              
              <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center space-x-3 transition-colors">
                <User className="w-4 h-4" />
                <span>Profile Settings</span>
              </button>
              
              <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center space-x-3 transition-colors">
                <CreditCard className="w-4 h-4" />
                <span>Billing & Credits</span>
              </button>
              
              <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center space-x-3 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Preferences</span>
              </button>
              
              <div className="border-t border-gray-100 mt-2 pt-2">
                <button className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default ChatTopbar;