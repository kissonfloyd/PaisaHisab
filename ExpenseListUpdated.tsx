import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useBudget } from '../context/BudgetContext';
import { Colors } from '../constants/Colors';
import { formatCurrency, formatDateNepali } from '../utils/helpers';
import { ExpenseCategories, Expense } from '../types';
import ReceiptViewer from './ReceiptViewer';
import { getImageDisplayUri } from '../utils/photoUtils';

const ExpenseList: React.FC = () => {
  const { currentBudget, expenses, deleteExpense } = useBudget();
  const [selectedReceipt, setSelectedReceipt] = useState<{
    photo: string;
    description: string;
  } | null>(null);

  const currentExpenses = expenses.filter(
    expense => expense.budgetId === currentBudget?.id
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleDeleteExpense = (expense: Expense) => {
    Alert.alert(
      'खर्च मेटाउनुहोस्',
      `के तपाईं "${expense.description}" खर्च मेटाउन चाहनुहुन्छ?`,
      [
        {
          text: 'रद्द गर्नुहोस्',
          style: 'cancel',
        },
        {
          text: 'मेटाउनुहोस्',
          style: 'destructive',
          onPress: () => deleteExpense(expense.id),
        },
      ]
    );
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, string> = {
      food: 'restaurant',
      transport: 'directions-car',
      entertainment: 'movie',
      shopping: 'shopping-bag',
      bills: 'receipt',
      other: 'category',
    };
    return iconMap[category] || 'category';
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseIcon}>
        <Icon 
          name={getCategoryIcon(item.category)} 
          size={24} 
          color={Colors.primary} 
        />
      </View>
      
      <View style={styles.expenseDetails}>
        <View style={styles.expenseHeader}>
          <Text style={styles.expenseDescription}>{item.description}</Text>
          {item.receiptPhoto && (
            <TouchableOpacity
              style={styles.receiptIndicator}
              onPress={() => setSelectedReceipt({
                photo: item.receiptPhoto!,
                description: item.description,
              })}
            >
              <Icon name="receipt" size={16} color={Colors.secondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.expenseMetadata}>
          <Text style={styles.expenseCategory}>
            {ExpenseCategories[item.category]}
          </Text>
          <Text style={styles.expenseDate}>
            {formatDateNepali(item.date)}
          </Text>
        </View>

        {/* Receipt thumbnail if available */}
        {item.receiptPhoto && (
          <TouchableOpacity
            style={styles.receiptThumbnailContainer}
            onPress={() => setSelectedReceipt({
              photo: item.receiptPhoto!,
              description: item.description,
            })}
          >
            <Image
              source={{ uri: getImageDisplayUri(item.receiptPhoto) }}
              style={styles.receiptThumbnail}
              resizeMode="cover"
            />
            <View style={styles.receiptOverlay}>
              <Icon name="zoom-in" size={16} color={Colors.white} />
            </View>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.expenseActions}>
        <Text style={styles.expenseAmount}>
          {formatCurrency(item.amount)}
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteExpense(item)}
        >
          <Icon name="delete" size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!currentBudget) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.cardTitle}>हालका खर्चहरू</Text>
        <Text style={styles.expenseCount}>
          कुल: {currentExpenses.length} खर्च
        </Text>
      </View>

      {currentExpenses.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="receipt-long" size={40} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>कुनै खर्च छैन</Text>
          <Text style={styles.emptyDescription}>
            तपाईंको पहिलो खर्च थप्नुहोस्
          </Text>
        </View>
      ) : (
        <FlatList
          data={currentExpenses}
          renderItem={renderExpenseItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      )}

      {/* Receipt Viewer Modal */}
      {selectedReceipt && (
        <ReceiptViewer
          visible={true}
          receiptPhoto={selectedReceipt.photo}
          expenseDescription={selectedReceipt.description}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  expenseCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginTop: 12,
    marginBottom: 4,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  expenseDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  receiptIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${Colors.secondary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  expenseMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  expenseCategory: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  expenseDate: {
    fontSize: 12,
    color: Colors.textLight,
  },
  receiptThumbnailContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  receiptThumbnail: {
    width: 60,
    height: 40,
    borderRadius: 4,
  },
  receiptOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseActions: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.error,
    marginBottom: 4,
  },
  deleteButton: {
    padding: 4,
  },
});

export default ExpenseList;