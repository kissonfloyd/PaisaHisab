import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useBudget } from '../context/BudgetContext';
import { useAds } from '../context/AdContext';
import { Colors } from '../constants/Colors';
import { formatCurrency } from '../utils/helpers';
import BudgetOverview from '../components/BudgetOverview';
import AddExpenseForm from '../components/AddExpenseForm';
import ExpenseList from '../components/ExpenseListUpdated';
import QuickStats from '../components/QuickStats';
import BannerAd from '../components/ads/BannerAd';
import InterstitialAd from '../components/ads/InterstitialAd';

const DashboardScreen: React.FC = () => {
  const { currentBudget, expenses, loading } = useBudget();
  const { isPremium, showInterstitial } = useAds();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const currentExpenses = expenses.filter(
    expense => expense.budgetId === currentBudget?.id
  );

  const totalSpent = currentExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="account-balance-wallet" size={50} color={Colors.primary} />
        <Text style={styles.loadingText}>तपाईंको बजेट लोड गर्दै...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Premium Badge */}
        {isPremium && (
          <View style={styles.premiumBadge}>
            <Icon name="star" size={16} color={Colors.warning} />
            <Text style={styles.premiumText}>प्रिमियम सदस्य</Text>
          </View>
        )}

        {/* Budget Overview */}
        <BudgetOverview />

        {/* Quick Stats */}
        <QuickStats />

        {/* Add Expense Form */}
        <AddExpenseForm />

        {/* Expense List */}
        <ExpenseList />

        {/* Banner Ad */}
        {!isPremium && <BannerAd />}

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Interstitial Ad */}
      <InterstitialAd />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.warning,
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 8,
  },
  premiumText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.white,
  },
  bottomPadding: {
    height: 100,
  },
});

export default DashboardScreen;