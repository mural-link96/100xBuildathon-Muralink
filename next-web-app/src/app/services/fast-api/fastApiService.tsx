import { getSession } from "next-auth/react";

interface FastApiParams {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    endpoint: string;
    body?: any;
    headers?: Record<string, string>;
}

class FastApiService {
    private baseURL: string;

    constructor() {
        this.baseURL = process.env.NEXT_PUBLIC_FAST_API_URL || '';
    }

    async fastApiAuthenticated(params: FastApiParams) {
        // Get the current session to access the backend token
        const session = await getSession();
        
        if (!session) {
            throw new Error('No active session found');
        }

        const backendAccessToken = (session as any)?.backendAccessToken;
        
        if (!backendAccessToken) {
            throw new Error('No backend access token found in session');
        }

        const requestHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${backendAccessToken}`,
            ...params.headers
        };

        const requestOptions: RequestInit = {
            method: params.method,
            headers: requestHeaders,
        };

        if (params.body && params.method !== 'GET') {
            requestOptions.body = JSON.stringify(params.body);
        }

        let response: Response;
        
        try {
            response = await fetch(`${this.baseURL}${params.endpoint}`, requestOptions);
        } catch (error) {
            // Network errors, timeouts, etc.
            console.error('FastAPI network request failed:', error);
            throw error;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            // Check for insufficient credits patterns before throwing error
            const creditErrorPatterns = [
                'insufficient credits',
                'not enough credits',
                'credit limit exceeded',
                'payment required',
                'credits exhausted',
                'insufficient balance'
            ];
            
            const isInsufficientCredits = creditErrorPatterns.some(pattern => 
                (errorData.detail || '').toLowerCase().includes(pattern)
            ) || response.status === 403 || errorData.insufficient_credits;
            
            // For insufficient credits, return a special response instead of throwing
            if (isInsufficientCredits) {
                return {
                    insufficient_credits: true,
                    error_type: 'insufficient_credits',
                    message: errorData.detail || 'Insufficient credits',
                    status: response.status
                };
            }
            
            // Create enhanced error object with response details for other errors
            const enhancedError = new Error(errorData.detail || `HTTP error! status: ${response.status}`) as any;
            enhancedError.status = response.status;
            enhancedError.response = errorData;
            enhancedError.statusText = response.statusText;
            
            throw enhancedError;
        }

        return await response.json();
    }

    async fastApiPublic(params: FastApiParams) {
        const requestHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            ...params.headers
        };

        const requestOptions: RequestInit = {
            method: params.method,
            headers: requestHeaders,
        };

        if (params.body && params.method !== 'GET') {
            requestOptions.body = JSON.stringify(params.body);
        }

        let response: Response;
        
        try {
            response = await fetch(`${this.baseURL}${params.endpoint}`, requestOptions);
        } catch (error) {
            // Network errors, timeouts, etc.
            console.error('FastAPI public network request failed:', error);
            throw error;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            // Check for insufficient credits patterns before throwing error
            const creditErrorPatterns = [
                'insufficient credits',
                'not enough credits',
                'credit limit exceeded',
                'payment required',
                'credits exhausted',
                'insufficient balance'
            ];
            
            const isInsufficientCredits = creditErrorPatterns.some(pattern => 
                (errorData.detail || '').toLowerCase().includes(pattern)
            ) || response.status === 402 || errorData.insufficient_credits;
            
            // For insufficient credits, return a special response instead of throwing
            if (isInsufficientCredits) {
                return {
                    insufficient_credits: true,
                    error_type: 'insufficient_credits',
                    message: errorData.detail || 'Insufficient credits',
                    status: response.status
                };
            }
            
            // Create enhanced error object with response details for other errors
            const enhancedError = new Error(errorData.detail || `HTTP error! status: ${response.status}`) as any;
            enhancedError.status = response.status;
            enhancedError.response = errorData;
            enhancedError.statusText = response.statusText;
            
            throw enhancedError;
        }

        return await response.json();
    }
}

export const fastApiService = new FastApiService();