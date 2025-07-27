import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useBudget } from '../context/BudgetContext';
import { Colors } from '../constants/Colors';
import { formatCurrency } from '../utils/helpers';

const QuickStats: React.FC = () => {
  const { currentBudget, expenses } = useBudget();

  if (!currentBudget) {
    return null;
  }

  const currentExpenses = expenses.filter(
    expense => expense.budgetId === currentBudget.id
  );

  const totalSpent = currentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averagePerDay = currentExpenses.length > 0 ? totalSpent / 30 : 0; // Rough monthly average
  const remainingBudget = currentBudget.amount - totalSpent;
  const budgetUsagePercentage = (totalSpent / currentBudget.amount) * 100;

  const stats = [
    {
      icon: 'trending-up',
      label: 'कुल खर्च',
      value: formatCurrency(totalSpent),
      color: Colors.error,
    },
    {
      icon: 'today',
      label: 'दैनिक औसत',
      value: formatCurrency(averagePerDay),
      color: Colors.secondary,
    },
    {
      icon: 'account-balance-wallet',
      label: 'बाँकी बजेट',
      value: formatCurrency(remainingBudget),
      color: remainingBudget >= 0 ? Colors.success : Colors.error,
    },
    {
      icon: 'pie-chart',
      label: 'बजेट प्रयोग',
      value: `${budgetUsagePercentage.toFixed(1)}%`,
      color: budgetUsagePercentage > 80 ? Colors.warning : Colors.primary,
    },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>द्रुत तथ्याङ्कहरू</Text>
      
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
              <Icon name={stat.icon} size={20} color={stat.color} />
            </View>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={[styles.statValue, { color: stat.color }]}>
              {stat.value}
            </Text>
          </View>
        ))}
      </View>

      {budgetUsagePercentage > 80 && (
        <View style={styles.warningContainer}>
          <Icon name="warning" size={16} color={Colors.warning} />
          <Text style={styles.warningText}>
            {budgetUsagePercentage > 100 
              ? 'तपाईंको बजेट सकिएको छ!'
              : 'सावधान! बजेट सकिन लाग्यो।'
            }
          </Text>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3cd',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  warningText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: Colors.warning,
    fontWeight: '500',
  },
});

export default QuickStats;