import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAds } from '../../context/AdContext';
import { Colors } from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

const interstitialAds = [
  {
    id: 1,
    title: 'प्रिमियम फिचरहरू अनलक गर्नुहोस्!',
    description: 'विज्ञापन हटाउनुहोस् र अधिक सुविधाहरू पाउनुहोस्',
    features: [
      'कुनै विज्ञापन छैन',
      'असीमित बजेट',
      'एडभान्स एनालिटिक्स',
      'डाटा एक्सपोर्ट',
      'प्राथमिकता सपोर्ट'
    ],
    price: 'रू ४९९ मात्र / महिना',
    gradient: ['#8b5cf6', '#ec4899'],
    icon: 'star',
  },
  {
    id: 2,
    title: 'स्पेशल अफर - ५०% छुट!',
    description: 'सीमित समयको लागि मात्र',
    features: [
      'पूर्ण एप बिना विज्ञापन',
      'सबै प्रिमियम सुविधाहरू',
      'जीवनभर अपडेट',
      '२४/७ कस्टमर सपोर्ट'
    ],
    price: 'रू २४९ मात्र (सामान्यतः रू ४९९)',
    gradient: ['#f59e0b', '#ef4444'],
    icon: 'local-offer',
  },
];

const InterstitialAd: React.FC = () => {
  const { showInterstitial, closeInterstitial, upgradeToPremium } = useAds();
  const [currentAd, setCurrentAd] = useState(0);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (showInterstitial) {
      setCurrentAd(Math.floor(Math.random() * interstitialAds.length));
      setCountdown(5);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showInterstitial]);

  const ad = interstitialAds[currentAd];

  const handleUpgrade = () => {
    upgradeToPremium();
    closeInterstitial();
  };

  return (
    <Modal
      visible={showInterstitial}
      animationType="fade"
      transparent={true}
      onRequestClose={countdown === 0 ? closeInterstitial : undefined}
    >
      <View style={styles.overlay}>
        <View style={[styles.adContainer, { backgroundColor: ad.gradient[0] }]}>
          {countdown === 0 && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeInterstitial}
            >
              <Icon name="close" size={24} color={Colors.white} />
            </TouchableOpacity>
          )}

          {countdown > 0 && (
            <View style={styles.countdown}>
              <Text style={styles.countdownText}>{countdown}s</Text>
            </View>
          )}

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Icon name={ad.icon} size={60} color={Colors.white} />
            </View>

            <Text style={styles.title}>{ad.title}</Text>
            <Text style={styles.description}>{ad.description}</Text>

            <View style={styles.features}>
              {ad.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Icon name="check-circle" size={16} color={Colors.white} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.price}>{ad.price}</Text>
            </View>

            <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
              <Text style={styles.upgradeButtonText}>अहिले अपग्रेड गर्नुहोस्</Text>
            </TouchableOpacity>

            {countdown === 0 && (
              <TouchableOpacity style={styles.laterButton} onPress={closeInterstitial}>
                <Text style={styles.laterButtonText}>पछि गर्नुहोस्</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.disclaimer}>
              विज्ञापन • कुनै पनि समय रद्द गर्न सकिन्छ
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  countdown: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.white,
  },
  content: {
    alignItems: 'center',
    marginTop: 16,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 20,
  },
  features: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  featureText: {
    fontSize: 14,
    color: Colors.white,
    marginLeft: 8,
    flex: 1,
  },
  priceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  upgradeButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 12,
    minWidth: 200,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  laterButton: {
    paddingVertical: 8,
    marginBottom: 16,
  },
  laterButtonText: {
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.8,
  },
  disclaimer: {
    fontSize: 10,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default InterstitialAd;