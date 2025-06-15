// src/app/constants/index.ts

import { Sofa, Bed, ChefHat, Bath, UtensilsCrossed, MapPin, Users, Baby, TreePine } from 'lucide-react';
import { RoomType, InspirationImage, DesignStep } from '../types';

// Theme and design constants
export const THEME_COLORS = {
  primary: 'indigo-600',
  primaryHover: 'indigo-700',
  secondary: 'yellow-400',
  secondaryHover: 'yellow-300',
  accent: 'purple-500',
  background: 'gray-50',
  white: 'white',
  success: 'green-500',
  warning: 'yellow-500',
  error: 'red-500',
  info: 'blue-500'
} as const;

export const DESIGN_STEPS: DesignStep[] = [
  {
    number: "01",
    title: "Knowing you better",
    desc: "We decode your design DNA because design is personal to everyone",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop",
    color: "bg-blue-500"
  },
  {
    number: "02",
    title: "Instant Personalized designs",
    desc: "Receive 3D room design images with real products chosen just for you",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=300&fit=crop",
    color: "bg-orange-500"
  },
  {
    number: "03",
    title: "Shop & Transform",
    desc: "Purchase curated items and watch your space come to life",
    image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop",
    color: "bg-purple-500"
  }
];

export const ROOM_TYPES: RoomType[] = [
  { 
    name: 'Living Room', 
    icon: Sofa,
    description: 'Create a welcoming space for relaxation',
    category: 'living'
  },
  { 
    name: 'Bedroom', 
    icon: Bed,
    description: 'Design your perfect sleep sanctuary',
    category: 'bedroom'
  },
  { 
    name: 'Kitchen', 
    icon: ChefHat,
    description: 'Build a functional culinary workspace',
    category: 'kitchen'
  },
  { 
    name: 'Bathroom', 
    icon: Bath,
    description: 'Transform into a spa-like retreat',
    category: 'bathroom'
  },
  { 
    name: 'Dining Room', 
    icon: UtensilsCrossed,
    description: 'Create memorable dining experiences',
    category: 'living'
  },
  { 
    name: 'Hallway', 
    icon: MapPin,
    description: 'Make a striking first impression',
    category: 'other'
  },
  { 
    name: 'Guest Room', 
    icon: Users,
    description: 'Welcome visitors in comfort',
    category: 'bedroom'
  },
  { 
    name: "Children's Room", 
    icon: Baby,
    description: 'Create a playful learning environment',
    category: 'bedroom'
  },
  { 
    name: 'Outdoor Deck', 
    icon: TreePine,
    description: 'Extend your living space outdoors',
    category: 'outdoor'
  }
];

export const INSPIRATION_IMAGES: InspirationImage[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop",
    aspectRatio: "4:5",
    alt: "Modern minimalist living room",
    style: "Minimalist",
    tags: ["modern", "clean", "neutral"],
    category: "living"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=400&auto=format&fit=crop",
    aspectRatio: "2:3",
    alt: "Scandinavian bedroom design",
    style: "Scandinavian",
    tags: ["cozy", "wood", "nordic"],
    category: "bedroom"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop",
    aspectRatio: "4:3",
    alt: "Cozy reading nook",
    style: "Cozy",
    tags: ["reading", "comfort", "warm"],
    category: "living"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=400&fit=crop",
    aspectRatio: "1:1",
    alt: "Open concept kitchen",
    style: "Modern",
    tags: ["open", "sleek", "contemporary"],
    category: "kitchen"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=500&fit=crop",
    aspectRatio: "4:5",
    alt: "Contemporary dining space",
    style: "Contemporary",
    tags: ["elegant", "sophisticated", "dining"],
    category: "dining"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400&h=350&fit=crop",
    aspectRatio: "8:7",
    alt: "Neutral color palette",
    style: "Neutral",
    tags: ["calm", "beige", "serene"],
    category: "general"
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=450&fit=crop",
    aspectRatio: "8:9",
    alt: "Modern furniture arrangement",
    style: "Industrial",
    tags: ["metal", "exposed", "urban"],
    category: "living"
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=600&fit=crop",
    aspectRatio: "2:3",
    alt: "Vertical gallery wall",
    style: "Artistic",
    tags: ["gallery", "art", "creative"],
    category: "general"
  }
];

// Animation constants
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 750
} as const;

export const ANIMATION_DELAYS = {
  none: 0,
  short: 100,
  medium: 200,
  long: 400
} as const;

// File upload constants
export const FILE_UPLOAD = {
  maxSize: 10 * 1024 * 1024, // 10MB
  acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  acceptedExtensions: ['.jpg', '.jpeg', '.png', '.webp']
} as const;

// Chat constants
export const CHAT_CONFIG = {
  maxMessageLength: 2000,
  typingIndicatorDelay: 1000,
  autoScrollThreshold: 100,
  messageLoadLimit: 50
} as const;

// API endpoints
export const API_ENDPOINTS = {
  chat: '/api/chat',
  upload: '/api/upload',
  designs: '/api/designs',
  user: '/api/user',
  preferences: '/api/preferences'
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  userPreferences: 'muralink_user_prefs',
  chatHistory: 'muralink_chat_history',
  currentFlow: 'muralink_current_flow',
  theme: 'muralink_theme',
  onboarding: 'muralink_onboarding_complete'
} as const;

// Design styles
export const DESIGN_STYLES = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean lines, neutral colors, and uncluttered spaces',
    colors: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#BDBDBD'],
    tags: ['clean', 'simple', 'modern']
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    description: 'Cozy, functional design with natural materials',
    colors: ['#FFFFFF', '#F7F3E9', '#D4AF37', '#8B4513'],
    tags: ['cozy', 'wood', 'hygge']
  },
  {
    id: 'industrial',
    name: 'Industrial',
    description: 'Raw materials, exposed elements, and urban aesthetics',
    colors: ['#2F2F2F', '#8B4513', '#CD853F', '#A0522D'],
    tags: ['metal', 'concrete', 'urban']
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    description: 'Eclectic mix of patterns, colors, and textures',
    colors: ['#8B4513', '#DAA520', '#CD853F', '#F4A460'],
    tags: ['eclectic', 'colorful', 'textured']
  },
  {
    id: 'contemporary',
    name: 'Contemporary',
    description: 'Current trends with sleek, sophisticated elements',
    colors: ['#2C3E50', '#34495E', '#95A5A6', '#BDC3C7'],
    tags: ['sleek', 'sophisticated', 'current']
  }
] as const;

// Responsive breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

// Feature flags
export const FEATURES = {
  enableChat: true,
  enableUpload: true,
  enableDesignGeneration: true,
  enableShoppingIntegration: false,
  enableVoiceInput: false,
  enableRealTimeCollab: false
} as const;

// Error messages
export const ERROR_MESSAGES = {
  networkError: 'Network error. Please check your connection and try again.',
  fileTooBig: `File size must be less than ${FILE_UPLOAD.maxSize / (1024 * 1024)}MB.`,
  invalidFileType: 'Please upload a valid image file (JPG, PNG, WebP).',
  uploadFailed: 'Failed to upload file. Please try again.',
  chatError: 'Failed to send message. Please try again.',
  genericError: 'Something went wrong. Please try again.',
  sessionExpired: 'Your session has expired. Please refresh the page.'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  fileUploaded: 'File uploaded successfully!',
  messageSent: 'Message sent!',
  preferencesUpdated: 'Preferences updated successfully!',
  designGenerated: 'Your design has been generated!',
  feedbackSubmitted: 'Thank you for your feedback!'
} as const;

// Navigation routes
export const ROUTES = {
  home: '/',
  chat: '/chat',
  designs: '/designs',
  profile: '/profile',
  settings: '/settings',
  help: '/help',
  pricing: '/pricing'
} as const;

// Social media links
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/muralink',
  instagram: 'https://instagram.com/muralink',
  facebook: 'https://facebook.com/muralink',
  linkedin: 'https://linkedin.com/company/muralink'
} as const;

// Company information
export const COMPANY_INFO = {
  name: 'Muralink',
  tagline: 'Making interior design delightfully simple',
  email: 'hello@muralink.com',
  phone: '+1 (555) 123-4567',
  address: '123 Design Street, Creative City, CC 12345'
} as const;

// Default user settings
export const DEFAULT_USER_SETTINGS = {
  appearance: {
    theme: 'light' as const,
    primaryColor: THEME_COLORS.primary,
    fontSize: 'medium' as const
  },
  notifications: {
    email: true,
    push: true,
    marketing: false
  },
  privacy: {
    analytics: true,
    cookies: true,
    dataSharing: false
  }
} as const;

// Chat flow steps
export const CHAT_FLOW_STEPS = {
  CHAT: 'chat',
  ROOM_SELECTION: 'room-selection',
  SPACE_UPLOAD: 'space-upload',
  INSPIRATION: 'inspiration'
} as const;

// Aspect ratio mappings for images
export const ASPECT_RATIO_CLASSES = {
  '1:1': 'h-64',
  '4:3': 'h-48',
  '4:5': 'h-80',
  '2:3': 'h-96',
  '8:7': 'h-56',
  '8:9': 'h-72',
  '16:9': 'h-36'
} as const;