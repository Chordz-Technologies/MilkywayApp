import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../styles/CalendorScreenStyle';

interface LeaveRequestModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (leaveData: LeaveRequestData) => void;
}

interface LeaveRequestData {
  startDate: string;
  endDate: string;
  reason: string;
  leaveType: 'single' | 'multiple';
}

export default function LeaveRequestModal({ isVisible, onClose, onSubmit }: LeaveRequestModalProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reason, setReason] = useState('');
  const [leaveType, setLeaveType] = useState<'single' | 'multiple'>('single');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const resetForm = () => {
    setStartDate(null);
    setEndDate(null);
    setReason('');
    setLeaveType('single');
  };

  const handleSubmit = () => {
    if (!startDate) {
      Alert.alert('Error', 'Please select start date');
      return;
    }

    if (leaveType === 'multiple' && !endDate) {
      Alert.alert('Error', 'Please select end date');
      return;
    }

    if (!reason.trim()) {
      Alert.alert('Error', 'Please enter reason for leave');
      return;
    }

    const leaveData: LeaveRequestData = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: leaveType === 'single' ? startDate.toISOString().split('T')[0] : endDate!.toISOString().split('T')[0],
      reason: reason.trim(),
      leaveType,
    };

    onSubmit(leaveData);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios');
    setEndDate(currentDate);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Apply for Leave</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Leave Type Selection */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Leave Type</Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={[styles.radioButton, leaveType === 'single' && styles.radioSelected]}
                onPress={() => setLeaveType('single')}
              >
                <Text style={[styles.radioText, leaveType === 'single' && styles.radioTextSelected]}>
                  Single Day
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioButton, leaveType === 'multiple' && styles.radioSelected]}
                onPress={() => setLeaveType('multiple')}
              >
                <Text style={[styles.radioText, leaveType === 'multiple' && styles.radioTextSelected]}>
                  Multiple Days
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date Selection */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Select Date{leaveType === 'multiple' ? 's' : ''}</Text>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.primary || '#007AFF'} />
              <Text style={styles.dateButtonText}>
                {startDate ? startDate.toDateString() : 'Select Start Date'}
              </Text>
            </TouchableOpacity>

            {leaveType === 'multiple' && (
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color={colors.primary || '#007AFF'} />
                <Text style={styles.dateButtonText}>
                  {endDate ? endDate.toDateString() : 'Select End Date'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Reason Input */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Reason for Leave</Text>
            <TextInput
              style={styles.reasonInput}
              placeholder="Enter reason (e.g., Personal work, Festival, etc.)"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={3}
              placeholderTextColor="#999"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Apply for Leave</Text>
          </TouchableOpacity>

          {/* Date Pickers */}
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={onStartDateChange}
              minimumDate={new Date()}
            />
          )}

          {showEndDatePicker && (
            <DateTimePicker
              value={endDate || startDate || new Date()}
              mode="date"
              display="default"
              onChange={onEndDateChange}
              minimumDate={startDate || new Date()}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    flex: 0.45,
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  radioText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
  },
  radioTextSelected: {
    color: '#2196f3',
    fontWeight: '600',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
    backgroundColor: '#fff',
    color: '#333',
  },
  submitButton: {
    backgroundColor: colors.primary || '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});