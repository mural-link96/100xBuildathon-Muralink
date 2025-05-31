const toBase64 = (file: File | null): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!file) {
      resolve(''); // or reject(new Error("No file provided"));
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

export default toBase64;
