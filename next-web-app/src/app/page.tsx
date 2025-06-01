'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const DesignAgentLanding = () => {
    const router = useRouter();

    const handleGetStarted = () => {
        router.push('/chat');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white overflow-hidden">
            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-2">
                    <div className="flex items-center relative">
                        {/* <Image
                            src="/images/logo/muralink-logo-white.png"
                            alt="M"
                            width={60}
                            height={60}
                            className="h-14 w-auto transform -translate-x-2"
                        /> */}
                        
                        <span className="font-relative-pro text-2xl font-bold transform -translate-x-2 mt-2 pl-4 ml-[-12px]"><span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-gray-100">Muralink</span></span>
                    </div>
                    <div className="w-0.5 h-8 bg-white rounded-lg flex items-center justify-center"></div>
                    <div className="flex items-center space-x-2 relative">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold">Tracy</span>
                    </div>
                </div>
                <div className="hidden md:flex items-center space-x-8">
                    <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                    <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
                    <button 
                        onClick={handleGetStarted}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative flex flex-col items-center justify-center px-6 py-20">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    {/* AI Avatar */}
                    <div className="mb-8">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-2xl">
                            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="inline-block px-4 py-2 bg-gray-800/50 rounded-full backdrop-blur-sm border border-gray-700">
                            <span className="text-sm text-gray-300">Meet Tracy</span>
                        </div>
                    </div>

                    {/* Headlines */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
                        Your AI Design
                        <br />
                        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Companion
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
                        Transform your ideas into stunning visuals with Tracy, your intelligent design assistant. 
                        Create, iterate, and perfect your designs through natural conversation.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
                        <button 
                            onClick={handleGetStarted}
                            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-lg font-medium overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                        >
                            <span className="relative z-10 flex items-center space-x-2">
                                <span>Get Started</span>
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                        
                        <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group">
                            <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center group-hover:bg-gray-700/50 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span>Watch Demo</span>
                        </button>
                    </div>

                    {/* Feature Preview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Natural Conversation</h3>
                            <p className="text-gray-400 text-sm">Describe your vision in plain English and watch Tracy bring it to life</p>
                        </div>

                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Instant Generation</h3>
                            <p className="text-gray-400 text-sm">From concept to creation in seconds with advanced AI technology</p>
                        </div>

                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Perfect Results</h3>
                            <p className="text-gray-400 text-sm">Iterate and refine until your design matches your exact vision</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesignAgentLanding;