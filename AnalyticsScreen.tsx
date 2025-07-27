import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useBudget } from '../context/BudgetContext';
import { useAds } from '../context/AdContext';
import { Colors } from '../constants/Colors';
import { formatCurrency, groupExpensesByCategory, getDateRange } from '../utils/helpers';
import { ExpenseCategories } from '../types';
import BannerAd from '../components/ads/BannerAd';

const { width } = Dimensions.get('window');

type TimeRange = 'week' | 'month' | 'last7' | 'last30';

const AnalyticsScreen: React.FC = () => {
  const { currentBudget, expenses } = useBudget();
  const { isPremium } = useAds();
  const [selectedRange, setSelectedRange] = useState<TimeRange>('month');

  const timeRanges = [
    { key: 'week' as TimeRange, label: 'यो हप्ता' },
    { key: 'month' as TimeRange, label: 'यो महिना' },
    { key: 'last7' as TimeRange, label: 'अन्तिम ७ दिन' },
    { key: 'last30' as TimeRange, label: 'अन्तिम ३० दिन' },
  ];

  if (!currentBudget) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="analytics" size={60} color={Colors.textLight} />
        <Text style={styles.emptyTitle}>विश्लेषणको लागि बजेट चाहिन्छ</Text>
        <Text style={styles.emptyDescription}>
          पहिले बजेट सिर्जना गर्नुहोस् र केही खर्चहरू थप्नुहोस्
        </Text>
      </View>
    );
  }

  const currentExpenses = expenses.filter(
    expense => expense.budgetId === currentBudget.id
  );

  const dateRange = getDateRange(selectedRange);
  const filteredExpenses = currentExpenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= dateRange.start && expenseDate <= dateRange.end;
  });

  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averagePerDay = filteredExpenses.length > 0 ? totalSpent / 7 : 0;
  const budgetUsage = (totalSpent / currentBudget.amount) * 100;

  const categoryData = groupExpensesByCategory(filteredExpenses);
  const topCategories = categoryData
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const renderSummaryCard = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>खर्च सारांश</Text>
      <View style={styles.summaryGrid}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{formatCurrency(totalSpent)}</Text>
          <Text style={styles.summaryLabel}>कुल खर्च</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{formatCurrency(averagePerDay)}</Text>
          <Text style={styles.summaryLabel}>दैनिक औसत</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: budgetUsage > 100 ? Colors.error : Colors.success }]}>
            {budgetUsage.toFixed(1)}%
          </Text>
          <Text style={styles.summaryLabel}>बजेट प्रयोग</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{filteredExpenses.length}</Text>
          <Text style={styles.summaryLabel}>कुल खर्चहरू</Text>
        </View>
      </View>
    </View>
  );

  const renderCategoryBreakdown = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>श्रेणी अनुसार खर्च</Text>
      {topCategories.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Icon name="pie-chart" size={40} color={Colors.textLight} />
          <Text style={styles.noDataText}>यो अवधिमा कुनै खर्च छैन</Text>
        </View>
      ) : (
        <View style={styles.categoryList}>
          {topCategories.map((category, index) => {
            const percentage = (category.amount / totalSpent) * 100;
            const categoryName = ExpenseCategories[category.category as keyof typeof ExpenseCategories] || category.category;
            
            return (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{categoryName}</Text>
                  <Text style={styles.categoryAmount}>
                    {formatCurrency(category.amount)}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${percentage}%`,
                        backgroundColor: [Colors.primary, Colors.secondary, Colors.success, Colors.warning, Colors.error][index] || Colors.gray
                      }
                    ]}
                  />
                </View>
                <Text style={styles.categoryPercentage}>
                  {percentage.toFixed(1)}%
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );

  const renderInsights = () => {
    const insights = [];
    
    if (budgetUsage > 80) {
      insights.push({
        icon: 'warning',
        color: Colors.warning,
        text: budgetUsage > 100 
          ? 'तपाईंको बजेट सकिएको छ! खर्च कम गर्नुहोस्।'
          : 'सावधान! तपाईंको बजेट सकिन लाग्यो।'
      });
    }

    if (topCategories.length > 0) {
      const topCategory = topCategories[0];
      const categoryName = ExpenseCategories[topCategory.category as keyof typeof ExpenseCategories];
      insights.push({
        icon: 'trending-up',
        color: Colors.primary,
        text: `सबैभन्दा धेरै खर्च: ${categoryName} मा ${formatCurrency(topCategory.amount)}`
      });
    }

    if (averagePerDay > 0) {
      insights.push({
        icon: 'today',
        color: Colors.secondary,
        text: `दैनिक औसत खर्च: ${formatCurrency(averagePerDay)}`
      });
    }

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>खर्च अन्तर्दृष्टि</Text>
        {insights.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Icon name="lightbulb" size={40} color={Colors.textLight} />
            <Text style={styles.noDataText}>
              थप खर्चहरू थपेपछि यहाँ अन्तर्दृष्टि देखिनेछ
            </Text>
          </View>
        ) : (
          <View style={styles.insightsList}>
            {insights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <Icon name={insight.icon} size={20} color={insight.color} />
                <Text style={styles.insightText}>{insight.text}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.timeRangeButtons}>
              {timeRanges.map((range) => (
                <TouchableOpacity
                  key={range.key}
                  style={[
                    styles.timeRangeButton,
                    selectedRange === range.key && styles.activeTimeRangeButton
                  ]}
                  onPress={() => setSelectedRange(range.key)}
                >
                  <Text style={[
                    styles.timeRangeButtonText,
                    selectedRange === range.key && styles.activeTimeRangeButtonText
                  ]}>
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Summary Cards */}
        {renderSummaryCard()}

        {/* Category Breakdown */}
        {renderCategoryBreakdown()}

        {/* Insights */}
        {renderInsights()}

        {/* Banner Ad */}
        {!isPremium && <BannerAd />}

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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  timeRangeContainer: {
    paddingVertical: 16,
  },
  timeRangeButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  activeTimeRangeButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeRangeButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  activeTimeRangeButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noDataText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  categoryList: {
    gap: 16,
  },
  categoryItem: {
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryPercentage: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  insightsList: {
    gap: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  insightText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 18,
  },
  bottomPadding: {
    height: 100,
  },
});

export default AnalyticsScreen;