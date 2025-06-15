// src/app/chat/page.tsx
'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  ChatSidebar, 
  ChatTopbar, 
  ChatArea, 
  RoomSelection, 
  SpaceUpload, 
  InspirationSelection,
  BudgetSelection 
} from '../components/chat';

// Types
interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'saumya';
  timestamp: Date;
  image?: string;
}

interface ChatHistoryItem {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  roomType: string;
}

type ChatFlowStep = 'chat' | 'room-selection' | 'space-upload' | 'inspiration' | 'budget';

interface ChatState {
  // UI State
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  currentStep: ChatFlowStep;
  
  // Chat State
  currentChatId: string | null;
  messages: ChatMessage[];
  chatHistory: ChatHistoryItem[];
  isLoading: boolean;
  
  // Flow State
  selectedRoom: string | null;
  uploadedFile: File | null;
  selectedInspiration: number[];
  budget: number;
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentStep: (step: ChatFlowStep) => void;
  setCurrentChatId: (id: string | null) => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setChatHistory: React.Dispatch<React.SetStateAction<ChatHistoryItem[]>>;
  setIsLoading: (loading: boolean) => void;
  setSelectedRoom: (room: string | null) => void;
  setUploadedFile: (file: File | null) => void;
  setSelectedInspiration: (inspiration: number[]) => void;
  setBudget: (budget: number) => void;
}

// Mock data
const INITIAL_CHAT_HISTORY: ChatHistoryItem[] = [
  {
    id: 'conv1',
    title: 'Modern Living Room Redesign',
    lastMessage: 'I love the mid-century modern suggestions!',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    roomType: 'Living Room'
  },
  {
    id: 'conv2',
    title: 'Cozy Bedroom Makeover',
    lastMessage: 'The color palette is perfect for relaxation.',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    roomType: 'Bedroom'
  },
  {
    id: 'conv3',
    title: 'Kitchen Island Ideas',
    lastMessage: 'Thank you for the storage suggestions!',
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    roomType: 'Kitchen'
  }
];

// Utility function
const generateId = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Context
const ChatContext = createContext<ChatState | undefined>(undefined);

const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};

// Provider
const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // UI State - Start with room selection instead of chat
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState<ChatFlowStep>('room-selection');
  
  // Chat State
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>(INITIAL_CHAT_HISTORY);
  const [isLoading, setIsLoading] = useState(false);
  
  // Flow State
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedInspiration, setSelectedInspiration] = useState<number[]>([]);
  const [budget, setBudget] = useState<number>(2500);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // On mobile, start with sidebar closed
        setIsSidebarOpen(false);
        setIsSidebarCollapsed(false);
      } else {
        // On desktop, keep sidebar open
        setIsSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const value: ChatState = {
    // UI State
    isSidebarOpen,
    isSidebarCollapsed,
    currentStep,
    
    // Chat State
    currentChatId,
    messages,
    chatHistory,
    isLoading,
    
    // Flow State
    selectedRoom,
    uploadedFile,
    selectedInspiration,
    budget,
    
    // Actions
    setSidebarOpen: setIsSidebarOpen,
    setSidebarCollapsed: setIsSidebarCollapsed,
    setCurrentStep,
    setCurrentChatId,
    setMessages,
    setChatHistory,
    setIsLoading,
    setSelectedRoom,
    setUploadedFile,
    setSelectedInspiration,
    setBudget
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Main Chat Interface Component
const ChatInterface: React.FC = () => {
  const {
    isSidebarOpen,
    isSidebarCollapsed,
    currentStep,
    currentChatId,
    messages,
    chatHistory,
    isLoading,
    selectedRoom,
    uploadedFile,
    selectedInspiration,
    budget,
    setSidebarOpen,
    setSidebarCollapsed,
    setCurrentStep,
    setCurrentChatId,
    setMessages,
    setChatHistory,
    setIsLoading,
    setSelectedRoom,
    setUploadedFile,
    setSelectedInspiration,
    setBudget
  } = useChatContext();

  // Handlers
  const handleToggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleToggleSidebarCollapse = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setCurrentStep('room-selection');
    // Reset flow state
    setSelectedRoom(null);
    setUploadedFile(null);
    setSelectedInspiration([]);
    setSidebarOpen(false);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setCurrentStep('chat');
    
    // Load messages for selected chat (mock implementation)
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setMessages([
        {
          id: 1,
          text: `Welcome back! Let's continue working on your ${chat.roomType} design.`,
          sender: "saumya",
          timestamp: new Date()
        }
      ]);
    }
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleSendMessage = (message: string, attachment?: File) => {
    const newMessage: ChatMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      image: attachment ? URL.createObjectURL(attachment) : undefined
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate AI response
    setIsLoading(true);
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: Date.now() + 1,
        text: `Thank you for your message! I'll help you create the perfect ${message.toLowerCase().includes('design') ? 'design' : 'space'} for your needs.`,
        sender: 'saumya',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleStartChatFlow = () => {
    setCurrentStep('room-selection');
    setCurrentChatId('new-flow');
  };

  const handleRoomSelect = (roomName: string) => {
    setSelectedRoom(roomName);
    setCurrentStep('space-upload');
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleUploadNext = () => {
    setCurrentStep('inspiration');
  };

  const handleUploadBack = () => {
    setCurrentStep('room-selection');
  };

  const handleToggleInspiration = (imageId: number) => {
    if (selectedInspiration.includes(imageId)) {
      setSelectedInspiration(selectedInspiration.filter(id => id !== imageId));
    } else {
      setSelectedInspiration([...selectedInspiration, imageId]);
    }
  };

  const handleInspirationNext = () => {
    // Go to budget selection
    setCurrentStep('budget');
  };

  const handleInspirationBack = () => {
    setCurrentStep('space-upload');
  };

  const handleBudgetChange = (newBudget: number) => {
    setBudget(newBudget);
  };

  const handleBudgetNext = () => {
    // Start the actual chat with all the context
    setCurrentStep('chat');
    const welcomeMessage: ChatMessage = {
      id: 1,
      text: `Perfect! I can see you want to redesign your ${selectedRoom} with a budget of ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(budget)} and you've shared ${selectedInspiration.length} inspiration${selectedInspiration.length !== 1 ? 's' : ''}. Let me create some personalized design ideas for you!`,
      sender: "saumya",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    
    // Create a new chat history entry
    const newChat: ChatHistoryItem = {
      id: `chat-${Date.now()}`,
      title: `${selectedRoom} Design`,
      lastMessage: welcomeMessage.text,
      timestamp: new Date(),
      roomType: selectedRoom || 'Room'
    };
    setChatHistory(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const handleBudgetBack = () => {
    setCurrentStep('inspiration');
  };

  const handleNavigateHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* Sidebar - Always render but control visibility */}
      <div className={`
        ${isSidebarOpen ? 'block' : 'hidden lg:block'}
        ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-80'}
        transition-all duration-300
      `}>
        <ChatSidebar
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebarCollapse}
          onClose={handleCloseSidebar}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          chatHistory={chatHistory}
          currentChatId={currentChatId}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <ChatTopbar
          onToggleSidebar={handleToggleSidebar}
          onNavigateHome={handleNavigateHome}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-y-scroll">
          {currentStep === 'chat' && (
            <ChatArea
              currentChatId={currentChatId}
              messages={messages}
              onSendMessage={handleSendMessage}
              onStartNewChat={handleNewChat}
              onStartChatFlow={handleStartChatFlow}
              isLoading={isLoading}
            />
          )}
          
          {currentStep === 'room-selection' && (
            <RoomSelection
              onSelectRoom={handleRoomSelect}
            />
          )}
          
          {currentStep === 'space-upload' && selectedRoom && (
            <SpaceUpload
              selectedRoom={selectedRoom}
              onUpload={handleFileUpload}
              onBack={handleUploadBack}
              onNext={handleUploadNext}
              uploadedFile={uploadedFile}
              onRemoveFile={handleRemoveFile}
            />
          )}
          
          {currentStep === 'inspiration' && (
            <InspirationSelection
              selectedInspiration={selectedInspiration}
              onToggleInspiration={handleToggleInspiration}
              onBack={handleInspirationBack}
              onNext={handleInspirationNext}
            />
          )}
          
          {currentStep === 'budget' && (
            <BudgetSelection
              budget={budget}
              onBudgetChange={handleBudgetChange}
              onBack={handleBudgetBack}
              onNext={handleBudgetNext}
              minBudget={300}
              maxBudget={10000}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Main Page Component
const ChatPage: React.FC = () => {
  // Add custom CSS for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideInUp {
        from { 
          opacity: 0;
          transform: translateY(30px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes slideInLeft {
        from { 
          opacity: 0;
          transform: translateX(-100%);
        }
        to { 
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes bounceIn {
        0% { 
          opacity: 0;
          transform: scale(0.3);
        }
        50% { 
          opacity: 1;
          transform: scale(1.05);
        }
        70% { 
          transform: scale(0.9);
        }
        100% { 
          opacity: 1;
          transform: scale(1);
        }
      }
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
      }
      .animate-slideInUp {
        animation: slideInUp 0.4s ease-out;
      }
      .animate-slideInLeft {
        animation: slideInLeft 0.3s ease-out;
      }
      .animate-bounceIn {
        animation: bounceIn 0.6s ease-out;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  );
};

export default ChatPage;