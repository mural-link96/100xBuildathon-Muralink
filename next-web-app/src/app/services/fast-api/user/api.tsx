'use client';

import { fastApiService } from "../fastApiService";

interface UserUpdateParameters {
    name?: string;
    bio?: string;
    phone?: string;
    profile_image?: string;
    interested_in?: string[];
}

export class User {
    public async getProfile() {
        const result = await fastApiService.fastApiAuthenticated({
            method: 'GET',
            endpoint: '/api/v1/profile'
        });
        console.log(result);
        return result;
    }

    public async updateProfile(profileData: UserUpdateParameters) {
        console.log(profileData)
        const result = await fastApiService.fastApiAuthenticated({
            method: 'PUT',
            endpoint: '/api/v1/profile',
            body: profileData
        });

        return result;
    }

    public async uploadProfileImage(imageFile: File) {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('profile_image', imageFile);

        const result = await fastApiService.fastApiAuthenticated({
            method: 'POST',
            endpoint: '/api/v1/profile/upload-image',
            body: formData,
            headers: {
                // Don't set Content-Type for FormData, let the browser set it
            }
        });

        return result;
    }
}