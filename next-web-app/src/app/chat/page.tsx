'use client'

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toBase64 from '@/app/utils/imageProcessor';
import { clearChatContext } from '@/app/utils/contextStorage';
import { fastApiService } from '../services/fastApiService';

interface Message {
    id: number;
    type: 'user' | 'assistant';
    content: string;
    isGenerating?: boolean;
    responseType?: 'image' | 'text';
    originalPrompt?: string;
    imageData?: string; // base64 image data
}

const DesignAgentChat = () => {
    const [prompt, setPrompt] = useState('');
    const [price, setPrice] = useState(50); // Price slider value
    const [location, setLocation] = useState('');
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            type: 'assistant',
            content: "Hi! I'm Tracy, your AI design companion. I can help you create amazing visuals just by describing what you have in mind. What would you like to design today?"
        }
    ]);
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Function to clear all chat context
    const handleClearAllChats = () => {
        // Clear UI messages (reset to initial welcome message)
        setMessages([
            {
                id: 1,
                type: 'assistant',
                content: "Hi! I'm Tracy, your AI design companion. I can help you create amazing visuals just by describing what you have in mind. What would you like to design today?"
            }
        ]);

        // Clear localStorage/context using the imported function
        clearChatContext();

        // Reset other form states
        setPrompt('');
        setUploadedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Placeholder function for handling base64 image responses
    const handleImageResponse = (base64Image: string, userPrompt: string) => {
        const assistantMessage: Message = {
            id: Date.now(),
            type: 'assistant',
            content: "Here's your generated image!",
            responseType: 'image',
            originalPrompt: userPrompt,
            imageData: base64Image
        };

        setMessages(prev => prev.map(msg =>
            msg.isGenerating ? assistantMessage : msg
        ));
    };

    // Placeholder function for handling text responses
    const handleTextResponse = (textResponse: string, userPrompt: string) => {
        const assistantMessage: Message = {
            id: Date.now(),
            type: 'assistant',
            content: textResponse,
            responseType: 'text',
            originalPrompt: userPrompt
        };

        setMessages(prev => prev.map(msg =>
            msg.isGenerating ? assistantMessage : msg
        ));
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            type: 'user',
            content: prompt
        };
        setMessages(prev => [...prev, userMessage]);

        setIsGenerating(true);
        const currentPrompt = prompt;
        setPrompt('');

        const generatingMessage: Message = {
            id: Date.now() + 1,
            type: 'assistant',
            content: "I'm working on your request...",
            isGenerating: true,
            originalPrompt: currentPrompt
        };
        setMessages(prev => [...prev, generatingMessage]);

        try {
            const values = {
                prompt: currentPrompt,
                image: await toBase64(uploadedImage),
                reference_images: []
            };

            removeUploadedImage();

            console.log(values);

            const result = await fastApiService.designAgent(values);

            console.log(result);

            setMessages(prev => prev.map(m =>
                m.id === generatingMessage.id
                    ? { ...m, content: result?.data.content || 'Error', isGenerating: false }
                    : m
            ));
        } catch (err) {
            console.error('Error generating response', err);
        }

        setIsGenerating(false);
    };


    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleGenerate();
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedImage(file);
        }
    };

    const removeUploadedImage = () => {
        setUploadedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/50 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => router.push('/design-agent')}
                        className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Tracy</h1>
                        <p className="text-xs text-gray-400">AI Design Assistant</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-400">Online</span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user'
                                    ? 'bg-gray-700'
                                    : 'bg-gradient-to-r from-purple-500 to-blue-500'
                                }`}>
                                {message.type === 'user' ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                )}
                            </div>

                            {/* Message Content */}
                            <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-4 py-3 rounded-2xl max-w-md ${message.type === 'user'
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                        : 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50'
                                    }`}>
                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                </div>

                                {/* Generated Image Display */}
                                {message.imageData && (
                                    <div className="mt-4">
                                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
                                            <img
                                                src={`data:image/png;base64,${message.imageData}`}
                                                alt="Generated image"
                                                className="max-w-sm rounded-xl"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Generation Placeholder */}
                                {message.isGenerating && (
                                    <div className="mt-4">
                                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md border border-gray-700/50">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-gray-400 text-sm">Processing your request...</span>
                                            </div>

                                            {/* Animated placeholder */}
                                            <div className="space-y-2">
                                                <div className="h-3 bg-gray-600/50 rounded animate-pulse"></div>
                                                <div className="h-3 bg-gray-600/50 rounded animate-pulse w-4/5"></div>
                                                <div className="h-3 bg-gray-600/50 rounded animate-pulse w-3/4"></div>
                                            </div>

                                            <div className="mt-4 pt-3 border-t border-gray-700/30">
                                                <p className="text-xs text-gray-500 truncate">
                                                    Processing: "{message.originalPrompt}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-800/50 p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Controls */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            {/* Price Slider */}
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-400">Price:</span>
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500">$0</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <span className="text-xs text-gray-500">$100</span>
                                </div>
                                <span className="text-sm text-white font-medium">${price}</span>
                            </div>
                            {/* Location Input */}
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-400">Location:</span>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Enter location"
                                    className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-purple-500 w-32"
                                />
                            </div>
                            {/* Image Upload */}
                            <div className="flex items-center space-x-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center space-x-2 px-3 py-1 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-gray-300 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Upload Image</span>
                                </button>
                                {uploadedImage && (
                                    <div className="flex items-center space-x-2 bg-purple-600/20 border border-purple-500/50 rounded-lg px-3 py-1">
                                        <span className="text-xs text-purple-300">{uploadedImage.name}</span>
                                        <button
                                            onClick={removeUploadedImage}
                                            className="text-purple-400 hover:text-purple-300"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Floating Clear Chat Button */}
                        <button
                            onClick={handleClearAllChats}
                            className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
                            title="Clear all chats"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>

                            {/* Tooltip */}
                            <div className="absolute right-full mr-3 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                Clear all chats
                            </div>
                        </button>
                    </div>

                    {/* Message Input */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4">
                        <div className="flex items-end space-x-4">
                            <div className="flex-1">
                                <textarea
                                    value={prompt}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Describe what you want to create..."
                                    className="w-full bg-transparent text-white placeholder-gray-400 resize-none outline-none text-sm leading-relaxed min-h-[60px] max-h-32"
                                    rows={2}
                                />
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={!prompt.trim() || isGenerating}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-200 flex-shrink-0"
                            >
                                {isGenerating ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="text-xs text-gray-500">Quick ideas:</span>
                        {[
                            "Create a modern logo design",
                            "Generate abstract artwork"
                        ].map((idea, index) => (
                            <button
                                key={index}
                                onClick={() => setPrompt(idea)}
                                className="px-3 py-1 text-xs bg-gray-800/30 hover:bg-gray-700/50 text-gray-400 hover:text-gray-300 rounded-full transition-colors"
                            >
                                {idea}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #8b5cf6;
                    cursor: pointer;
                }
                .slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #8b5cf6;
                    cursor: pointer;
                    border: none;
                }
            `}</style>
        </div>
    );
};

export default DesignAgentChat;