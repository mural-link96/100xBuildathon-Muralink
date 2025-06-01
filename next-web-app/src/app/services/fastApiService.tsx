'use client';
import { getChatContext, updateChatContext, ChatContextEntry } from '@/app/utils/contextStorage';

interface DesignAgentParams {
	prompt?: string;
	image?: string;
	reference_images?: string[];
}

interface DesignAgentResponse {
	success: boolean;
	data?: any;
	error?: string;
}

export class FastAPIService {
	private readonly BASE_URL = process.env.NEXT_PUBLIC_FAST_API_URL;

	async designAgent({
		image,
		prompt,
		reference_images = []
	}: DesignAgentParams): Promise<DesignAgentResponse> {
		try {
			const url = `${this.BASE_URL}/api/v1/design-agent`;

			const requestHeader: Record<string, string> = {
				'Content-Type': 'application/json',
			};

			const currentContext = getChatContext();

			const requestBody = {
				"context": currentContext,
				"user_prompt": prompt,
				"user_image": image,
				"reference_images": reference_images.map(img => ({ image_base_64: img }))
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

			const newMessage: ChatContextEntry = {
				role: "user",
				content: [
					{
						type: "input_text",
						text: prompt
					},
					// Add main image if available
					...(image
					? [{
						type: "input_image",
						image_url: `data:image/jpeg;base64,${image}`
						}]
					: []),

					// Add reference images if available
					...reference_images.map(refImage => ({
						type: "input_image",
						image_url: `data:image/jpeg;base64,${refImage}`
					}))
				]
			};


			updateChatContext([newMessage]);

			const assistantReply: ChatContextEntry = data.conversation[0];

			updateChatContext([assistantReply]);

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
}

// Create a singleton instance
export const fastApiService = new FastAPIService();
