'use client'

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toBase64, imageUrlToBase64 } from '@/app/utils/imageProcessor';
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
    hasProducts?: boolean; // Add this flag
}

// Updated interfaces to match actual structure
interface Product {
    id?: number;
    name?: string;
    properties?: string[];
    shopping_search: {
        results_count: number;
        search_query: string;
        shopping_results: ShoppingItem[];
    };
}

interface ShoppingItem {
    id?: string;
    name: string;
    price: string;
    thumbnail: string;
    link: string;
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

    const [products, setProducts] = useState<Product[]>([]);
    const [selectedItems, setSelectedItems] = useState<{[productIndex: number]: number}>({});
    const [productReferenceImages, setProductReferenceImages] = useState<string[]>([]);

    const handleClearAllChats = () => {
        setMessages([
            {
                id: 1,
                type: 'assistant',
                content: "Hi! I'm Tracy, your AI design companion. I can help you create amazing visuals just by describing what you have in mind. What would you like to design today?"
            }
        ]);

        clearChatContext();
        setPrompt('');
        setUploadedImage(null);
        
        // Clear products related state
        setProducts([]);
        setSelectedItems({});
        setProductReferenceImages([]);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleProductSelection = async (productIndex: number, itemIndex: number) => {
        const product = products[productIndex];
        const selectedItem = product.shopping_search.shopping_results[itemIndex];
        
        setSelectedItems(prev => ({
            ...prev,
            [productIndex]: itemIndex
        }));
        
        try {
            const base64Image = await imageUrlToBase64(selectedItem.thumbnail);
            setProductReferenceImages(prev => {
                const newImages = [...prev];
                newImages[productIndex] = base64Image;
                return newImages;
            });
        } catch (error) {
            console.error('Error updating reference image:', error);
        }
    };

    const initializeDefaultSelections = async (newProducts: Product[]) => {
        const defaultSelections: {[productIndex: number]: number} = {};
        const defaultImages: string[] = [];
        
        for (let i = 0; i < newProducts.length; i++) {
            const product = newProducts[i];
            if (product.shopping_search?.shopping_results && product.shopping_search.shopping_results.length > 0) {
                defaultSelections[i] = 0;
                
                try {
                    const base64Image = await imageUrlToBase64(product.shopping_search.shopping_results[0].thumbnail);
                    defaultImages[i] = base64Image;
                } catch (error) {
                    console.error('Error loading default image:', error);
                    defaultImages[i] = '';
                }
            }
        }
        
        setSelectedItems(defaultSelections);
        setProductReferenceImages(defaultImages);
    };

    const getAssistantMessage = (result: any): string => {
        try {
            // Check if result exists and has the expected structure
            if (result?.data?.conversation && Array.isArray(result.data.conversation)) {
                const assistantMessage = result.data.conversation.find(
                    (msg: any) => msg.role === 'assistant' || msg.type === 'assistant'
                );
                
                if (assistantMessage?.content) {
                    return assistantMessage.content;
                }
            }
            
            // Fallback to the original structure
            if (result?.data?.conversation?.[0]?.content) {
                return result.data.conversation[0].content;
            }
            
            return 'Sorry, I couldn\'t generate a response. Please try again.';
        } catch (error) {
            console.error('Error extracting assistant message:', error);
            return 'An error occurred while processing your request.';
        }
    };

    const getProducts = (result: any): any[] => {
        try {
            // Check if result exists and has products
            if (!result?.data?.products || !Array.isArray(result.data.products)) {
                return [];
            }
            
            const products = result.data.products;
            
            // Check if products array is empty
            if (products.length === 0) {
                return [];
            }
            
            // Filter products that have shopping_search with shopping_results data
            const productsWithShoppingResults = products.filter((product: any) => {
                return product.shopping_search && 
                    product.shopping_search.shopping_results && 
                    Array.isArray(product.shopping_search.shopping_results) && 
                    product.shopping_search.shopping_results.length > 0;
            });
            
            // Return the whole products array if any product has shopping_results
            if (productsWithShoppingResults.length > 0) {
                return products;
            }
            
            return [];
        } catch (error) {
            console.error('Error extracting products:', error);
            return [];
        }
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
                reference_images: productReferenceImages // Include reference images
            };

            removeUploadedImage();

            const result = await fastApiService.designAgent(values);

            console.log('Current result:', result);

            // Use utility functions to extract data
            const assistantMessage = getAssistantMessage(result);
            const extractedProducts = getProducts(result);
            
            console.log('Assistant Message:', assistantMessage);
            console.log('Products with shopping_results:', extractedProducts);

            // Update products state and initialize selections
            if (extractedProducts.length > 0) {
                setProducts(extractedProducts);
                await initializeDefaultSelections(extractedProducts);
            }

            setMessages(prev => prev.map(m =>
                m.id === generatingMessage.id
                    ? { 
                        ...m, 
                        content: assistantMessage, 
                        isGenerating: false,
                        hasProducts: extractedProducts.length > 0
                    }
                    : m
            ));
        } catch (err) {
            console.error('Error generating response', err);
            
            setMessages(prev => prev.map(m =>
                m.id === generatingMessage.id
                    ? { 
                        ...m, 
                        content: 'Sorry, something went wrong. Please try again.', 
                        isGenerating: false 
                    }
                    : m
            ));
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

    const ProductsSelectionUI = () => {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="mt-4 p-4 bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/30">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Recommended Products
            </h3>
            
            <div className="space-y-4">
                {products.map((product, productIndex) => {
                    // Skip products that don't have shopping results
                    if (!product.shopping_search?.shopping_results || product.shopping_search.shopping_results.length === 0) {
                        return null;
                    }

                    return (
                        <div key={productIndex} className="space-y-2">
                            {/* Product Header */}
                            <h4 className="text-xs font-medium text-gray-300">
                                Product {productIndex + 1}
                                {product.name && (
                                    <span className="text-xs text-gray-400 ml-1">({product.name})</span>
                                )}
                                <span className="text-xs text-gray-500 ml-2">
                                    ({product.shopping_search.shopping_results.length} options)
                                </span>
                            </h4>
                            
                            {/* Horizontally Scrollable Product Row */}
                            <div 
                                className="flex gap-3 pb-2 px-1 py-2 overflow-x-auto"
                                onWheel={(e) => {
                                    // Prevent vertical scrolling when hovering over this product row
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // Scroll horizontally instead
                                    e.currentTarget.scrollLeft += e.deltaY;
                                }}
                                style={{
                                    scrollbarWidth: 'none', // Firefox
                                    msOverflowStyle: 'none', // IE/Edge
                                }}
                            >
                                {product.shopping_search.shopping_results.map((item, itemIndex) => {
                                    const isSelected = selectedItems[productIndex] === itemIndex;
                                    
                                    return (
                                        <div
                                            key={item.id || itemIndex}
                                            className={`relative group cursor-pointer transition-all duration-200 transform rounded-lg hover:scale-105 flex-shrink-0 w-20 sm:w-24 ${
                                                isSelected 
                                                    ? 'ring-2 ring-purple-400 shadow-sm shadow-purple-400/25' 
                                                    : 'hover:ring-1 hover:ring-gray-400'
                                            }`}
                                            onClick={() => handleProductSelection(productIndex, itemIndex)}
                                        >
                                            <div className={`relative bg-gray-700/30 rounded-lg overflow-hidden border transition-colors ${
                                                isSelected 
                                                    ? 'border-purple-400 bg-purple-900/10' 
                                                    : 'border-gray-600/30 hover:border-gray-500'
                                            }`}>
                                                {/* Product Image */}
                                                <div className="aspect-square relative">
                                                    <img
                                                        src={item.thumbnail}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                    
                                                    {/* Selection Indicator */}
                                                    {isSelected && (
                                                        <div className="absolute top-1 right-1">
                                                            <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                                                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {/* External Link Icon */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(item.link, '_blank');
                                                        }}
                                                        className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white p-1 rounded"
                                                        title="View product"
                                                    >
                                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                
                                                {/* Product Price */}
                                                <div className="px-1.5 py-1">
                                                    <div className="text-xs font-medium text-white truncate text-center">
                                                        {item.price}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Tooltip with product name */}
                                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                                                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap max-w-32 truncate">
                                                    {item.name}
                                                </div>
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Selected Items Summary */}
            <div className="mt-3 pt-2 border-t border-gray-700/30">
                <div className="text-xs text-gray-400">
                    Selected: {Object.keys(selectedItems).length} of {products.filter(p => p.shopping_search?.shopping_results?.length > 0).length} products
                </div>
            </div>
        </div>
    );
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
                                    <pre className="text-sm text-wrap leading-relaxed">{message.content}</pre>
                                </div>

                                {/* Products Selection UI */}
                                {message.hasProducts && message.type === 'assistant' && !message.isGenerating && (
                                    <ProductsSelectionUI />
                                )}

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
                                                <pre className="text-xs text-wrap text-gray-500 truncate">
                                                    Processing: "{message.originalPrompt}"
                                                </pre>
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