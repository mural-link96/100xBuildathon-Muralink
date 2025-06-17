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
import Image from 'next/image';

// IndexedDB utility functions for generated images
class GeneratedImagesDB {
    private dbName = 'DesignAgentImages';
    private version = 1;
    private storeName = 'generated_images';

    async openDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
                    store.createIndex('sessionId', 'sessionId', { unique: false });
                }
            };
        });
    }

    async saveImage(sessionId: string, base64Image: string): Promise<number> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            
            const imageData = {
                sessionId,
                base64Image,
                createdAt: new Date().toISOString()
            };
            
            const request = store.add(imageData);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result as number);
        });
    }

    async getImagesBySession(sessionId: string): Promise<{id: number, base64Image: string, createdAt: string}[]> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('sessionId');
            
            const request = index.getAll(sessionId);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async deleteImage(imageId: number): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            
            const request = store.delete(imageId);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async deleteImagesBySession(sessionId: string): Promise<void> {
        const images = await this.getImagesBySession(sessionId);
        const deletePromises = images.map(img => this.deleteImage(img.id));
        await Promise.all(deletePromises);
    }

    async clearAllImages(): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            
            const request = store.clear();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }
}

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

interface GeneratedImage {
    id: number;
    base64Image: string;
    createdAt: string;
}

const DesignAgentChat = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [prompt, setPrompt] = useState('');
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedItems, setSelectedItems] = useState<{[productIndex: number]: number}>({});
    const [productReferenceImages, setProductReferenceImages] = useState<string[]>([]);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const imagesDB = useRef(new GeneratedImagesDB());

    // Check if mobile screen
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Load chat sessions from localStorage on mount
    useEffect(() => {
        const loadChatSessions = async () => {
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
                // Load generated images from IndexedDB
                await loadGeneratedImages(sessions[0].sessionId);
            }
        };
        
        loadChatSessions();
    }, []);

    // Load generated images from IndexedDB for a specific session
    const loadGeneratedImages = async (sessionId: string) => {
        try {
            const images = await imagesDB.current.getImagesBySession(sessionId);
            setGeneratedImages(images);
        } catch (error) {
            console.error('Error loading generated images:', error);
            setGeneratedImages([]);
        }
    };

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
        setGeneratedImages([]);
        setSelectedItems({});
        setProductReferenceImages([]);
        setPrompt('');
        setUploadedImage(null);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const deleteChat = async (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const sessions = getAllChatSessions();
        
        if (sessions.length > 1) {
            try {
                // Delete generated images from IndexedDB
                await imagesDB.current.deleteImagesBySession(sessionId);
                
                // Delete from localStorage
                deleteChatSession(sessionId);
                
                // Update local state
                refreshChatSessions();
                
                if (currentSessionId === sessionId) {
                    const remainingSessions = getAllChatSessions();
                    const newSessionId = remainingSessions[0]?.sessionId || '';
                    setCurrentSessionId(newSessionId);
                    if (newSessionId) {
                        await loadGeneratedImages(newSessionId);
                    } else {
                        setGeneratedImages([]);
                    }
                }
            } catch (error) {
                console.error('Error deleting chat session:', error);
            }
        }
    };

    const switchToChat = async (sessionId: string) => {
        setCurrentSessionId(sessionId);
        const session = getChatSession(sessionId);
        if (session) {
            if (session.products) {
                setProducts(session.products);
            } else {
                setProducts([]);
            }
            // Load generated images from IndexedDB for this session
            await loadGeneratedImages(sessionId);
        } else {
            setProducts([]);
            setGeneratedImages([]);
        }
        
        // Close sidebar on mobile after selecting
        if (isMobile) {
            setSidebarOpen(false);
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

    // Updated handleImageGeneration function
    const handleImageGeneration = async () => {
        setIsGeneratingImage(true);
        
        try {
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

            const values: DesignAgentImageParams = {
                context: conversationWithoutImages,
                user_image: firstImage,
                product_image_urls: productReferenceImages
            };

            const result = await fastApiService.designAgentImage(values);

            // Extract base64 image from result.data and save to IndexedDB
            if (result?.data) {
                try {
                    const imageId = await imagesDB.current.saveImage(currentSessionId, result.data);
                    const newImage: GeneratedImage = {
                        id: imageId,
                        base64Image: result.data,
                        createdAt: new Date().toISOString()
                    };
                    setGeneratedImages(prev => [...prev, newImage]);
                } catch (error) {
                    console.error('Error saving generated image to IndexedDB:', error);
                    // Fallback to local state only if IndexedDB fails
                    const newImage: GeneratedImage = {
                        id: Date.now(), // Fallback ID
                        base64Image: result.data,
                        createdAt: new Date().toISOString()
                    };
                    setGeneratedImages(prev => [...prev, newImage]);
                }
            }
        }
        catch (err) {
            console.error('Error generating image', err);
            
            // Update status to error without adding any messages
            updateChatSessionStatus(currentSessionId, 'error');
            
            // Show error message temporarily in UI (optional)
            alert('Sorry, something went wrong. Please try again.');
        }
        finally {
            setIsGeneratingImage(false);
        }
    };

    const handleDeleteGeneratedImage = async (imageId: number, index: number) => {
        try {
            // Delete from IndexedDB
            await imagesDB.current.deleteImage(imageId);
            // Remove from local state
            setGeneratedImages(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error deleting generated image:', error);
            // Fallback to local state removal only
            setGeneratedImages(prev => prev.filter((_, i) => i !== index));
        }
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

    const handleQuickRoomSelect = async (imageUrl: string, roomName: string) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], `${roomName.toLowerCase().replace(' ', '-')}-room.jpg`, {
                type: blob.type
            });
            setUploadedImage(file);
        } catch (error) {
            console.error('Error loading room image:', error);
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

    const getMessageImages = (content: string | Array<{type: string; image_url: string}>): string[] => {
        if (typeof content === 'string') {
            return [];
        }
        
        return content
            .filter(item => item.type === 'input_image')
            .map(item => item.image_url);
    };

    const handleClearAllChats = async () => {
        try {
            // Clear all generated images from IndexedDB
            await imagesDB.current.clearAllImages();
        } catch (error) {
            console.error('Error clearing images from IndexedDB:', error);
        }
        
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
            <div className="mt-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-3" style={{ color: '#5045e6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Recommended Products
                </h3>
                
                <div className="space-y-5">
                    {products.map((product, productIndex) => {
                        if (!product.shopping_search?.shopping_results || product.shopping_search.shopping_results.length === 0) {
                            return null;
                        }

                        return (
                            <div key={productIndex} className="space-y-3">
                                <h4 className="text-sm font-medium text-gray-700">
                                    Product {productIndex + 1}
                                    {product.name && (
                                        <span className="text-sm text-gray-500 ml-2">({product.name})</span>
                                    )}
                                    <span className="text-xs text-gray-400 ml-2">
                                        ({product.shopping_search.shopping_results.length} options)
                                    </span>
                                </h4>
                                
                                <div className="flex gap-3 pb-3 px-1 py-2 w-full overflow-x-auto">
                                    {product.shopping_search.shopping_results.map((item, itemIndex) => {
                                        const isSelected = selectedItems[productIndex] === itemIndex;
                                        
                                        return (
                                            <div
                                                key={item.id || itemIndex}
                                                className={`relative group cursor-pointer transition-all duration-200 transform rounded-xl hover:scale-105 flex-shrink-0 w-24 sm:w-28 ${
                                                    isSelected 
                                                        ? 'ring-2 ring-purple-500 shadow-lg' 
                                                        : 'hover:ring-1 hover:ring-gray-300'
                                                }`}
                                                style={{
                                                    boxShadow: isSelected ? '0 10px 25px rgba(80, 69, 230, 0.15)' : undefined
                                                }}
                                                onClick={() => handleProductSelection(productIndex, itemIndex)}
                                            >
                                                <div className={`relative bg-white rounded-xl overflow-hidden border-2 transition-colors ${
                                                    isSelected 
                                                        ? 'bg-blue-50 border-purple-500' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}>
                                                    <div className="aspect-square relative">
                                                        <img
                                                            src={item.thumbnail}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                        
                                                        {isSelected && (
                                                            <div className="absolute top-2 right-2">
                                                                <div 
                                                                    className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                                                                    style={{ backgroundColor: '#5045e6' }}
                                                                >
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                                            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-lg"
                                                            title="View product"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="px-2 py-2">
                                                        <div className="text-sm font-semibold text-gray-800 truncate text-center">
                                                            {item.price}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                                                    <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap max-w-36 truncate shadow-lg">
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
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
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
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 max-w-2xl mt-6 p-6">
                    <div className="flex items-center justify-between gap-8">
                        {/* Left side - Status info */}
                        <div className="flex items-center space-x-4">
                            <div 
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                    isGeneratingImage 
                                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                                        : 'bg-gradient-to-r from-green-400 to-green-600'
                                }`}
                                style={{
                                    background: !isGeneratingImage ? `linear-gradient(135deg, #5045e6, #7c3aed)` : undefined
                                }}
                            >
                                {isGeneratingImage ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <h4 className="text-gray-800 font-semibold text-base">
                                    {isGeneratingImage ? 'Generating Images...' : 'Ready to Generate'}
                                </h4>
                                <p className="text-gray-600 text-sm">
                                    {isGeneratingImage ? 'Creating your furnished room design' : 'Room uploaded • Products selected'}
                                </p>
                            </div>
                        </div>

                        {/* Right side - Generate button */}
                        <button 
                            onClick={handleImageGeneration}
                            disabled={isGeneratingImage}
                            className={`group relative px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 transform flex items-center space-x-2 shadow-lg ${
                                isGeneratingImage
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'hover:scale-105 hover:shadow-xl'
                            }`}
                            style={{
                                background: !isGeneratingImage ? `linear-gradient(135deg, #5045e6, #7c3aed)` : undefined
                            }}
                        >
                            <span className="relative z-10 flex items-center space-x-2">
                                {isGeneratingImage ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        <span>Generate Furnished Room</span>
                                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Loading progress indicator */}
                {isGeneratingImage && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl max-w-2xl border border-blue-200">
                        <div className="flex items-center space-x-3 mb-2">
                            <div 
                                className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                                style={{ borderColor: '#5045e6', borderTopColor: 'transparent' }}
                            ></div>
                            <span className="text-sm text-gray-700">Processing your design request...</span>
                        </div>
                        
                        <div className="text-xs text-gray-600">
                            This may take 30-60 seconds to complete
                        </div>
                    </div>
                )}
            </div>
        )
    };

    const GeneratedImagesUI = () => {
        if (!generatedImages || generatedImages.length === 0) {
            return null;
        }

        return (
            <div className="mt-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Generated Images ({generatedImages.length})
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {generatedImages.map((image, index) => (
                        <div key={image.id} className="relative group">
                            <div className="relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors shadow-sm hover:shadow-md">
                                <img
                                    src={`data:image/png;base64,${image.base64Image}`}
                                    alt={`Generated image ${index + 1}`}
                                    className="w-full h-auto object-cover cursor-pointer"
                                    onClick={() => setExpandedImage(`data:image/png;base64,${image.base64Image}`)}
                                />
                                
                                {/* Action buttons overlay */}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                    <button
                                        onClick={() => setExpandedImage(`data:image/png;base64,${image.base64Image}`)}
                                        className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-lg shadow-sm"
                                        title="Expand image"
                                    >
                                        <Expand className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDownloadImage(image.base64Image, index)}
                                        className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-lg shadow-sm"
                                        title="Download image"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteGeneratedImage(image.id, index)}
                                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg shadow-sm"
                                        title="Delete image"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                {/* Image number badge */}
                                <div className="absolute bottom-3 left-3 bg-white/90 text-gray-700 text-sm px-3 py-1 rounded-lg shadow-sm">
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
                        className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        onClick={() => setExpandedImage(null)}
                        className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-3 rounded-full shadow-lg"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Overlay (Mobile) */}
            {isMobile && sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`${
                isMobile 
                    ? `fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
                    : `relative transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-0'}`
            } bg-white border-r border-gray-200 flex flex-col overflow-hidden shadow-lg`}
            style={{ width: isMobile ? '320px' : undefined }}>
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Chat History</h2>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={createNewChat}
                            className="flex-1 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                            style={{ background: 'linear-gradient(135deg, #5045e6, #7c3aed)' }}
                        >
                            <Plus className="w-4 h-4" />
                            <span>New Chat</span>
                        </button>
                        <button
                            onClick={handleClearAllChats}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md"
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
                            className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between ${
                                currentSessionId === session.sessionId 
                                    ? 'bg-blue-50 border-2 border-blue-200 shadow-sm' 
                                    : 'hover:bg-gray-50 border border-transparent'
                            }`}
                            style={{
                                backgroundColor: currentSessionId === session.sessionId ? '#f0f0ff' : undefined,
                                borderColor: currentSessionId === session.sessionId ? '#5045e6' : undefined
                            }}
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate text-gray-800">{session.title}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(session.createdAt).toLocaleDateString()}
                                </p>
                                <div className="flex items-center space-x-2 mt-2">
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
                                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition-all text-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-4">
                        {(!sidebarOpen || isMobile) && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        )}
                        <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                            style={{ background: 'linear-gradient(135deg, #5045e6, #7c3aed)' }}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Saumya</h1>
                            <p className="text-sm text-gray-600">AI Design Assistant</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">Online</span>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    {currentSession?.conversation.length === 0 && !isGenerating ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center max-w-md">
                                <div 
                                    className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 text-white"
                                    style={{ background: 'linear-gradient(135deg, #5045e6, #7c3aed)' }}
                                >
                                    <Bot className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Start a New Conversation</h3>
                                <p className="text-gray-600 leading-relaxed">Hi! I'm Saumya, your AI room design companion. Describe what you want to create and I'll help bring your vision to life.</p>
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
                                        <div className={`flex items-start space-x-4 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                            {/* Avatar */}
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                message.role === 'user'
                                                    ? 'bg-gray-200 text-gray-700'
                                                    : 'text-white'
                                            }`}
                                            style={{
                                                background: message.role === 'assistant' ? 'linear-gradient(135deg, #5045e6, #7c3aed)' : undefined
                                            }}>
                                                {message.role === 'user' ? (
                                                    <User className="w-5 h-5" />
                                                ) : (
                                                    <Bot className="w-5 h-5" />
                                                )}
                                            </div>

                                            {/* Message Content */}
                                            <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                                <div className={`px-5 py-4 rounded-2xl max-w-2xl shadow-sm ${
                                                    message.role === 'user'
                                                        ? 'text-white'
                                                        : 'bg-white border border-gray-200 text-gray-800'
                                                }`}
                                                style={{
                                                    background: message.role === 'user' ? 'linear-gradient(135deg, #5045e6, #7c3aed)' : undefined
                                                }}>
                                                    {/* Message Images */}
                                                    {messageImages.length > 0 && (
                                                        <div className="mb-4 space-y-2">
                                                            {messageImages.map((imageSrc, imgIndex) => (
                                                                <img
                                                                    key={imgIndex}
                                                                    src={imageSrc}
                                                                    alt="Uploaded image"
                                                                    className="max-w-md rounded-xl shadow-sm"
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                    
                                                    {/* Message Text */}
                                                    <pre className="text-sm leading-relaxed whitespace-pre-wrap">{messageText}</pre>
                                                </div>

                                                {/* Products Selection UI - Show even during image generation */}
                                                {showProducts && (
                                                    <ProductsSelectionUI />
                                                )}
                                                {showProducts && (
                                                    <GenerateFromProductsUI />
                                                )}
                                                {/* Generated Images UI */}
                                                {showProducts && (
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
                                    <div className="flex items-start space-x-4 max-w-3xl">
                                        {/* Avatar */}
                                        <div 
                                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                                            style={{ background: 'linear-gradient(135deg, #5045e6, #7c3aed)' }}
                                        >
                                            <Bot className="w-5 h-5" />
                                        </div>

                                        {/* Loading Content */}
                                        <div className="flex flex-col items-start">
                                            <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-200 shadow-sm">
                                                <div className="flex items-center space-x-3 mb-4">
                                                    <div 
                                                        className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                                                        style={{ borderColor: '#5045e6', borderTopColor: 'transparent' }}
                                                    ></div>
                                                    <span className="text-gray-600 text-sm">Processing your request...</span>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5"></div>
                                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
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
                <div className="border-t border-gray-200 p-6 bg-white">
                    <div className="max-w-4xl mx-auto">
                        {/* Upload Preview */}
                        {uploadedImage && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-xl flex items-center space-x-4 border border-gray-200">
                                <img 
                                    src={URL.createObjectURL(uploadedImage)} 
                                    alt={uploadedImage.name}
                                    className="w-14 h-14 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">{uploadedImage.name}</p>
                                    <p className="text-xs text-gray-600">Ready to upload</p>
                                </div>
                                <button
                                    onClick={removeUploadedImage}
                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Message Input */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                            <div className="flex items-end space-x-4">
                                <div className="flex-1 relative">
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Describe what you want to create..."
                                        className="w-full bg-transparent text-gray-800 placeholder-gray-500 resize-none outline-none text-sm leading-relaxed min-h-[60px] max-h-32 pr-12"
                                        rows={2}
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-3 right-3 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                                    >
                                        <ImagePlus className="w-5 h-5" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={!prompt.trim() || isGenerating}
                                    className="text-white p-3 rounded-xl transition-all duration-200 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                                    style={{
                                        background: !prompt.trim() || isGenerating ? '#d1d5db' : 'linear-gradient(135deg, #5045e6, #7c3aed)'
                                    }}
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
                        <div className="flex flex-wrap items-center gap-3 mt-4">
                            <span className="text-sm text-gray-600 font-medium">Quick rooms:</span>
                            {[
                                { name: "Room 1", url: "/images/samples/rooms/room-001.jpg" },
                                { name: "Room 2", url: "/images/samples/rooms/room-002.jpg" },
                                { name: "Room 3", url: "/images/samples/rooms/room-003.jpg" },
                                { name: "Room 4", url: "/images/samples/rooms/room-004.jpg" },
                                { name: "Room 5", url: "/images/samples/rooms/room-005.jpg" }
                            ].map((room, index) => (
                                <div key={index} className="relative group">
                                    <button
                                        onClick={() => handleQuickRoomSelect(room.url, room.name)}
                                        className="relative w-16 h-12 bg-white hover:bg-gray-50 rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
                                    >
                                        <img
                                            src={room.url}
                                            alt={room.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                                    </button>
                                    
                                    {/* Hover enlarged image */}
                                    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20" style={{width: '360px'}}>
                                        <div className="bg-white rounded-xl p-3 shadow-xl border border-gray-200">
                                            <img
                                                src={room.url}
                                                alt={room.name}
                                                className="object-cover rounded-lg w-full"
                                            />
                                            <div className="text-sm text-gray-800 text-center mt-2 font-medium">{room.name}</div>
                                        </div>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-white"></div>
                                    </div>
                                </div>
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
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            <ImageModal />
        </div>
    );
};

export default DesignAgentChat;