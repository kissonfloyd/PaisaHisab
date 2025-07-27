import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useBudget } from '../context/BudgetContext';
import { Colors } from '../constants/Colors';
import { formatCurrency } from '../utils/helpers';

const BudgetOverview: React.FC = () => {
  const { budgets, currentBudget, addBudget, setCurrentBudget, expenses } = useBudget();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [budgetName, setBudgetName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  const currentExpenses = expenses.filter(
    expense => expense.budgetId === currentBudget?.id
  );
  const totalSpent = currentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingAmount = (currentBudget?.amount || 0) - totalSpent;
  const spentPercentage = currentBudget ? (totalSpent / currentBudget.amount) * 100 : 0;

  const handleCreateBudget = async () => {
    if (!budgetName.trim() || !budgetAmount.trim()) {
      Alert.alert('त्रुटि', 'कृपया सबै फिल्डहरू भर्नुहोस्');
      return;
    }

    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('त्रुटि', 'कृपया सही रकम प्रविष्ट गर्नुहोस्');
      return;
    }

    try {
      await addBudget({
        name: budgetName,
        amount: amount,
      });
      setBudgetName('');
      setBudgetAmount('');
      setShowCreateForm(false);
      Alert.alert('सफल', 'बजेट सफलतापूर्वक सिर्जना भयो!');
    } catch (error) {
      Alert.alert('त्रुटि', 'बजेट सिर्जना गर्न सकिएन');
    }
  };

  if (!currentBudget && budgets.length === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.emptyState}>
          <Icon name="account-balance-wallet" size={60} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>कुनै बजेट छैन</Text>
          <Text style={styles.emptyDescription}>
            खर्च ट्र्याक गर्न पहिले बजेट सिर्जना गर्नुहोस्
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreateForm(true)}
          >
            <Icon name="add" size={20} color={Colors.white} />
            <Text style={styles.createButtonText}>नयाँ बजेट सिर्जना गर्नुहोस्</Text>
          </TouchableOpacity>
        </View>

        {showCreateForm && (
          <View style={styles.createForm}>
            <Text style={styles.formTitle}>नयाँ बजेट सिर्जना गर्नुहोस्</Text>
            <TextInput
              style={styles.input}
              placeholder="बजेट नाम (जस्तै: यो महिनाको बजेट)"
              value={budgetName}
              onChangeText={setBudgetName}
              placeholderTextColor={Colors.textLight}
            />
            <TextInput
              style={styles.input}
              placeholder="बजेट रकम (रुपैयाँमा)"
              value={budgetAmount}
              onChangeText={setBudgetAmount}
              keyboardType="numeric"
              placeholderTextColor={Colors.textLight}
            />
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowCreateForm(false)}
              >
                <Text style={styles.cancelButtonText}>रद्द गर्नुहोस्</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleCreateBudget}
              >
                <Text style={styles.saveButtonText}>सुरक्षित गर्नुहोस्</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.cardTitle}>बजेट ओभरभ्यू</Text>
        <TouchableOpacity onPress={() => setShowCreateForm(true)}>
          <Icon name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {currentBudget && (
        <View style={styles.budgetInfo}>
          <Text style={styles.budgetName}>{currentBudget.name}</Text>
          
          <View style={styles.amountContainer}>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>कुल बजेट:</Text>
              <Text style={styles.amountValue}>
                {formatCurrency(currentBudget.amount)}
              </Text>
            </View>
            
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>खर्च भएको:</Text>
              <Text style={[styles.amountValue, { color: Colors.error }]}>
                {formatCurrency(totalSpent)}
              </Text>
            </View>
            
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>बाँकी:</Text>
              <Text style={[
                styles.amountValue,
                { color: remainingAmount >= 0 ? Colors.success : Colors.error }
              ]}>
                {formatCurrency(remainingAmount)}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(spentPercentage, 100)}%`,
                    backgroundColor: spentPercentage > 100 ? Colors.error :
                                   spentPercentage > 80 ? Colors.warning :
                                   Colors.success
                  }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {spentPercentage.toFixed(1)}% प्रयोग भयो
            </Text>
          </View>

          {spentPercentage > 80 && (
            <View style={styles.warningContainer}>
              <Icon name="warning" size={20} color={Colors.warning} />
              <Text style={styles.warningText}>
                {spentPercentage > 100 
                  ? 'तपाईंको बजेट सकिएको छ!'
                  : 'तपाईंको बजेट सकिन लाग्यो!'
                }
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Budget Selector */}
      {budgets.length > 1 && (
        <View style={styles.budgetSelector}>
          <Text style={styles.selectorTitle}>बजेट छान्नुहोस्:</Text>
          {budgets.map((budget) => (
            <TouchableOpacity
              key={budget.id}
              style={[
                styles.budgetOption,
                budget.id === currentBudget?.id && styles.selectedBudget
              ]}
              onPress={() => setCurrentBudget(budget)}
            >
              <Text style={[
                styles.budgetOptionText,
                budget.id === currentBudget?.id && styles.selectedBudgetText
              ]}>
                {budget.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {showCreateForm && (
        <View style={styles.createForm}>
          <Text style={styles.formTitle}>नयाँ बजेट सिर्जना गर्नुहोस्</Text>
          <TextInput
            style={styles.input}
            placeholder="बजेट नाम"
            value={budgetName}
            onChangeText={setBudgetName}
            placeholderTextColor={Colors.textLight}
          />
          <TextInput
            style={styles.input}
            placeholder="बजेट रकम"
            value={budgetAmount}
            onChangeText={setBudgetAmount}
            keyboardType="numeric"
            placeholderTextColor={Colors.textLight}
          />
          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setShowCreateForm(false)}
            >
              <Text style={styles.cancelButtonText}>रद्द गर्नुहोस्</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleCreateBudget}
            >
              <Text style={styles.saveButtonText}>सुरक्षित गर्नुहोस्</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  budgetInfo: {
    marginBottom: 16,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  amountContainer: {
    marginBottom: 16,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  amountValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: Colors.warning,
    fontWeight: '500',
  },
  budgetSelector: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  selectorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  budgetOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  selectedBudget: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  budgetOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedBudgetText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  createForm: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
    marginBottom: 12,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.lightGray,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default BudgetOverview;