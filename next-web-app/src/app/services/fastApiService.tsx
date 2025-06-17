'use client';

interface DesignAgentParams {
	currentContext?: any
	prompt?: string;
	image?: string;
}

export interface DesignAgentImageParams {
	context: any;
	user_image: string;
	product_image_urls: string[];
}

interface DesignAgentResponse {
	success: boolean;
	data?: any;
	error?: string;
}

export class FastAPIService {
	private readonly BASE_URL = process.env.NEXT_PUBLIC_FAST_API_URL;
	private readonly BACKUP_URL = process.env.NEXT_PUBLIC_FAST_API_BACKUP_URL;

	private async makeRequest(url: string, options: RequestInit): Promise<Response> {
		const response = await fetch(url, options);
		
		if (response.status === 401) {
			throw new Error('Authentication required. Please log in to generate images.');
		}

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
		}

		return response;
	}

	async designAgent({
		currentContext,
		image,
		prompt
	}: DesignAgentParams): Promise<DesignAgentResponse> {
		const requestHeader: Record<string, string> = {
			'Content-Type': 'application/json',
		};

		const requestBody = {
			"context": currentContext,
			"user_prompt": prompt,
			"user_image": image
		};

		const options = {
			method: 'POST',
			headers: requestHeader,
			body: JSON.stringify(requestBody)
		};

		// Try BASE_URL first
		try {
			const url = `${this.BASE_URL}/api/v1/design-agent`;
			const response = await this.makeRequest(url, options);
			const data = await response.json();

			return {
				success: true,
				data
			};
		} catch (primaryError) {
			console.warn('Primary URL failed, trying backup:', primaryError);
			
			// Try BACKUP_URL if BASE_URL fails
			try {
				if (!this.BACKUP_URL) {
					throw new Error('No backup URL configured');
				}
				
				const backupUrl = `${this.BACKUP_URL}/api/v1/design-agent`;
				const response = await this.makeRequest(backupUrl, options);
				const data = await response.json();

				return {
					success: true,
					data
				};
			} catch (backupError) {
				console.error('Both primary and backup URLs failed:', {
					primary: primaryError,
					backup: backupError
				});
				
				return {
					success: false,
					data: null,
					error: backupError instanceof Error ? backupError.message : 'Both primary and backup services are unavailable'
				};
			}
		}
	}

	async designAgentImage({
		context,
		user_image,
		product_image_urls
	}: DesignAgentImageParams): Promise<DesignAgentResponse> {
		const requestHeader: Record<string, string> = {
			'Content-Type': 'application/json',
		};

		const requestBody = {
			"context": context,
			"user_image": user_image,
			"product_image_urls": product_image_urls
		};

		const options = {
			method: 'POST',
			headers: requestHeader,
			body: JSON.stringify(requestBody)
		};

		// Try BASE_URL first
		try {
			const url = `${this.BASE_URL}/api/v1/design-agent/generate-image`;
			const response = await this.makeRequest(url, options);
			const data = await response.json();

			return {
				success: true,
				data
			};
		} catch (primaryError) {
			console.warn('Primary URL failed, trying backup:', primaryError);
			
			// Try BACKUP_URL if BASE_URL fails
			try {
				if (!this.BACKUP_URL) {
					throw new Error('No backup URL configured');
				}
				
				const backupUrl = `${this.BACKUP_URL}/api/v1/design-agent/generate-image`;
				const response = await this.makeRequest(backupUrl, options);
				const data = await response.json();

				return {
					success: true,
					data
				};
			} catch (backupError) {
				console.error('Both primary and backup URLs failed:', {
					primary: primaryError,
					backup: backupError
				});
				
				return {
					success: false,
					data: null,
					error: backupError instanceof Error ? backupError.message : 'Both primary and backup services are unavailable'
				};
			}
		}
	}
}

// Create a singleton instance
export const fastApiService = new FastAPIService();