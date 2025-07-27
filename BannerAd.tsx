import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../constants/Colors';

const adData = [
  {
    id: 1,
    title: 'स्मार्ट इन्भेस्टमेन्ट',
    description: 'आफ्नो पैसा बढाउनुहोस् - सुरक्षित र भरपर्दो निवेश',
    cta: 'थप जान्नुहोस्',
    gradient: ['#3b82f6', '#8b5cf6'],
    url: 'https://example.com/investment',
  },
  {
    id: 2,
    title: 'डिजिटल बैंकिङ',
    description: 'घरमै बसेर सबै बैंकिङ सेवा - निःशुल्क खाता खोल्नुहोस्',
    cta: 'खाता खोल्नुहोस्',
    gradient: ['#10b981', '#14b8a6'],
    url: 'https://example.com/banking',
  },
  {
    id: 3,
    title: 'वित्तीय सल्लाह',
    description: 'विशेषज्ञबाट निःशुल्क वित्तीय सल्लाह लिनुहोस्',
    cta: 'परामर्श लिनुहोस्',
    gradient: ['#f59e0b', '#ef4444'],
    url: 'https://example.com/advice',
  },
];

const BannerAd: React.FC = () => {
  const [currentAd, setCurrentAd] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % adData.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const ad = adData[currentAd];

  const handleAdClick = async () => {
    try {
      await Linking.openURL(ad.url);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.adCard, { backgroundColor: ad.gradient[0] }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setIsVisible(false)}
        >
          <Icon name="close" size={18} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{ad.title}</Text>
            <Text style={styles.description}>{ad.description}</Text>
            
            <TouchableOpacity style={styles.ctaButton} onPress={handleAdClick}>
              <Text style={styles.ctaText}>{ad.cta}</Text>
              <Icon name="arrow-forward" size={16} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.indicators}>
            {adData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  {
                    backgroundColor: index === currentAd ? Colors.white : 'rgba(255, 255, 255, 0.5)'
                  }
                ]}
              />
            ))}
          </View>
        </View>

        <Text style={styles.adLabel}>विज्ञापन</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  adCard: {
    borderRadius: 12,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 12,
    lineHeight: 16,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  ctaText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text,
    marginRight: 4,
  },
  indicators: {
    flexDirection: 'row',
    gap: 4,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  adLabel: {
    position: 'absolute',
    bottom: 4,
    right: 8,
    fontSize: 10,
    color: Colors.white,
    opacity: 0.7,
  },
});

export default BannerAd;