import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Simple consumer data
const CONSUMERS = [
  { id: 1, name: 'Consumer1', location: 'MG Road, Pune', capacity: '2L', mobile: '+91 98765 43210' },
  { id: 2, name: 'Consumer2', location: 'FC Road, Pune', capacity: '1L', mobile: '+91 87654 32109' },
  { id: 3, name: 'Consumer3', location: 'Karve Road, Pune', capacity: '500ml', mobile: '+91 76543 21098' },
  { id: 4, name: 'Consumer4', location: 'Baner, Pune', capacity: '3L', mobile: '+91 65432 10987' },
  { id: 5, name: 'Consumer5', location: 'Hadapsar, Pune', capacity: '1.5L', mobile: '+91 54321 09876' },
  { id: 6, name: 'Consumer6', location: 'Viman Nagar, Pune', capacity: '1L', mobile: '+91 43210 98765' },
  { id: 7, name: 'Consumer7', location: 'Kothrud, Pune', capacity: '2.5L', mobile: '+91 32109 87654' },
  { id: 8, name: 'Consumer8', location: 'Wakad, Pune', capacity: '1L', mobile: '+91 21098 76543' },
  { id: 9, name: 'Consumer9', location: 'Pimpri, Pune', capacity: '2L', mobile: '+91 10987 65432' },
  { id: 10, name: 'Consumer10', location: 'Aundh, Pune', capacity: '1.5L', mobile: '+91 09876 54321' },
];

// interface Consumer {
//   id: number;
//   name: string;
//   location: string;
//   capacity: string;
//   mobile: string;
// }

const ConsumerList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter consumers based on search
  const filteredConsumers = CONSUMERS.filter(consumer =>
    consumer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    consumer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    consumer.mobile.includes(searchQuery)
  );

  const handleCall = (mobile: string) => {
    Linking.openURL(`tel:${mobile}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Consumer List</Text>
        <Text style={styles.subtitle}>{filteredConsumers.length} consumers</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search consumers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Consumer List */}
      <ScrollView style={styles.listContainer}>
        {filteredConsumers.map((consumer) => (
          <View key={consumer.id} style={styles.consumerItem}>
            <View style={styles.consumerInfo}>
              <Text style={styles.consumerName}>{consumer.name}</Text>
              <Text style={styles.consumerLocation}>{consumer.location}</Text>
              <Text style={styles.consumerCapacity}>{consumer.capacity}</Text>
            </View>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => handleCall(consumer.mobile)}
            >
              <Ionicons name="call" size={20} color="#fff" />
              <Text style={styles.mobileNumber}>{consumer.mobile}</Text>
            </TouchableOpacity>
          </View>
        ))}

        {filteredConsumers.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No consumers found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  consumerItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  consumerInfo: {
    flex: 1,
  },
  consumerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  consumerLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  consumerCapacity: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  mobileNumber: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default ConsumerList;
