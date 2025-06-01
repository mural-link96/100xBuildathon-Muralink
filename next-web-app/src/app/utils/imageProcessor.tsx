export const toBase64 = (file: File | null): Promise<string> =>
	new Promise((resolve, reject) => {
		if (!file) {
			resolve('');
			return;
		}

		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = () => {
			const result = reader.result as string;
			const base64String = result.split(',')[1]?.trim() || '';
			resolve(base64String);
		};

		reader.onerror = () => reject(new Error('Failed to read file as base64'));
	});

export const imageUrlToBase64 = async (url: string): Promise<string> => {
	const response = await fetch(url);
	const blob = await response.blob();

	// Convert Blob to File
	const file = new File([blob], 'image_from_url', { type: blob.type });

	return await toBase64(file);
};
