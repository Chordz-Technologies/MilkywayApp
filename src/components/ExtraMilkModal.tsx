// components/ExtraMilkModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { colors } from '../styles/CalendorScreenStyle';

interface ExtraMilkModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (extraMilkData: ExtraMilkData) => void;
}

interface ExtraMilkData {
  date: string;
  quantity: number;
  milkType: 'cow' | 'buffalo' | 'mixed';
  reason: string;
}

export default function ExtraMilkModal({ isVisible, onClose, onSubmit }: ExtraMilkModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [milkType, setMilkType] = useState<'cow' | 'buffalo' | 'mixed'>('cow');
  const [reason, setReason] = useState('');

  const quantities = [0.5, 1, 1.5, 2, 2.5, 3];

  const resetForm = () => {
    setSelectedDate('');
    setQuantity('');
    setMilkType('cow');
    setReason('');
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getNextWeekDate = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  };

  const handleSubmit = () => {
    if (!selectedDate) {
      Alert.alert('Error', 'Please enter date (YYYY-MM-DD format)');
      return;
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      Alert.alert('Error', 'Please enter valid quantity');
      return;
    }

    // Basic date validation
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(selectedDate)) {
      Alert.alert('Error', 'Please enter date in YYYY-MM-DD format');
      return;
    }

    const extraMilkData: ExtraMilkData = {
      date: selectedDate,
      quantity: parseFloat(quantity),
      milkType,
      reason: reason.trim() || 'Extra milk request',
    };

    onSubmit(extraMilkData);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
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
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apply for Extra Milk</Text>
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name="close-outline" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Date Selection */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Select Date</Text>
              <TextInput
                style={styles.dateInput}
                placeholder={`e.g., ${getTodayDate()}`}
                value={selectedDate}
                onChangeText={setSelectedDate}
                maxLength={10}
                placeholderTextColor="#999"
              />

              {/* Quick date buttons */}
              <View style={styles.quickDateContainer}>
                <TouchableOpacity
                  style={styles.quickDateButton}
                  onPress={() => setSelectedDate(getTodayDate())}
                >
                  <Text style={styles.quickDateText}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickDateButton}
                  onPress={() => setSelectedDate(getTomorrowDate())}
                >
                  <Text style={styles.quickDateText}>Tomorrow</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickDateButton}
                  onPress={() => setSelectedDate(getNextWeekDate())}
                >
                  <Text style={styles.quickDateText}>Next Week</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quantity Selection */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Quantity (Liters)</Text>
              <View style={styles.quantityContainer}>
                {quantities.map((qty) => (
                  <TouchableOpacity
                    key={qty}
                    style={[
                      styles.quantityButton,
                      parseFloat(quantity) === qty && styles.quantitySelected,
                    ]}
                    onPress={() => setQuantity(qty.toString())}
                  >
                    <Text style={[
                      styles.quantityText,
                      parseFloat(quantity) === qty && styles.quantityTextSelected,
                    ]}>
                      {qty}L
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.customQuantityInput}
                placeholder="Custom quantity (e.g., 2.5)"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>

            {/* Milk Type Selection */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Milk Type</Text>
              <View style={styles.milkTypeContainer}>
                {['cow', 'buffalo', 'mixed'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.milkTypeButton,
                      milkType === type && styles.milkTypeSelected,
                    ]}
                    onPress={() => setMilkType(type as any)}
                  >
                    <Text style={[
                      styles.milkTypeText,
                      milkType === type && styles.milkTypeTextSelected,
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Reason Input */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Reason (Optional)</Text>
              <TextInput
                style={styles.reasonInput}
                placeholder="e.g., Guests visiting, Festival celebration"
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={3}
                placeholderTextColor="#999"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Request Extra Milk</Text>
            </TouchableOpacity>
          </ScrollView>
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
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  quickDateContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickDateButton: {
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginBottom: 5,
    flex: 0.3,
    alignItems: 'center',
  },
  quickDateText: {
    color: '#2196f3',
    fontSize: 12,
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  quantityButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  quantitySelected: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4caf50',
  },
  quantityText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
  },
  quantityTextSelected: {
    color: '#4caf50',
    fontWeight: '600',
  },
  customQuantityInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  milkTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  milkTypeButton: {
    flex: 0.3,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  milkTypeSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  milkTypeText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
  },
  milkTypeTextSelected: {
    color: '#2196f3',
    fontWeight: '600',
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
  },
  submitButton: {
    backgroundColor: '#4caf50',
    padding: 16,
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
