import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Main content */}
      <View style={styles.content}>
        {/* App icon */}
        <View style={styles.iconContainer}>
          <Icon name="account-balance-wallet" size={80} color={Colors.white} />
          <Text style={styles.currencySymbol}>रू</Text>
        </View>
        
        {/* Welcome text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>स्मार्ट बजेट ट्र्याकर</Text>
          <Text style={styles.subtitle}>Smart Budget Tracker</Text>
          
          <Text style={styles.welcomeMessage}>
            नमस्कार! तपाईंको व्यक्तिगत वित्त व्यवस्थापनको लागि यो एप बनाइएको छ।
          </Text>
          
          <Text style={styles.features}>
            • आफ्नो बजेट सिर्जना गर्नुहोस्{'\n'}
            • दैनिक खर्च ट्र्याक गर्नुहोस्{'\n'}
            • विस्तृत विश्लेषण हेर्नुहोस्{'\n'}
            • पूर्ण नेपाली समर्थन{'\n'}
            • इन्टरनेट बिना काम गर्छ
          </Text>
          
          <Text style={styles.attribution}>
            - KissonFloyd को शुभकामना सहित
          </Text>
        </View>
        
        {/* Start button */}
        <TouchableOpacity style={styles.startButton} onPress={onComplete}>
          <Text style={styles.startButtonText}>सुरु गर्नुहोस्</Text>
          <Icon name="arrow-forward" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Bottom decoration */}
      <View style={styles.bottomDecoration}>
        <Icon name="trending-up" size={30} color={Colors.primaryLight} />
        <Icon name="savings" size={25} color={Colors.primaryLight} />
        <Icon name="analytics" size={28} color={Colors.primaryLight} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    opacity: 0.95,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  currencySymbol: {
    position: 'absolute',
    bottom: -10,
    right: -5,
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 30,
  },
  welcomeMessage: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  features: {
    fontSize: 14,
    color: Colors.white,
    textAlign: 'left',
    lineHeight: 22,
    marginBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 12,
    width: '100%',
  },
  attribution: {
    fontSize: 14,
    color: Colors.white,
    fontStyle: 'italic',
    textAlign: 'center',
    opacity: 0.9,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginRight: 10,
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 50,
    opacity: 0.3,
  },
});

export default WelcomeScreen;