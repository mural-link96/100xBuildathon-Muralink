// chatStorageUtils.ts

// Type definitions
export type ChatContextEntry = {
    role: 'user' | 'assistant';
    content: any;
};

export type ChatSession = {
    sessionId: string;
    createdAt: string;
    title?: string;
    conversation: ChatContextEntry[];
    products?: any[];
    generated_images?: any[];
    status?: string;
};

const STORAGE_KEY = 'chat_sessions';

// Get all chat sessions from localStorage
export const getAllChatSessions = (): ChatSession[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (err) {
        console.warn('Error reading chat sessions from localStorage:', err);
        return [];
    }
};

// Save all chat sessions to localStorage
const saveAllChatSessions = (sessions: ChatSession[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (err) {
        console.warn('Error saving chat sessions to localStorage:', err);
    }
};

// Get a session by its ID
export const getChatSession = (sessionId: string): ChatSession | undefined => {
    return getAllChatSessions().find(session => session.sessionId === sessionId);
};

// Create or update a chat session
export const upsertChatSession = (session: ChatSession) => {
    const sessions = getAllChatSessions();
    const index = sessions.findIndex(s => s.sessionId === session.sessionId);

    if (index > -1) {
        sessions[index] = session;
    } else {
        sessions.push(session);
    }

    saveAllChatSessions(sessions);
};

// Append new messages to a session's conversation
export const appendToChatSession = (sessionId: string, newEntries: ChatContextEntry[]) => {
    const session = getChatSession(sessionId);

    if (!session) {
        console.warn(`Session ${sessionId} not found.`);
        return;
    }

    session.conversation = [...session.conversation, ...newEntries];
    upsertChatSession(session);
};

// Update the products field of a session
export const updateChatSessionProducts = (sessionId: string, products: any[]) => {
    const session = getChatSession(sessionId);

    if (!session) {
        console.warn(`Session ${sessionId} not found for updating products.`);
        return;
    }

    session.products = products;
    upsertChatSession(session);
};

// Update the status field of a session
export const updateChatSessionStatus = (sessionId: string, status: string) => {
    const session = getChatSession(sessionId);

    if (!session) {
        console.warn(`Session ${sessionId} not found for updating status.`);
        return;
    }

    session.status = status;
    upsertChatSession(session);
};

// Optionally update any fields in a session using a partial object
export const updateChatSessionMeta = (sessionId: string, partialUpdate: Partial<ChatSession>) => {
    const session = getChatSession(sessionId);

    if (!session) {
        console.warn(`Session ${sessionId} not found for meta update.`);
        return;
    }

    const updatedSession: ChatSession = {
        ...session,
        ...partialUpdate,
        sessionId: session.sessionId, // Make sure sessionId stays intact
    };

    upsertChatSession(updatedSession);
};


// Delete a session by ID
export const deleteChatSession = (sessionId: string) => {
    const sessions = getAllChatSessions().filter(s => s.sessionId !== sessionId);
    saveAllChatSessions(sessions);
};

// Clear all sessions
export const clearAllChatSessions = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
        console.warn('Error clearing chat sessions from localStorage:', err);
    }
};