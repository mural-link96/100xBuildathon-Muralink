export type ChatContextEntry = {
    role: 'user' | 'assistant';
    content: any;
};

const STORAGE_KEY = 'chat_context';

export const getChatContext = (): ChatContextEntry[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (err) {
        console.warn('Error reading chat context from localStorage:', err);
        return [];
    }
};

export const updateChatContext = (newEntries: ChatContextEntry[]) => {
    try {
        const current = getChatContext();
        const updated = [...current, ...newEntries];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
        console.warn('Error updating chat context in localStorage:', err);
    }
};

export const clearChatContext = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
        console.warn('Error clearing chat context from localStorage:', err);
    }
};
