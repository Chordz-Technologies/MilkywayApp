import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, Alert, ScrollView, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getAcceptedMilkmen, assignTemporaryDistributor, deassignDistributor, } from '../../apiServices/allApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import DateTimePicker from '@react-native-community/datetimepicker';
import SafeAreaWrapper from '../../styles/SafeAreaWrapper';
import { useTranslation } from '../../i18n/LanguageProvider';

type RouteParams = {
  consumerId: number;
  consumerName: string;
  currentDistributorId?: number;
  currentDistributorName?: string;
  isTemporary?: boolean;
};

type Distributor = {
  id: number;
  milkman_id: number;
  milkman_name: string;
  milkman_contact: string;
  assigned_customers_count: number;
};

const TemporaryDistributorModal = ({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (start: Date, end: Date) => void;
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{t('temporaryDistributor.temporaryAssignmentPeriod')}</Text>

          {/* Start Date */}
          <TouchableOpacity
            style={styles.dateBox}
            onPress={() => setShowStartPicker(true)}
          >
            <Text
              style={[
                styles.dateText,
                !startDate && styles.placeholderText,
              ]}
            >
              {startDate ? startDate.toDateString() : t('temporaryDistributor.selectStartDate')}
            </Text>
          </TouchableOpacity>

          {/* End Date */}
          <TouchableOpacity
            style={styles.dateBox}
            onPress={() => setShowEndPicker(true)}
          >
            <Text
              style={[
                styles.dateText,
                !endDate && styles.placeholderText,
              ]}
            >
              {endDate ? endDate.toDateString() : t('temporaryDistributor.selectEndDate')}
            </Text>
          </TouchableOpacity>

          {/* Start Date Picker */}
          {showStartPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              minimumDate={new Date()}
              onChange={(e, date) => {
                setShowStartPicker(false);
                if (date) {
                  setStartDate(date);

                  // Auto-fix end date if needed
                  if (!endDate || date > endDate) {
                    setEndDate(date);
                  }
                }
              }}
            />
          )}

          {/* End Date Picker */}
          {showEndPicker && (
            <DateTimePicker
              value={endDate || startDate || new Date()}
              mode="date"
              minimumDate={startDate || new Date()}
              onChange={(e, date) => {
                setShowEndPicker(false);
                if (date) setEndDate(date);
              }}
            />
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text>{t('common.cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                (!startDate || !endDate) && { backgroundColor: '#B0BEC5' },
              ]}
              disabled={!startDate || !endDate}
              onPress={() => {
                if (!startDate || !endDate) return;
                onSubmit(startDate, endDate);
              }}
            >
              <Text style={{ color: '#fff' }}>{t('temporaryDistributor.submit')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const TemporaryDistributorAssignmentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params as RouteParams;
  const { user } = useSelector((state: RootState) => state.auth);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDistributorId, setSelectedDistributorId] = useState<number | null>(null);
  const [showTempModal, setShowTempModal] = useState(false);
  const { t } = useTranslation();

  const fetchDistributors = useCallback(async () => {
    if (!user?.userID) {
      Alert.alert(t('common.error'), t('temporaryDistributor.userIdNotFound'));
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await getAcceptedMilkmen(user.userID);
      const data = response?.data?.data || response?.data || [];

      // Filter out the current permanent distributor if exists
      const filteredDistributors = Array.isArray(data)
        ? data.filter((d: Distributor) => d.milkman_id !== params.currentDistributorId)
        : [];

      setDistributors(filteredDistributors);
    } catch (err: any) {
      Alert.alert(t('common.error'), t('temporaryDistributor.failedToLoadDistributors'));
    } finally {
      setLoading(false);
    }
  }, [user?.userID, params.currentDistributorId]);

  useEffect(() => {
    fetchDistributors();
  }, [fetchDistributors]);

  const handleAssignTemporary = async (startDate: Date, endDate: Date) => {
    if (!selectedDistributorId) {
      Alert.alert(t('common.error'), t('temporaryDistributor.selectDistributor'));
      return;
    }

    Alert.alert(
      t('temporaryDistributor.assignTemporaryDistributor'),
      t('temporaryDistributor.assignTemporaryConfirmation', {
        consumerName: params.consumerName,
      }),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('temporaryDistributor.assign'),
          onPress: async () => {
            setSubmitting(true);
            try {
              await assignTemporaryDistributor({
                customer_id: params.consumerId,
                milkman_id: selectedDistributorId,
                is_temporary: true,
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0],
              });

              Alert.alert(t('common.success'),
                t('temporaryDistributor.temporaryDistributorAssigned'), [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (err: any) {
              Alert.alert(t('common.error'), err?.response?.data?.message || t('temporaryDistributor.failedAssign'));
            } finally {
              setSubmitting(false);
              setShowTempModal(false);
            }
          },
        },
      ]
    );
  };

  const handleDeassignTemporary = async () => {
    Alert.alert(
      t('temporaryDistributor.removeTemporaryDistributor'),
      t('temporaryDistributor.removeTemporaryConfirmation', {
        consumerName: params.consumerName,
      }),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('temporaryDistributor.remove'),
          style: 'destructive',
          onPress: async () => {
            setSubmitting(true);
            try {
              await deassignDistributor({
                customer_id: params.consumerId,
              });

              Alert.alert(t('common.success'), t('temporaryDistributor.removeSuccess'), [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (err: any) {
              Alert.alert(t('common.error'), err?.response?.data?.message || t('temporaryDistributor.failedRemove'));
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const getInitials = (name: string) => {
    if (!name) { return 'D'; }
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>{t('temporaryDistributor.loadingDistributors')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {params.isTemporary ? t('temporaryDistributor.removeTemporaryDistributor')
              : t('temporaryDistributor.assignTemporaryDistributor')}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Consumer Info Card */}
          <View style={styles.consumerCard}>
            <View style={styles.consumerHeader}>
              <Ionicons name="person-outline" size={24} color="#007AFF" />
              <View style={styles.consumerInfo}>
                <Text style={styles.consumerLabel}>{t('temporaryDistributor.consumer')}</Text>
                <Text style={styles.consumerName}>{params.consumerName}</Text>
              </View>
            </View>

            {params.currentDistributorName && (
              <View style={styles.currentDistributorInfo}>
                <Ionicons name="person-circle-outline" size={20} color="#666" />
                <Text style={styles.currentDistributorText}>
                  {params.isTemporary ? `${t('temporaryDistributor.temporary')}: ` : `${t('temporaryDistributor.permanent')}: `}
                  <Text style={styles.currentDistributorName}>
                    {params.currentDistributorName}
                  </Text>
                </Text>
              </View>
            )}
          </View>

          {/* If temporary distributor exists, show remove option */}
          {params.isTemporary ? (
            <View style={styles.section}>
              <View style={styles.warningCard}>
                <Ionicons name="information-circle" size={24} color="#FF9500" />
                <View style={styles.warningContent}>
                  <Text style={styles.warningTitle}>{t('temporaryDistributor.temporaryAssignmentActive')}</Text>
                  <Text style={styles.warningText}>
                    {t('temporaryDistributor.removeTemporaryDistributorInfo')}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.deassignButton, submitting && styles.buttonDisabled]}
                onPress={handleDeassignTemporary}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="close-circle-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>{t('temporaryDistributor.removeTemporaryDistributor')}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Instructions */}
              <View style={styles.section}>
                <View style={styles.instructionCard}>
                  <Ionicons name="information-circle" size={24} color="#007AFF" />
                  <View style={styles.instructionContent}>
                    <Text style={styles.instructionTitle}>{t('temporaryDistributor.temporaryAssignment')}</Text>
                    <Text style={styles.instructionText}>
                      {t('temporaryDistributor.temporaryAssignmentDescription')}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Distributor List */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('temporaryDistributor.availableDistributors')}</Text>

                {distributors.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Ionicons name="people-outline" size={48} color="#ccc" />
                    <Text style={styles.emptyText}>{t('temporaryDistributor.noOtherDistributorsAvailable')}</Text>
                  </View>
                ) : (
                  distributors.map((distributor) => (
                    <TouchableOpacity
                      key={distributor.milkman_id}
                      style={[
                        styles.distributorCard,
                        selectedDistributorId === distributor.milkman_id && styles.selectedCard,
                      ]}
                      onPress={() => setSelectedDistributorId(distributor.milkman_id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.distributorLeft}>
                        <View
                          style={[
                            styles.distributorAvatar,
                            selectedDistributorId === distributor.milkman_id &&
                            styles.selectedAvatar,
                          ]}
                        >
                          <Text style={styles.distributorAvatarText}>
                            {getInitials(distributor.milkman_name)}
                          </Text>
                        </View>
                        <View style={styles.distributorInfo}>
                          <Text style={styles.distributorName}>{distributor.milkman_name}</Text>
                          <Text style={styles.distributorContact}>
                            {distributor.milkman_contact}
                          </Text>
                          <Text style={styles.distributorCount}>
                            {distributor.assigned_customers_count}{' '}{t('temporaryDistributor.consumersAssigned')}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.distributorRight}>
                        {selectedDistributorId === distributor.milkman_id ? (
                          <View style={styles.selectedIcon}>
                            <Ionicons name="checkmark-circle" size={28} color="#007AFF" />
                          </View>
                        ) : (
                          <View style={styles.unselectedIcon}>
                            <Ionicons name="radio-button-off" size={28} color="#ccc" />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>


              {/* Assign Button */}
              {distributors.length > 0 && (
                <View style={styles.section}>
                  <TouchableOpacity
                    style={[
                      styles.assignButton,
                      (!selectedDistributorId || submitting) && styles.buttonDisabled,
                    ]}
                    onPress={() => setShowTempModal(true)}
                    disabled={!selectedDistributorId || submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Ionicons name="person-add-outline" size={20} color="#fff" />
                        <Text style={styles.buttonText}>{t('temporaryDistributor.assignTemporaryDistributorButton')}</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          {/* Bottom Spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
      <TemporaryDistributorModal
        visible={showTempModal}
        onClose={() => setShowTempModal(false)}
        onSubmit={handleAssignTemporary}
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  placeholder: {
    width: 40,
  },
  consumerCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  consumerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  consumerInfo: {
    marginLeft: 12,
  },
  consumerLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  consumerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  currentDistributorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  currentDistributorText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  currentDistributorName: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  instructionCard: {
    backgroundColor: '#E8F4FD',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
  },
  instructionContent: {
    flex: 1,
    marginLeft: 12,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 20,
  },
  warningCard: {
    backgroundColor: '#FFF4E6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 16,
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9500',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  distributorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selectedCard: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  distributorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  distributorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedAvatar: {
    backgroundColor: '#0051D5',
  },
  distributorAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  distributorInfo: {
    flex: 1,
  },
  distributorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  distributorContact: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  distributorCount: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '600',
  },
  distributorRight: {
    marginLeft: 12,
  },
  selectedIcon: {},
  unselectedIcon: {},
  assignButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  deassignButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  dateBox: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelBtn: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  submitBtn: {
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 15,
    color: '#000',
  },
  placeholderText: {
    color: '#999',
  },
});

export default TemporaryDistributorAssignmentScreen;
