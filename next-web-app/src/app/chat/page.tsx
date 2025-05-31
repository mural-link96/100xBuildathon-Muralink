'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
    id: number;
    type: 'user' | 'assistant';
    content: string;
    isGenerating?: boolean;
}

const DesignAgentChat = () => {
    const [prompt, setPrompt] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [isGenerating, setIsGenerating] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            type: 'assistant',
            content: "Hi! I'm Tracy, your AI design companion. I can help you create amazing visuals just by describing what you have in mind. What would you like to design today?"
        }
    ]);
    const router = useRouter();

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now(),
            type: 'user',
            content: prompt
        };
        setMessages(prev => [...prev, userMessage]);
        
        setIsGenerating(true);
        setPrompt('');

        // Simulate AI response
        setTimeout(() => {
            const assistantMessage: Message = {
                id: Date.now() + 1,
                type: 'assistant',
                content: "I'm creating your design now! This looks like an exciting project. Let me generate something amazing for you.",
                isGenerating: true
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsGenerating(false);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleGenerate();
        }
    };

    const aspectRatios = [
        { label: '1:1', value: '1:1' },
        { label: '16:9', value: '16:9' },
        { label: '9:16', value: '9:16' },
        { label: '4:3', value: '4:3' },
        { label: '3:4', value: '3:4' }
    ];

    const styles = [
        'Photorealistic',
        'Digital Art',
        'Oil Painting',
        'Watercolor',
        'Sketch',
        'Minimalist',
        'Abstract',
        'Vintage'
    ];

    return (
        <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/50 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                    <button 
                        onClick={() => router.push('/')}
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
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                message.type === 'user' 
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
                                <div className={`px-4 py-3 rounded-2xl max-w-md ${
                                    message.type === 'user'
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                        : 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50'
                                }`}>
                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                </div>
                                
                                {/* Generation Placeholder */}
                                {message.isGenerating && (
                                    <div className="mt-4 bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 w-80 border border-gray-700/50">
                                        <div className="aspect-square bg-gray-700/50 rounded-xl flex items-center justify-center mb-4">
                                            <div className="text-center">
                                                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                                <p className="text-gray-400 text-sm">Generating your design...</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>Style: {selectedStyle || 'Auto'}</span>
                                            <span>Ratio: {aspectRatio}</span>
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
                    {/* Style and Aspect Ratio Controls */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        {/* Style Selector */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">Style:</span>
                            <select
                                value={selectedStyle}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStyle(e.target.value)}
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-purple-500"
                            >
                                <option value="">Auto</option>
                                {styles.map(style => (
                                    <option key={style} value={style}>{style}</option>
                                ))}
                            </select>
                        </div>

                        {/* Aspect Ratio Selector */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">Aspect:</span>
                            <div className="flex items-center space-x-1">
                                {aspectRatios.map(ratio => (
                                    <button
                                        key={ratio.value}
                                        onClick={() => setAspectRatio(ratio.value)}
                                        className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                                            aspectRatio === ratio.value
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                                        }`}
                                    >
                                        {ratio.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4">
                        <div className="flex items-end space-x-4">
                            <div className="flex-1">
                                <textarea
                                    value={prompt}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Describe the image you want to create..."
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
                            "Modern logo design",
                            "Abstract artwork",
                            "Character illustration",
                            "Website mockup"
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
        </div>
    );
};

export default DesignAgentChat;