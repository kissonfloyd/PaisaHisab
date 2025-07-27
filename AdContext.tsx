import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AdState } from '../types';

interface AdContextType extends AdState {
  incrementExpenseCount: () => void;
  closeInterstitial: () => void;
  upgradeToPremium: () => void;
  resetPremium: () => void;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export const useAds = () => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAds must be used within an AdProvider');
  }
  return context;
};

interface AdProviderProps {
  children: React.ReactNode;
}

export const AdProvider: React.FC<AdProviderProps> = ({ children }) => {
  const [adState, setAdState] = useState<AdState>({
    isPremium: false,
    expenseCount: 0,
    showInterstitial: false,
  });

  useEffect(() => {
    loadAdState();
  }, []);

  useEffect(() => {
    saveAdState();
  }, [adState]);

  const loadAdState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('adState');
      if (savedState) {
        setAdState(JSON.parse(savedState));
      }
    } catch (error) {
      console.error('Error loading ad state:', error);
    }
  };

  const saveAdState = async () => {
    try {
      await AsyncStorage.setItem('adState', JSON.stringify(adState));
    } catch (error) {
      console.error('Error saving ad state:', error);
    }
  };

  const incrementExpenseCount = () => {
    if (adState.isPremium) return;

    setAdState(prev => {
      const newCount = prev.expenseCount + 1;
      return {
        ...prev,
        expenseCount: newCount,
        showInterstitial: newCount % 5 === 0, // Show every 5 expenses
      };
    });
  };

  const closeInterstitial = () => {
    setAdState(prev => ({
      ...prev,
      showInterstitial: false,
    }));
  };

  const upgradeToPremium = () => {
    setAdState(prev => ({
      ...prev,
      isPremium: true,
      showInterstitial: false,
    }));
  };

  const resetPremium = () => {
    setAdState(prev => ({
      ...prev,
      isPremium: false,
    }));
  };

  return (
    <AdContext.Provider
      value={{
        ...adState,
        incrementExpenseCount,
        closeInterstitial,
        upgradeToPremium,
        resetPremium,
      }}
    >
      {children}
    </AdContext.Provider>
  );
};