// src/app/hooks/useProfileReminder.ts
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchUserProfile, 
  setProfileReminderShown, 
  setProfileModalOpen 
} from '../store/slices/userSlice';

const REMINDER_DURATION = 20000; // 20 seconds
const REMINDER_INTERVAL = 3600000; // 1 hour in milliseconds

export const useProfileReminder = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { 
    profile, 
    lastProfileReminderShown, 
    profileReminderDismissed,
    isLoading 
  } = useAppSelector((state) => state.user);
  
  const [showReminder, setShowReminder] = useState(false);
  const [reminderTimer, setReminderTimer] = useState<NodeJS.Timeout | null>(null);

  // Debug logging
  console.log('useProfileReminder - session:', !!session);
  console.log('useProfileReminder - profile:', profile);
  console.log('useProfileReminder - isLoading:', isLoading);

  // Fetch profile when user is authenticated and profile is not loaded
  useEffect(() => {
    if (session && !profile && !isLoading) {
      console.log('Fetching user profile...');
      dispatch(fetchUserProfile());
    }
  }, [session, profile, isLoading, dispatch]);

  // Check if reminder should be shown
  useEffect(() => {
    if (!session || profileReminderDismissed || isLoading) {
      console.log('Skipping reminder check:', { session: !!session, profileReminderDismissed, isLoading });
      return;
    }

    // Wait a bit for profile to load if it's still loading
    const checkTimer = setTimeout(() => {
      const shouldShowReminder = () => {
        console.log('Checking if reminder should show...');
        
        // Check if name is empty in DB (not using Google fallback for reminder logic)
        const dbName = profile?.name?.trim();
        console.log('DB name:', dbName);
        
        if (!dbName) {
          const now = Date.now();
          
          // If never shown before, show immediately
          if (!lastProfileReminderShown) {
            console.log('Never shown before, showing reminder');
            return true;
          }
          
          // If shown before, check if 1 hour has passed
          if (now - lastProfileReminderShown >= REMINDER_INTERVAL) {
            console.log('1 hour passed, showing reminder again');
            return true;
          }
        }
        
        console.log('Not showing reminder');
        return false;
      };

      if (shouldShowReminder()) {
        console.log('Showing profile reminder');
        setShowReminder(true);
        dispatch(setProfileReminderShown());
        
        // Auto-hide reminder after 20 seconds
        const timer = setTimeout(() => {
          console.log('Auto-hiding reminder after 20 seconds');
          setShowReminder(false);
        }, REMINDER_DURATION);
        
        setReminderTimer(timer);
      }
    }, 1000); // Wait 1 second for profile to potentially load

    return () => {
      clearTimeout(checkTimer);
      if (reminderTimer) {
        clearTimeout(reminderTimer);
      }
    };
  }, [profile, session, lastProfileReminderShown, profileReminderDismissed, dispatch, isLoading]);

  const handleCompleteProfile = () => {
    console.log('Complete profile clicked');
    setShowReminder(false);
    if (reminderTimer) {
      clearTimeout(reminderTimer);
    }
    dispatch(setProfileModalOpen(true));
  };

  const handleDismissReminder = () => {
    console.log('Dismiss reminder clicked');
    setShowReminder(false);
    if (reminderTimer) {
      clearTimeout(reminderTimer);
    }
  };

  // Get display name with fallback to Google name
  const getDisplayName = () => {
    const dbName = profile?.name?.trim();
    const googleName = session?.user?.name?.trim();
    return dbName || googleName || 'User';
  };

  return {
    showReminder,
    handleCompleteProfile,
    handleDismissReminder,
    profile,
    isLoading,
    displayName: getDisplayName(),
  };
};