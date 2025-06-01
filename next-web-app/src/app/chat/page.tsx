'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Send, ImagePlus, Menu, X, Bot, User, Trash2, Plus, Download, Expand } from 'lucide-react';
import {
    getAllChatSessions,
    getChatSession,
    upsertChatSession,
    appendToChatSession,
    updateChatSessionProducts,
    updateChatSessionStatus,
    updateChatSessionMeta,
    deleteChatSession,
    clearAllChatSessions,
    type ChatSession,
    type ChatContextEntry
} from '@/app/utils/chatStorageUtils';
import { DesignAgentImageParams, fastApiService } from '../services/fastApiService';

// Updated interfaces to match structure.json
interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string | Array<{
        type: 'input_text' | 'input_image';
        text: string;
    }>;
}

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
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [prompt, setPrompt] = useState('');
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedItems, setSelectedItems] = useState<{[productIndex: number]: number}>({});
    const [productReferenceImages, setProductReferenceImages] = useState<string[]>([]);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load chat sessions from localStorage on mount
    useEffect(() => {
        const loadChatSessions = () => {
            const sessions = getAllChatSessions();
            setChatSessions(sessions);
            
            // If no sessions exist, create a default one
            if (sessions.length === 0) {
                createNewChat();
            } else {
                // Set the first session as current
                setCurrentSessionId(sessions[0].sessionId);
                const firstSession = sessions[0];
                if (firstSession.products) {
                    setProducts(firstSession.products);
                }
                // Don't load generated images from localStorage - let them be session-only
            }
        };
        
        loadChatSessions();
    }, []);

    // Refresh chat sessions when they change
    const refreshChatSessions = () => {
        const sessions = getAllChatSessions();
        setChatSessions(sessions);
    };

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatSessions, currentSessionId]);

    const currentSession = chatSessions.find(session => session.sessionId === currentSessionId);

    const toBase64 = (file: File | null): Promise<string> => {
        if (!file) return Promise.resolve('');
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64 = reader.result as string;
                const base64String = base64.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = error => reject(error);
        });
    };

    const createNewChat = () => {
        const sessionId = `session-${Date.now()}`;
        const newSession: ChatSession = {
            sessionId,
            createdAt: new Date().toISOString(),
            title: 'New Chat',
            conversation: [],
            products: [],
            generated_images: [],
            status: ''
        };
        
        // Save to localStorage
        upsertChatSession(newSession);
        
        // Update local state
        refreshChatSessions();
        setCurrentSessionId(sessionId);
        setProducts([]);
        setGeneratedImages([]); // Clear generated images when creating new chat
        setSelectedItems({});
        setProductReferenceImages([]);
        setPrompt('');
        setUploadedImage(null);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const deleteChat = (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const sessions = getAllChatSessions();
        
        if (sessions.length > 1) {
            // Delete from localStorage
            deleteChatSession(sessionId);
            
            // Update local state
            refreshChatSessions();
            
            if (currentSessionId === sessionId) {
                const remainingSessions = getAllChatSessions();
                setCurrentSessionId(remainingSessions[0]?.sessionId || '');
                // Clear generated images when switching away from deleted chat
                setGeneratedImages([]);
            }
        }
    };

    const switchToChat = (sessionId: string) => {
        setCurrentSessionId(sessionId);
        const session = getChatSession(sessionId);
        if (session) {
            if (session.products) {
                setProducts(session.products);
            } else {
                setProducts([]);
            }
            // Clear generated images when switching chats - they're session-only now
            setGeneratedImages([]);
        } else {
            setProducts([]);
            setGeneratedImages([]);
        }
    };

    const handleProductSelection = (productIndex: number, itemIndex: number) => {
        const product = products[productIndex];
        const selectedItem = product.shopping_search.shopping_results[itemIndex];
        
        setSelectedItems(prev => ({
            ...prev,
            [productIndex]: itemIndex
        }));
        
        setProductReferenceImages(prev => {
            const newImages = [...prev];
            newImages[productIndex] = selectedItem.thumbnail;
            return newImages;
        });
    };

    const initializeDefaultSelections = (newProducts: Product[]) => {
        const defaultSelections: {[productIndex: number]: number} = {};
        const defaultImages: string[] = [];
        
        for (let i = 0; i < newProducts.length; i++) {
            const product = newProducts[i];
            if (product.shopping_search?.shopping_results && product.shopping_search.shopping_results.length > 0) {
                defaultSelections[i] = 0;
                defaultImages[i] = product.shopping_search.shopping_results[0].thumbnail;
            }
        }
        
        setSelectedItems(defaultSelections);
        setProductReferenceImages(defaultImages);
    };

    const getAssistantMessage = (result: any): string => {
        try {
            if (result?.data?.conversation && Array.isArray(result.data.conversation)) {
                const assistantMessage = result.data.conversation.find(
                    (msg: any) => msg.role === 'assistant' || msg.type === 'assistant'
                );
                
                if (assistantMessage?.content) {
                    return assistantMessage.content;
                }
            }
            
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
            if (!result?.data?.products || !Array.isArray(result.data.products)) {
                return [];
            }
            
            const products = result.data.products;
            
            if (products.length === 0) {
                return [];
            }
            
            const productsWithShoppingResults = products.filter((product: any) => {
                return product.shopping_search && 
                    product.shopping_search.shopping_results && 
                    Array.isArray(product.shopping_search.shopping_results) && 
                    product.shopping_search.shopping_results.length > 0;
            });
            
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

        // Create user message in structure.json format
        const userContent: any = [];
        
        if (prompt.trim()) {
            userContent.push({
                type: 'input_text',
                text: prompt
            });
        }

        if (uploadedImage) {
            const base64Image = await toBase64(uploadedImage);
            userContent.push({
                type: 'input_image',
                image_url: `data:image/${uploadedImage.type.split('/')[1]};base64,${base64Image}`
            });
        }

        const userMessage: ChatContextEntry = {
            role: 'user',
            content: userContent.length === 1 && userContent[0].type === 'input_text' 
                ? userContent[0].text 
                : userContent
        };

        setIsGenerating(true);
        const currentPrompt = prompt;
        setPrompt('');

        // Update status to generating without adding messages yet
        updateChatSessionStatus(currentSessionId, 'generating');

        try {
            const currentContext = getChatSession(currentSessionId)?.conversation

            const values = {
                currentContext,
                prompt: currentPrompt,
                image: await toBase64(uploadedImage)
            };

            removeUploadedImage();

            const result = await fastApiService.designAgent(values);


            const assistantMessage = getAssistantMessage(result);
            const extractedProducts = getProducts(result);
            

            // Create assistant message
            const assistantResponse: ChatContextEntry = {
                role: 'assistant',
                content: assistantMessage
            };

            // Only add messages to conversation after successful API call
            appendToChatSession(currentSessionId, [userMessage, assistantResponse]);

            // Update title if this is the first user message
            const session = getChatSession(currentSessionId);
            if (session && session.conversation.length === 2) {
                updateChatSessionMeta(currentSessionId, {
                    title: currentPrompt.slice(0, 30) + (currentPrompt.length > 30 ? '...' : '')
                });
            }

            if (extractedProducts.length > 0) {
                setProducts(extractedProducts);
                await initializeDefaultSelections(extractedProducts);
                // Update products in storage
                updateChatSessionProducts(currentSessionId, extractedProducts);
            }

            // Update session status to completed
            updateChatSessionStatus(currentSessionId, 'completed');

        } catch (err) {
            console.error('Error generating response', err);
            
            // Update status to error without adding any messages
            updateChatSessionStatus(currentSessionId, 'error');
            
            // Show error message temporarily in UI (optional)
            alert('Sorry, something went wrong. Please try again.');
        }

        setIsGenerating(false);
        // Refresh local state
        refreshChatSessions();
    };

    const handleImageGeneration = async () => {
        // Your image generation logic here
        const conversationWithoutImages = getChatSession(currentSessionId)
            ?.conversation
            .map(entry => {
                if (entry.role === 'user' && Array.isArray(entry.content)) {
                // Filter out input_image items from user content array
                const filteredContent = entry.content.filter(c => c.type !== 'input_image');
                return { ...entry, content: filteredContent };
                }
                return entry;
            });

        const firstImage = getChatSession(currentSessionId)
            ?.conversation
            .flatMap(e => e.role === 'user' && Array.isArray(e.content) ? e.content : [])
            .find(c => c.type === 'input_image')?.image_url;
        


        try {
            const values: DesignAgentImageParams = {
                context: conversationWithoutImages, // Assuming this is the context you want to pass
                user_image: firstImage, // Assuming this is the user's image you want to pass
                product_image_urls: productReferenceImages // Assuming these are the product reference images you want to pass
            };

            const result = await fastApiService.designAgentImage(values);


            // Extract base64 image from result.data and add to local state only
            if (result?.data) {
                // Add the generated image to local state only (not persisted)
                setGeneratedImages(prev => [...prev, result.data]);
            }
        }
        catch (err) {
            console.error('Error generating image', err);
            
            // Update status to error without adding any messages
            updateChatSessionStatus(currentSessionId, 'error');
            
            // Show error message temporarily in UI (optional)
            alert('Sorry, something went wrong. Please try again.');
        }
    };

    const handleDeleteGeneratedImage = (index: number) => {
        // Simply remove from local state - no localStorage persistence
        setGeneratedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleDownloadImage = (base64Image: string, index: number) => {
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${base64Image}`;
        link.download = `generated-image-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

    const formatMessageContent = (content: string | Array<{type: string; text: string}>): string => {
        if (typeof content === 'string') {
            return content;
        }
        
        return content
            .filter(item => item.type === 'input_text')
            .map(item => item.text)
            .join(' ');
    };

    const getMessageImages = (content: string | Array<{type: string; text: string}>): string[] => {
        if (typeof content === 'string') {
            return [];
        }
        
        return content
            .filter(item => item.type === 'input_image')
            .map(item => item.text);
    };

    const handleClearAllChats = () => {
        clearAllChatSessions();
        setChatSessions([]);
        setCurrentSessionId('');
        setProducts([]);
        setGeneratedImages([]);
        setSelectedItems({});
        setProductReferenceImages([]);
        createNewChat();
    };

    const ProductsSelectionUI = () => {
        if (!products || products.length === 0) {
            return null;
        }

        return (
            <div className="mt-4 p-4 bg-gray-800/20 backdrop-blur-sm rounded-xl max-w-2xl border border-gray-700/30">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Recommended Products
                </h3>
                
                <div className="space-y-4">
                    {products.map((product, productIndex) => {
                        if (!product.shopping_search?.shopping_results || product.shopping_search.shopping_results.length === 0) {
                            return null;
                        }

                        return (
                            <div key={productIndex} className="space-y-2">
                                <h4 className="text-xs font-medium text-gray-300">
                                    Product {productIndex + 1}
                                    {product.name && (
                                        <span className="text-xs text-gray-400 ml-1">({product.name})</span>
                                    )}
                                    <span className="text-xs text-gray-500 ml-2">
                                        ({product.shopping_search.shopping_results.length} options)
                                    </span>
                                </h4>
                                
                                <div 
                                    className="flex gap-3 pb-2 px-1 py-2 w-full overflow-x-auto"
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
                                                    <div className="aspect-square relative">
                                                        <img
                                                            src={item.thumbnail}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                        
                                                        {isSelected && (
                                                            <div className="absolute top-1 right-1">
                                                                <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        )}
                                                        
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
                                                    
                                                    <div className="px-1.5 py-1">
                                                        <div className="text-xs font-medium text-white truncate text-center">
                                                            {item.price}
                                                        </div>
                                                    </div>
                                                </div>
                                                
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
                
                <div className="mt-3 pt-2 border-t border-gray-700/30">
                    <div className="text-xs text-gray-400">
                        Selected: {Object.keys(selectedItems).length} of {products.filter(p => p.shopping_search?.shopping_results?.length > 0).length} products
                    </div>
                </div>
            </div>
        );
    };

    const GenerateFromProductsUI = () => {
        if (!products || products.length === 0) {
            return null;
        }
        return (
            <div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl max-w-2xl border border-gray-700/50 mt-4 p-4">
                    <div className="flex items-center justify-between">
                        {/* Left side - Status info */}
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-sm">Ready to Generate</h4>
                                <p className="text-gray-400 text-xs">Room uploaded • Products selected</p>
                            </div>
                        </div>

                        {/* Right side - Generate button */}
                        <button 
                            onClick={handleImageGeneration}
                            className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-medium text-white transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg hover:shadow-xl">
                            <span className="relative z-10 flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>Generate Furnished Room</span>
                                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                            
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                        </button>
                    </div>
                </div>
            </div>
        )
    };

    const GeneratedImagesUI = () => {
        if (!generatedImages || generatedImages.length === 0) {
            return null;
        }

        return (
            <div className="mt-4 p-4 bg-gray-800/20 backdrop-blur-sm rounded-xl max-w-2xl border border-gray-700/30">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Generated Images ({generatedImages.length})
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {generatedImages.map((base64Image, index) => (
                        <div key={index} className="relative group">
                            <div className="relative bg-gray-700/30 rounded-lg overflow-hidden border border-gray-600/30 hover:border-gray-500 transition-colors">
                                <img
                                    src={`data:image/png;base64,${base64Image}`}
                                    alt={`Generated image ${index + 1}`}
                                    className="w-full h-auto object-cover cursor-pointer"
                                    onClick={() => setExpandedImage(`data:image/png;base64,${base64Image}`)}
                                />
                                
                                {/* Action buttons overlay */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                    <button
                                        onClick={() => setExpandedImage(`data:image/png;base64,${base64Image}`)}
                                        className="bg-black/60 hover:bg-black/80 text-white p-2 rounded"
                                        title="Expand image"
                                    >
                                        <Expand className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDownloadImage(base64Image, index)}
                                        className="bg-black/60 hover:bg-black/80 text-white p-2 rounded"
                                        title="Download image"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteGeneratedImage(index)}
                                        className="bg-red-600/80 hover:bg-red-600 text-white p-2 rounded"
                                        title="Delete image"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                {/* Image number badge */}
                                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                    #{index + 1}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Modal for expanded image view
    const ImageModal = () => {
        if (!expandedImage) return null;

        return (
            <div 
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setExpandedImage(null)}
            >
                <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
                    <img
                        src={expandedImage}
                        alt="Expanded generated image"
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        onClick={() => setExpandedImage(null)}
                        className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 flex flex-col overflow-hidden`}>
                <div className="p-4 border-b border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Chat History</h2>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-1 hover:bg-gray-700/50 rounded transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={createNewChat}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>New Chat</span>
                        </button>
                        <button
                            onClick={handleClearAllChats}
                            className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                            title="Clear all chats"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {chatSessions.map((session) => (
                        <div
                            key={session.sessionId}
                            onClick={() => switchToChat(session.sessionId)}
                            className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between ${
                                currentSessionId === session.sessionId 
                                    ? 'bg-purple-600/20 border border-purple-500/50' 
                                    : 'hover:bg-gray-700/30'
                            }`}
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{session.title}</p>
                                <p className="text-xs text-gray-400">
                                    {new Date(session.createdAt).toLocaleDateString()}
                                </p>
                                <div className="flex items-center space-x-1 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${
                                        session.status === 'generating' ? 'bg-yellow-400' :
                                        session.status === 'completed' ? 'bg-green-400' :
                                        session.status === 'error' ? 'bg-red-400' : 'bg-gray-400'
                                    }`}></div>
                                    <span className="text-xs text-gray-500">
                                        {session.conversation.length} messages
                                    </span>
                                </div>
                            </div>
                            {chatSessions.length > 1 && (
                                <button
                                    onClick={(e) => deleteChat(session.sessionId, e)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                                >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/50 backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                        {!sidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        )}
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
                    {currentSession?.conversation.length === 0 && !isGenerating ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center max-w-md">
                                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                                    <Bot className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Start a New Conversation</h3>
                                <p className="text-gray-400">Hi! I'm Tracy, your AI design companion. Describe what you want to create and I'll help bring your vision to life.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {currentSession?.conversation.map((message, index) => {
                                const messageText = formatMessageContent(message.content);
                                const messageImages = getMessageImages(message.content);
                                const isLastMessage = index === currentSession.conversation.length - 1;
                                const showProducts = message.role === 'assistant' && isLastMessage && products.length > 0;

                                return (
                                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex items-start space-x-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                            {/* Avatar */}
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                message.role === 'user'
                                                    ? 'bg-gray-700'
                                                    : 'bg-gradient-to-r from-purple-500 to-blue-500'
                                            }`}>
                                                {message.role === 'user' ? (
                                                    <User className="w-5 h-5" />
                                                ) : (
                                                    <Bot className="w-5 h-5 text-white" />
                                                )}
                                            </div>

                                            {/* Message Content */}
                                            <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                                <div className={`px-4 py-3 rounded-2xl max-w-2xl ${
                                                    message.role === 'user'
                                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                                        : 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50'
                                                }`}>
                                                    {/* Message Images */}
                                                    {messageImages.length > 0 && (
                                                        <div className="mb-3 space-y-2">
                                                            {messageImages.map((imageSrc, imgIndex) => (
                                                                <img
                                                                    key={imgIndex}
                                                                    src={imageSrc}
                                                                    alt="Uploaded image"
                                                                    className="max-w-md rounded-lg"
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                    
                                                    {/* Message Text */}
                                                    <pre className="text-sm text-wrap leading-relaxed">{messageText}</pre>
                                                </div>

                                                {/* Products Selection UI */}
                                                {showProducts && !isGenerating && (
                                                    <ProductsSelectionUI />
                                                )}
                                                {showProducts && !isGenerating && (
                                                    <GenerateFromProductsUI />
                                                )}
                                                {/* Generated Images UI */}
                                                {showProducts && !isGenerating && (
                                                    <GeneratedImagesUI />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Generation Indicator - Show when generating */}
                            {isGenerating && (
                                <div className="flex justify-start">
                                    <div className="flex items-start space-x-3 max-w-3xl">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-purple-500 to-blue-500">
                                            <Bot className="w-5 h-5 text-white" />
                                        </div>

                                        {/* Loading Content */}
                                        <div className="flex flex-col items-start">
                                            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md border border-gray-700/50">
                                                <div className="flex items-center space-x-3 mb-4">
                                                    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="text-gray-400 text-sm">Processing your request...</span>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="h-3 bg-gray-600/50 rounded animate-pulse"></div>
                                                    <div className="h-3 bg-gray-600/50 rounded animate-pulse w-4/5"></div>
                                                    <div className="h-3 bg-gray-600/50 rounded animate-pulse w-3/4"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-800/50 p-6">
                    {/* Chat Mode */}
                    {<div className="max-w-4xl mx-auto">
                        {/* Upload Preview */}
                        {uploadedImage && (
                            <div className="mb-4 p-3 bg-gray-700/50 rounded-lg flex items-center space-x-3">
                                <img 
                                    src={URL.createObjectURL(uploadedImage)} 
                                    alt={uploadedImage.name}
                                    className="w-12 h-12 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{uploadedImage.name}</p>
                                    <p className="text-xs text-gray-400">Ready to upload</p>
                                </div>
                                <button
                                    onClick={removeUploadedImage}
                                    className="p-1 hover:bg-gray-600/50 rounded transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Message Input */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4">
                            <div className="flex items-end space-x-4">
                                <div className="flex-1 relative">
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Describe what you want to create..."
                                        className="w-full bg-transparent text-white placeholder-gray-400 resize-none outline-none text-sm leading-relaxed min-h-[60px] max-h-32 pr-12"
                                        rows={2}
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-3 right-3 p-2 hover:bg-gray-600/50 rounded-lg transition-colors"
                                    >
                                        <ImagePlus className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={!prompt.trim() || isGenerating}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-200 flex-shrink-0"
                                >
                                    {isGenerating ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Send className="w-5 h-5" />
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

                        {/* File Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>}
                </div>
            </div>

            {/* Image Modal */}
            <ImageModal />
        </div>
    );
};

export default DesignAgentChat;