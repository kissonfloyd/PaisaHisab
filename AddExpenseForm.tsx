import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useBudget } from '../context/BudgetContext';
import { useAds } from '../context/AdContext';
import { Colors } from '../constants/Colors';
import { ExpenseCategories, ExpenseCategory } from '../types';
import { selectPhotoSource, pickImage, getImageDisplayUri } from '../utils/photoUtils';

const AddExpenseForm: React.FC = () => {
  const { currentBudget, addExpense } = useBudget();
  const { incrementExpenseCount } = useAds();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [receiptPhoto, setReceiptPhoto] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!currentBudget) {
      Alert.alert('त्रुटि', 'कृपया पहिले बजेट सिर्जना गर्नुहोस्');
      return;
    }

    if (!description.trim() || !amount.trim()) {
      Alert.alert('त्रुटि', 'कृपया सबै फिल्डहरू भर्नुहोस्');
      return;
    }

    const expenseAmount = parseFloat(amount);
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      Alert.alert('त्रुटि', 'कृपया सही रकम प्रविष्ट गर्नुहोस्');
      return;
    }

    try {
      await addExpense({
        budgetId: currentBudget.id,
        description: description.trim(),
        amount: expenseAmount,
        category,
        date: new Date().toISOString().split('T')[0],
        receiptPhoto: receiptPhoto || undefined,
      });

      // Reset form
      setDescription('');
      setAmount('');
      setCategory('other');
      setReceiptPhoto(null);
      
      // Increment expense count for ads
      incrementExpenseCount();
      
      Alert.alert('सफल', 'खर्च सफलतापूर्वक थपियो!');
    } catch (error) {
      Alert.alert('त्रुटि', 'खर्च थप्न सकिएन');
    }
  };

  const handleAddPhoto = async () => {
    try {
      const source = await selectPhotoSource();
      if (!source) return;

      const photoUri = await pickImage(source, {
        maxWidth: 800,
        maxHeight: 600,
        quality: 0.7,
        includeBase64: true,
      });

      if (photoUri) {
        setReceiptPhoto(photoUri);
      }
    } catch (error) {
      console.error('Error adding photo:', error);
      Alert.alert('त्रुटि', 'फोटो थप्न सकिएन। कृपया फेरि प्रयास गर्नुहोस्।');
    }
  };

  if (!currentBudget) {
    return (
      <View style={styles.card}>
        <View style={styles.emptyState}>
          <Icon name="add-circle-outline" size={40} color={Colors.textLight} />
          <Text style={styles.emptyText}>
            खर्च थप्न पहिले बजेट सिर्जना गर्नुहोस्
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>नयाँ खर्च थप्नुहोस्</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>विवरण</Text>
        <TextInput
          style={styles.input}
          placeholder="तपाईंले के मा खर्च गर्नुभयो?"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={Colors.textLight}
        />

        <Text style={styles.label}>रकम (रुपैयाँमा)</Text>
        <TextInput
          style={styles.input}
          placeholder="खर्च भएको रकम"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholderTextColor={Colors.textLight}
        />

        <Text style={styles.label}>श्रेणी</Text>
        <TouchableOpacity
          style={styles.categorySelector}
          onPress={() => setShowCategoryPicker(!showCategoryPicker)}
        >
          <Text style={styles.categoryText}>
            {ExpenseCategories[category]}
          </Text>
          <Icon 
            name={showCategoryPicker ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
            size={24} 
            color={Colors.textSecondary} 
          />
        </TouchableOpacity>

        {showCategoryPicker && (
          <View style={styles.categoryPicker}>
            {(Object.entries(ExpenseCategories) as [ExpenseCategory, string][]).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.categoryOption,
                  category === key && styles.selectedCategory
                ]}
                onPress={() => {
                  setCategory(key);
                  setShowCategoryPicker(false);
                }}
              >
                <Text style={[
                  styles.categoryOptionText,
                  category === key && styles.selectedCategoryText
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Receipt Photo Section */}
        <Text style={styles.label}>रसिद फोटो (वैकल्पिक)</Text>
        <View style={styles.photoSection}>
          {receiptPhoto ? (
            <View style={styles.photoContainer}>
              <Image 
                source={{ uri: getImageDisplayUri(receiptPhoto) }} 
                style={styles.receiptImage} 
                resizeMode="cover"
              />
              <View style={styles.photoActions}>
                <TouchableOpacity 
                  style={styles.photoActionButton}
                  onPress={handleAddPhoto}
                >
                  <Icon name="edit" size={16} color={Colors.primary} />
                  <Text style={styles.photoActionText}>बदल्नुहोस्</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.photoActionButton, styles.deleteButton]}
                  onPress={() => setReceiptPhoto(null)}
                >
                  <Icon name="delete" size={16} color={Colors.error} />
                  <Text style={[styles.photoActionText, { color: Colors.error }]}>हटाउनुहोस्</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
              <Icon name="add-a-photo" size={32} color={Colors.textLight} />
              <Text style={styles.addPhotoText}>रसिद फोटो थप्नुहोस्</Text>
              <Text style={styles.addPhotoSubtext}>फोटो खिच्नुहोस् वा ग्यालेरीबाट छान्नुहोस्</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Icon name="add" size={20} color={Colors.white} />
          <Text style={styles.submitButtonText}>खर्च थप्नुहोस्</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.text,
  },
  categoryPicker: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    backgroundColor: Colors.white,
    marginTop: -8,
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  selectedCategory: {
    backgroundColor: Colors.primary,
  },
  categoryOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedCategoryText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  photoSection: {
    marginBottom: 16,
  },
  photoContainer: {
    alignItems: 'center',
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  photoActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  deleteButton: {
    borderColor: Colors.error,
  },
  photoActionText: {
    fontSize: 12,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  addPhotoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  addPhotoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 8,
  },
  addPhotoSubtext: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default AddExpenseForm;