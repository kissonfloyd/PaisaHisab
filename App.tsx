import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import WelcomeScreen from './src/screens/WelcomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { BudgetProvider } from './src/context/BudgetContext';
import { AdProvider } from './src/context/AdContext';
import { Colors } from './src/constants/Colors';

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched === null) {
        setIsFirstLaunch(true);
        await AsyncStorage.setItem('hasLaunched', 'true');
      } else {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
      setIsFirstLaunch(false);
    }
  };

  const handleWelcomeComplete = () => {
    setIsFirstLaunch(false);
  };

  if (isFirstLaunch === null) {
    return null; // Loading state
  }

  if (isFirstLaunch) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={Colors.primary}
        />
        <WelcomeScreen onComplete={handleWelcomeComplete} />
      </SafeAreaView>
    );
  }

  return (
    <BudgetProvider>
      <AdProvider>
        <NavigationContainer>
          <SafeAreaView style={styles.container}>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={Colors.primary}
            />
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName: string;

                  if (route.name === 'Dashboard') {
                    iconName = 'dashboard';
                  } else if (route.name === 'Analytics') {
                    iconName = 'analytics';
                  } else if (route.name === 'Settings') {
                    iconName = 'settings';
                  } else {
                    iconName = 'help';
                  }

                  return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.gray,
                tabBarStyle: {
                  backgroundColor: Colors.white,
                  borderTopColor: Colors.lightGray,
                },
                headerStyle: {
                  backgroundColor: Colors.primary,
                },
                headerTintColor: Colors.white,
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
              })}
            >
              <Tab.Screen 
                name="Dashboard" 
                component={DashboardScreen}
                options={{
                  title: 'बजेट ओभरभ्यू',
                  headerTitle: 'स्मार्ट बजेट ट्र्याकर',
                }}
              />
              <Tab.Screen 
                name="Analytics" 
                component={AnalyticsScreen}
                options={{
                  title: 'विश्लेषण',
                  headerTitle: 'खर्च विश्लेषण',
                }}
              />
              <Tab.Screen 
                name="Settings" 
                component={SettingsScreen}
                options={{
                  title: 'सेटिङहरू',
                  headerTitle: 'सेटिङहरू',
                }}
              />
            </Tab.Navigator>
          </SafeAreaView>
        </NavigationContainer>
      </AdProvider>
    </BudgetProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default App;