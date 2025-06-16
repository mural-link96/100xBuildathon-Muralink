// src/app/types/index.ts

import { LucideIcon } from 'lucide-react';

// Chat related types
export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'saumya';
  timestamp: Date;
  image?: string;
  attachments?: Attachment[];
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  roomType: string;
  tags?: string[];
  isPinned?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'other';
  size: number;
}

// Room and design types
export interface RoomType {
  name: string;
  icon: LucideIcon;
  description?: string;
  category?: 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'outdoor' | 'other';
}

export interface InspirationImage {
  id: number;
  url: string;
  aspectRatio: string;
  alt: string;
  style?: string;
  tags?: string[];
  category?: string;
}

export interface DesignStep {
  number: string;
  title: string;
  desc: string;
  image: string;
  color: string;
}

// User and app state types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  credits: number;
  plan: 'free' | 'premium' | 'enterprise';
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  autoSave: boolean;
  language: string;
}

// Flow and navigation types
export type ChatFlowStep = 'chat' | 'room-selection' | 'space-upload' | 'inspiration';

export interface FlowState {
  currentStep: ChatFlowStep;
  selectedRoom: string | null;
  uploadedFile: File | null;
  selectedInspiration: number[];
  preferences: Record<string, any>;
}

// UI component types
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: LucideIcon;
  [key: string]: any;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  title?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

// Animation types
export interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export interface SlideDirection {
  direction?: 'left' | 'right' | 'up' | 'down';
}

// API and data types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DesignResponse {
  id: string;
  roomType: string;
  style: string;
  images: string[];
  recommendations: ProductRecommendation[];
  colors: ColorPalette;
  description: string;
}

export interface ProductRecommendation {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  url: string;
  inStock: boolean;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string[];
  name: string;
}

// Form types
export interface ContactFormData {
  name: string;
  email: string;
  message?: string;
  phone?: string;
}

export interface PreferencesFormData {
  style: string[];
  budget: string;
  timeline: string;
  priority: string;
  special_requirements?: string;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

// Navigation types
export interface NavigationItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  badge?: string | number;
  children?: NavigationItem[];
}

// Toast/Notification types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  category?: string;
  style?: string[];
  priceRange?: [number, number];
  dateRange?: [Date, Date];
  tags?: string[];
}

export interface SortOption {
  value: string;
  label: string;
  direction: 'asc' | 'desc';
}

// Settings types
export interface AppSettings {
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    fontSize: 'small' | 'medium' | 'large';
  };
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    analytics: boolean;
    cookies: boolean;
    dataSharing: boolean;
  };
}

// Export commonly used type unions
export type Theme = 'light' | 'dark' | 'auto';
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type UserPlan = 'free' | 'premium' | 'enterprise';
export type MessageSender = 'user' | 'saumya';
export type AttachmentType = 'image' | 'document' | 'other';