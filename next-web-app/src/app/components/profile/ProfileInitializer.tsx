// src/app/components/profile/ProfileInitializer.tsx
'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUserProfile } from '../../store/slices/userSlice';

export const ProfileInitializer: React.FC = () => {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const { profile, isLoading } = useAppSelector((state) => state.user);

  useEffect(() => {
    console.log('ProfileInitializer - Session status:', status);
    console.log('ProfileInitializer - Session:', !!session);
    console.log('ProfileInitializer - Profile loaded:', !!profile);
    console.log('ProfileInitializer - Is loading:', isLoading);

    // Fetch profile when user is authenticated and profile is not loaded
    if (session && !profile && !isLoading && status === 'authenticated') {
      console.log('ProfileInitializer - Fetching user profile...');
      dispatch(fetchUserProfile());
    }
  }, [session, profile, isLoading, status, dispatch]);

  // This component doesn't render anything
  return null;
};