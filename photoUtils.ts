import { Alert, PermissionsAndroid, Platform } from 'react-native';

export interface PhotoOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  includeBase64?: boolean;
}

const DEFAULT_OPTIONS: PhotoOptions = {
  maxWidth: 800,
  maxHeight: 600,
  quality: 0.8,
  includeBase64: true,
};

export const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission to take photos of receipts',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

export const selectPhotoSource = (): Promise<'camera' | 'gallery' | null> => {
  return new Promise((resolve) => {
    Alert.alert(
      'फोटो छान्नुहोस्',
      'तपाईं कहाँबाट फोटो लिन चाहनुहुन्छ?',
      [
        {
          text: 'रद्द गर्नुहोस्',
          style: 'cancel',
          onPress: () => resolve(null),
        },
        {
          text: 'ग्यालेरीबाट',
          onPress: () => resolve('gallery'),
        },
        {
          text: 'क्यामेराबाट',
          onPress: () => resolve('camera'),
        },
      ]
    );
  });
};

// Simplified photo picker for development - will be replaced with proper implementation
export const pickImage = async (
  source: 'camera' | 'gallery',
  options: PhotoOptions = DEFAULT_OPTIONS
): Promise<string | null> => {
  try {
    // For now, return a placeholder image data URL for testing
    // In production, this would use react-native-image-picker
    Alert.alert(
      'फोटो सेलेक्टर',
      `${source === 'camera' ? 'क्यामेरा' : 'ग्यालेरी'}बाट फोटो छनोट गरिनेछ। (डेभलपमेन्ट मोडमा प्लेसहोल्डर प्रयोग गरिएको छ)`,
      [
        { text: 'रद्द गर्नुहोस्', style: 'cancel', onPress: () => null },
        { 
          text: 'ठीक छ', 
          onPress: () => {
            // Return a placeholder receipt image for testing
            return generatePlaceholderReceipt();
          }
        },
      ]
    );

    return generatePlaceholderReceipt();
  } catch (error) {
    console.error('Error picking image:', error);
    Alert.alert('त्रुटि', 'फोटो लिन सकिएन। कृपया फेरि प्रयास गर्नुहोस्।');
    return null;
  }
};

const generatePlaceholderReceipt = (): string => {
  // Generate a simple SVG receipt as base64 for testing
  const svgReceipt = `
    <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="400" fill="#ffffff" stroke="#000" stroke-width="2"/>
      <text x="150" y="40" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold">रसिद</text>
      <line x1="20" y1="60" x2="280" y2="60" stroke="#000" stroke-width="1"/>
      <text x="30" y="90" font-family="Arial" font-size="12">दुकान: स्थानीय पसल</text>
      <text x="30" y="110" font-family="Arial" font-size="12">मिति: ${new Date().toLocaleDateString('ne-NP')}</text>
      <line x1="20" y1="130" x2="280" y2="130" stroke="#000" stroke-width="1"/>
      <text x="30" y="160" font-family="Arial" font-size="12">वस्तुहरू:</text>
      <text x="30" y="180" font-family="Arial" font-size="10">• चामल - रू 500</text>
      <text x="30" y="200" font-family="Arial" font-size="10">• दाल - रू 200</text>
      <text x="30" y="220" font-family="Arial" font-size="10">• तेल - रू 150</text>
      <line x1="20" y1="240" x2="280" y2="240" stroke="#000" stroke-width="1"/>
      <text x="30" y="270" font-family="Arial" font-size="12" font-weight="bold">कुल: रू 850</text>
      <text x="150" y="350" text-anchor="middle" font-family="Arial" font-size="10">धन्यवाद!</text>
    </svg>
  `;
  
  // Convert SVG to base64 data URL
  const base64Svg = btoa(unescape(encodeURIComponent(svgReceipt)));
  return `data:image/svg+xml;base64,${base64Svg}`;
};

export const deleteStoredImage = async (imagePath: string): Promise<boolean> => {
  try {
    // For now, just return true since we're using base64 strings
    // In production, this would handle file deletion
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

export const getImageDisplayUri = (imagePath: string): string => {
  // If it's already a base64 string, return as is
  if (imagePath.startsWith('data:image/')) {
    return imagePath;
  }
  
  // If it's a file path, return the file URI
  return `file://${imagePath}`;
};

export const compressImage = async (
  imagePath: string,
  quality: number = 0.6
): Promise<string | null> => {
  try {
    // For now, return the original path since we're using base64 strings
    // In production, this would compress the image
    return imagePath;
  } catch (error) {
    console.error('Error compressing image:', error);
    return null;
  }
};