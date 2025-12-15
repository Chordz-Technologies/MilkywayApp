
import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from 'react-native-calendars/src/types';

const { width } = Dimensions.get('window');

export const calendarScreenStyles = StyleSheet.create({
  // ===================
  // MAIN CONTAINER STYLES
  // ===================
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // ===================
  // HEADER STYLES
  // ===================
  header: {
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginHorizontal: 16,
  },

  // ===================
  // CONTENT & SCROLL STYLES
  // ===================
  content: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 30,
  },

  // ===================
  // CALENDAR STYLES
  // ===================
  calendarContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  calendar: {
    borderRadius: 12,
  },

  // ===================
  // LEGEND STYLES
  // ===================
  legendContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    minWidth: width * 0.21,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  // ✅ NEW - LEGEND COLOR STYLES
  // ===================
  deliveredDot: {
    backgroundColor: '#4CAF50',
  },
  missedDot: {
    backgroundColor: '#2196F3',
  },
  notRequestedDot: {
    backgroundColor: '#FF9800',
  },
  vendorUnavailableDot: {
    backgroundColor: '#F44336',
  },
  leaveDot: {
    backgroundColor: '#9C27B0',
  },
  extraMilkDot: {
    backgroundColor: '#FFC107',
  },
  customerIdText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center' as 'center',
  },

  // ===================
  // SUMMARY SECTION STYLES
  // ===================
  summaryContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  summaryIcon: {
    marginBottom: 8,
  },

  // ===================
  // LEAVES SECTION STYLES
  // ===================
  leavesContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leavesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  leaveItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff5f5',
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
    elevation: 1,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leaveItemContent: {
    flex: 1,
  },
  leaveDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  leaveReason: {
    fontSize: 13,
    color: '#666',
  },
  leaveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  leaveButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  noLeavesText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
    paddingVertical: 20,
  },

  // ===================
  // ACTIONS SECTION STYLES
  // ===================
  actionsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    elevation: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  actionIconGreen: {
    backgroundColor: '#28a745',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  actionChevron: {
    marginLeft: 8,
  },

  // ===================
  // BILL PAYMENT STYLES
  // ===================
  billPayContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  billPayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  billInfo: {
    backgroundColor: '#f0f8ff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#007AFF20',
    alignItems: 'center',
  },
  billAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  billDueDate: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  billStatus: {
    fontSize: 12,
    color: '#28a745',
    marginTop: 4,
    fontWeight: '500',
  },
  payButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  payButtonDisabled: {
    backgroundColor: '#6c757d',
    elevation: 1,
  },
  payButtonTextDisabled: {
    color: '#adb5bd',
  },

  // ===================
  // LOADING & ERROR STYLES
  // ===================
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#fff5f5',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export const calendarTheme: Theme = {
  backgroundColor: '#fff',
  calendarBackground: '#fff',
  textSectionTitleColor: '#666',
  selectedDayBackgroundColor: '#007AFF',
  selectedDayTextColor: '#fff',
  todayTextColor: '#007AFF',
  dayTextColor: '#333',
  textDisabledColor: '#ccc',
  dotColor: '#007AFF',
  selectedDotColor: '#fff',
  arrowColor: '#007AFF',
  disabledArrowColor: '#ccc',
  monthTextColor: '#333',
  indicatorColor: '#007AFF',
  textDayFontFamily: 'System',
  textMonthFontFamily: 'System',
  textDayHeaderFontFamily: 'System',
  textDayFontWeight: '400',
  textMonthFontWeight: '600',
  textDayHeaderFontWeight: '500',
  textDayFontSize: 14,
  textMonthFontSize: 16,
  textDayHeaderFontSize: 12,
};

export const colors = {
  primary: '#007AFF',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#fd7e14',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
  white: '#fff',
  gray100: '#f8f9fa',
  gray200: '#e9ecef',
  gray300: '#dee2e6',
  gray400: '#ced4da',
  gray500: '#adb5bd',
  gray600: '#6c757d',
  gray700: '#495057',
  gray800: '#343a40',
  gray900: '#212529',
  delivered: '#28a745',
  scheduled: '#007AFF',
  leave: '#ff6b6b',
  pending: '#ffc107',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const typography = {
  h1: { fontSize: 28, fontWeight: 'bold' as const },
  h2: { fontSize: 24, fontWeight: 'bold' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  h4: { fontSize: 18, fontWeight: '600' as const },
  h5: { fontSize: 16, fontWeight: '600' as const },
  h6: { fontSize: 14, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  small: { fontSize: 11, fontWeight: '400' as const },
} as const;
