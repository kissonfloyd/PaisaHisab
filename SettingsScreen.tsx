import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAds } from '../context/AdContext';
import { Colors } from '../constants/Colors';

const SettingsScreen: React.FC = () => {
  const { isPremium, upgradeToPremium, resetPremium } = useAds();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleUpgrade = () => {
    Alert.alert(
      'प्रिमियम अपग्रेड',
      'प्रिमियम संस्करणमा अपग्रेड गर्न चाहनुहुन्छ?\n\n• कुनै विज्ञापन छैन\n• असीमित बजेट\n• एडभान्स एनालिटिक्स\n• डाटा एक्सपोर्ट\n\nमूल्य: रू ४९९/महिना',
      [
        { text: 'रद्द गर्नुहोस्', style: 'cancel' },
        { 
          text: 'अपग्रेड गर्नुहोस्', 
          onPress: () => {
            upgradeToPremium();
            Alert.alert('सफल', 'प्रिमियम सफलतापूर्वक सक्रिय भयो!');
          }
        },
      ]
    );
  };

  const handleResetPremium = () => {
    Alert.alert(
      'प्रिमियम रीसेट',
      'के तपाईं प्रिमियम स्थिति रीसेट गर्न चाहनुहुन्छ? (विकास उद्देश्यका लागि)',
      [
        { text: 'रद्द गर्नुहोस्', style: 'cancel' },
        { 
          text: 'रीसेट गर्नुहोस्', 
          onPress: () => {
            resetPremium();
            Alert.alert('रीसेट भयो', 'प्रिमियम स्थिति रीसेट भयो');
          }
        },
      ]
    );
  };

  const settingsOptions = [
    {
      title: 'सूचनाहरू',
      subtitle: 'बजेट अलर्ट र रिमाइन्डरहरू',
      icon: 'notifications',
      type: 'switch',
      value: notifications,
      onToggle: setNotifications,
    },
    {
      title: 'डार्क मोड',
      subtitle: 'गाढो रङको थिम प्रयोग गर्नुहोस्',
      icon: 'dark-mode',
      type: 'switch',
      value: darkMode,
      onToggle: setDarkMode,
    },
    {
      title: 'डाटा एक्सपोर्ट',
      subtitle: 'आफ्नो डाटा डाउनलोड गर्नुहोस्',
      icon: 'download',
      type: 'action',
      onPress: () => Alert.alert('जल्दै आउँदैछ', 'यो फिचर जल्दै उपलब्ध हुनेछ'),
    },
    {
      title: 'बैकअप र रिस्टोर',
      subtitle: 'आफ्नो डाटा सुरक्षित राख्नुहोस्',
      icon: 'backup',
      type: 'action',
      onPress: () => Alert.alert('जल्दै आउँदैछ', 'यो फिचर जल्दै उपलब्ध हुनेछ'),
    },
    {
      title: 'मद्दत र सहयोग',
      subtitle: 'सहायता र प्रश्नहरू',
      icon: 'help',
      type: 'action',
      onPress: () => Alert.alert('सम्पर्क', 'सहायताका लागि kissan.floyd@example.com मा सम्पर्क गर्नुहोस्'),
    },
    {
      title: 'एपको बारेमा',
      subtitle: 'संस्करण र जानकारी',
      icon: 'info',
      type: 'action',
      onPress: () => Alert.alert('स्मार्ट बजेट ट्र्याकर', 'संस्करण 1.0.0\n\nKissonFloyd द्वारा निर्मित\n\nनेपाली भाषामा व्यक्तिगत वित्त व्यवस्थापन'),
    },
  ];

  const renderPremiumSection = () => (
    <View style={styles.card}>
      {isPremium ? (
        <View style={styles.premiumActive}>
          <View style={styles.premiumHeader}>
            <Icon name="star" size={32} color={Colors.warning} />
            <View style={styles.premiumText}>
              <Text style={styles.premiumTitle}>प्रिमियम सदस्य</Text>
              <Text style={styles.premiumSubtitle}>सबै सुविधाहरू सक्रिय छन्</Text>
            </View>
          </View>
          
          <View style={styles.premiumFeatures}>
            <View style={styles.featureItem}>
              <Icon name="check-circle" size={16} color={Colors.success} />
              <Text style={styles.featureText}>कुनै विज्ञापन छैन</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="check-circle" size={16} color={Colors.success} />
              <Text style={styles.featureText}>असीमित बजेट</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="check-circle" size={16} color={Colors.success} />
              <Text style={styles.featureText}>एडभान्स एनालिटिक्स</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={handleResetPremium}>
            <Text style={styles.resetButtonText}>रीसेट गर्नुहोस् (टेस्टिङ)</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.premiumUpgrade}>
          <View style={styles.upgradeHeader}>
            <Icon name="workspace-premium" size={32} color={Colors.primary} />
            <View style={styles.upgradeText}>
              <Text style={styles.upgradeTitle}>प्रिमियममा अपग्रेड गर्नुहोस्</Text>
              <Text style={styles.upgradeSubtitle}>विज्ञापन हटाउनुहोस् र थप सुविधाहरू पाउनुहोस्</Text>
            </View>
          </View>

          <View style={styles.upgradeFeatures}>
            <Text style={styles.upgradeFeaturesTitle}>तपाईंले पाउनुहुनेछ:</Text>
            <View style={styles.featureItem}>
              <Icon name="block" size={16} color={Colors.primary} />
              <Text style={styles.featureText}>कुनै विज्ञापन छैन</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="all-inclusive" size={16} color={Colors.primary} />
              <Text style={styles.featureText}>असीमित बजेट</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="analytics" size={16} color={Colors.primary} />
              <Text style={styles.featureText}>एडभान्स एनालिटिक्स</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="file-download" size={16} color={Colors.primary} />
              <Text style={styles.featureText}>डाटा एक्सपोर्ट</Text>
            </View>
          </View>

          <View style={styles.pricingContainer}>
            <Text style={styles.price}>रू ४९९ / महिना</Text>
            <Text style={styles.priceNote}>कुनै पनि समय रद्द गर्न सकिन्छ</Text>
          </View>

          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
            <Icon name="star" size={20} color={Colors.white} />
            <Text style={styles.upgradeButtonText}>अहिले अपग्रेड गर्नुहोस्</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderSettingItem = (setting: typeof settingsOptions[0], index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.settingItem}
      onPress={setting.type === 'action' ? setting.onPress : undefined}
      disabled={setting.type === 'switch'}
    >
      <View style={styles.settingIcon}>
        <Icon name={setting.icon} size={24} color={Colors.primary} />
      </View>
      
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{setting.title}</Text>
        <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
      </View>
      
      <View style={styles.settingAction}>
        {setting.type === 'switch' ? (
          <Switch
            value={setting.value as boolean}
            onValueChange={setting.onToggle}
            trackColor={{ false: Colors.lightGray, true: Colors.primary }}
            thumbColor={setting.value ? Colors.white : Colors.gray}
          />
        ) : (
          <Icon name="chevron-right" size={24} color={Colors.textLight} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Premium Section */}
        {renderPremiumSection()}

        {/* Settings Options */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>सेटिङहरू</Text>
          <View style={styles.settingsList}>
            {settingsOptions.map(renderSettingItem)}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>
            स्मार्ट बजेट ट्र्याकर v1.0.0
          </Text>
          <Text style={styles.appInfoSubtext}>
            KissonFloyd द्वारा प्रेमसहित निर्मित 💙
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  premiumActive: {
    alignItems: 'center',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumText: {
    marginLeft: 12,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.success,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  premiumFeatures: {
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  premiumUpgrade: {
    alignItems: 'center',
  },
  upgradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  upgradeText: {
    marginLeft: 12,
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  upgradeSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  upgradeFeatures: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  upgradeFeaturesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.text,
  },
  pricingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  priceNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  upgradeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resetButton: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  resetButtonText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  settingsList: {
    gap: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  settingAction: {
    marginLeft: 16,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appInfoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  appInfoSubtext: {
    fontSize: 12,
    color: Colors.textLight,
  },
  bottomPadding: {
    height: 100,
  },
});

export default SettingsScreen;