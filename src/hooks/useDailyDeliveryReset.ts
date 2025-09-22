// hooks/useDailyDeliveryReset.ts - Minimal Production Version
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppState } from 'react-native';
import type { AppDispatch } from '../store';
import { checkDailyReset } from '../store/consumersSlice';

export const useDailyDeliveryReset = () => {
  const dispatch = useDispatch<AppDispatch>();
  const lastCheckRef = useRef<string>(new Date().toISOString().split('T')[0]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const checkDateChange = () => {
      const today = new Date().toISOString().split('T')[0];
      if (today !== lastCheckRef.current) {
        lastCheckRef.current = today;
        dispatch(checkDailyReset());
      }
    };

    // Check every 5 minutes
    intervalRef.current = setInterval(checkDateChange, 5 * 60 * 1000);

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        checkDateChange();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Initial check
    checkDateChange();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      subscription?.remove();
    };
  }, [dispatch]);
};
