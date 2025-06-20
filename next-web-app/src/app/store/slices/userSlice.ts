// src/store/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../services/fast-api/user/api';

interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  bio?: string;
  phone?: string;
  profile_image?: string;
  interested_in?: string[];
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isProfileModalOpen: boolean;
  lastProfileReminderShown: number | null;
  profileReminderDismissed: boolean;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
  isProfileModalOpen: false,
  lastProfileReminderShown: null,
  profileReminderDismissed: false,
};

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const userApi = new User();
      const response = await userApi.getProfile();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const userApi = new User();
      const response = await userApi.updateProfile(profileData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

// Async thunk for uploading profile image
export const uploadProfileImage = createAsyncThunk(
  'user/uploadProfileImage',
  async (imageFile: File, { rejectWithValue }) => {
    try {
      const userApi = new User();
      const response = await userApi.uploadProfileImage(imageFile);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload image');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfileModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isProfileModalOpen = action.payload;
    },
    setProfileReminderShown: (state) => {
      state.lastProfileReminderShown = Date.now();
    },
    dismissProfileReminder: (state) => {
      state.profileReminderDismissed = true;
    },
    resetProfileReminder: (state) => {
      state.profileReminderDismissed = false;
      state.lastProfileReminderShown = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = { ...state.profile, ...action.payload };
        state.error = null;
        state.isProfileModalOpen = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Upload image cases
      .addCase(uploadProfileImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.profile) {
          state.profile.profile_image = action.payload.profile_image;
        }
        state.error = null;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setProfileModalOpen,
  setProfileReminderShown,
  dismissProfileReminder,
  resetProfileReminder,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;