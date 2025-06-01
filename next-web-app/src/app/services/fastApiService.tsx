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

	async designAgent({
		currentContext,
		image,
		prompt
	}: DesignAgentParams): Promise<DesignAgentResponse> {
		try {
			const url = `${this.BASE_URL}/api/v1/design-agent`;

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

			const response = await fetch(url, options);

			if (response.status === 401) {
				throw new Error('Authentication required. Please log in to generate images.');
			}

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
			}

			const data = await response.json();

			return {
				success: true,
				data
			};
		} catch (error) {
			console.error('Error in designAgent:', error);
			return {
				success: false,
				data: null,
				error: error instanceof Error ? error.message : 'An error occurred'
			};
		}
	}

	async designAgentImage({
		context,
		user_image,
		product_image_urls
	}: DesignAgentImageParams): Promise<DesignAgentResponse> {
		try {
			const url = `${this.BASE_URL}/api/v1/design-agent/generate-image`;

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

			const response = await fetch(url, options);

			if (response.status === 401) {
				throw new Error('Authentication required. Please log in to generate images.');
			}

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
			}

			const data = await response.json();

			return {
				success: true,
				data
			};
		} catch (error) {
			console.error('Error in designAgentImage:', error);
			return {
				success: false,
				data: null,
				error: error instanceof Error ? error.message : 'An error occurred'
			};
		}
	}
}

// Create a singleton instance
export const fastApiService = new FastAPIService();
