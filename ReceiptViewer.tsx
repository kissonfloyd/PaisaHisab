import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../constants/Colors';
import { getImageDisplayUri } from '../utils/photoUtils';

const { width, height } = Dimensions.get('window');

interface ReceiptViewerProps {
  visible: boolean;
  receiptPhoto: string;
  onClose: () => void;
  onDelete?: () => void;
  expenseDescription?: string;
}

const ReceiptViewer: React.FC<ReceiptViewerProps> = ({
  visible,
  receiptPhoto,
  onClose,
  onDelete,
  expenseDescription,
}) => {
  const handleDelete = () => {
    Alert.alert(
      'रसिद मेटाउनुहोस्',
      'के तपाईं यो रसिद फोटो मेटाउन चाहनुहुन्छ?',
      [
        {
          text: 'रद्द गर्नुहोस्',
          style: 'cancel',
        },
        {
          text: 'मेटाउनुहोस्',
          style: 'destructive',
          onPress: () => {
            onDelete?.();
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>रसिद फोटो</Text>
              {expenseDescription && (
                <Text style={styles.headerSubtitle} numberOfLines={1}>
                  {expenseDescription}
                </Text>
              )}
            </View>
            <View style={styles.headerActions}>
              {onDelete && (
                <TouchableOpacity style={styles.headerButton} onPress={handleDelete}>
                  <Icon name="delete" size={24} color={Colors.error} />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.headerButton} onPress={onClose}>
                <Icon name="close" size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: getImageDisplayUri(receiptPhoto) }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerButton} onPress={onClose}>
              <Icon name="check" size={20} color={Colors.white} />
              <Text style={styles.footerButtonText}>बन्द गर्नुहोस्</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50, // Account for status bar
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  image: {
    width: width - 32,
    height: height * 0.7,
    borderRadius: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  footerButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ReceiptViewer;