// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
//   SafeAreaView,
//   Linking,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// // Simple consumer data
// const CONSUMERS = [
//   { id: 1, name: 'Consumer1', location: 'MG Road, Pune', capacity: '2L', mobile: '+91 98765 43210' },
//   { id: 2, name: 'Consumer2', location: 'FC Road, Pune', capacity: '1L', mobile: '+91 87654 32109' },
//   { id: 3, name: 'Consumer3', location: 'Karve Road, Pune', capacity: '500ml', mobile: '+91 76543 21098' },
//   { id: 4, name: 'Consumer4', location: 'Baner, Pune', capacity: '3L', mobile: '+91 65432 10987' },
//   { id: 5, name: 'Consumer5', location: 'Hadapsar, Pune', capacity: '1.5L', mobile: '+91 54321 09876' },
//   { id: 6, name: 'Consumer6', location: 'Viman Nagar, Pune', capacity: '1L', mobile: '+91 43210 98765' },
//   { id: 7, name: 'Consumer7', location: 'Kothrud, Pune', capacity: '2.5L', mobile: '+91 32109 87654' },
//   { id: 8, name: 'Consumer8', location: 'Wakad, Pune', capacity: '1L', mobile: '+91 21098 76543' },
//   { id: 9, name: 'Consumer9', location: 'Pimpri, Pune', capacity: '2L', mobile: '+91 10987 65432' },
//   { id: 10, name: 'Consumer10', location: 'Aundh, Pune', capacity: '1.5L', mobile: '+91 09876 54321' },
// ];

// // interface Consumer {
// //   id: number;
// //   name: string;
// //   location: string;
// //   capacity: string;
// //   mobile: string;
// // }

// const ConsumerList: React.FC = () => {
//   const [searchQuery, setSearchQuery] = useState('');

//   // Filter consumers based on search
//   const filteredConsumers = CONSUMERS.filter(consumer =>
//     consumer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     consumer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     consumer.mobile.includes(searchQuery)
//   );

//   const handleCall = (mobile: string) => {
//     Linking.openURL(`tel:${mobile}`);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.title}>Consumer List</Text>
//         <Text style={styles.subtitle}>{filteredConsumers.length} consumers</Text>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Ionicons name="search-outline" size={20} color="#666" />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search consumers..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           placeholderTextColor="#999"
//         />
//         {searchQuery.length > 0 && (
//           <TouchableOpacity onPress={() => setSearchQuery('')}>
//             <Ionicons name="close-circle" size={20} color="#666" />
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Consumer List */}
//       <ScrollView style={styles.listContainer}>
//         {filteredConsumers.map((consumer) => (
//           <View key={consumer.id} style={styles.consumerItem}>
//             <View style={styles.consumerInfo}>
//               <Text style={styles.consumerName}>{consumer.name}</Text>
//               <Text style={styles.consumerLocation}>{consumer.location}</Text>
//               <Text style={styles.consumerCapacity}>{consumer.capacity}</Text>
//             </View>
//             <TouchableOpacity
//               style={styles.callButton}
//               onPress={() => handleCall(consumer.mobile)}
//             >
//               <Ionicons name="call" size={20} color="#fff" />
//               <Text style={styles.mobileNumber}>{consumer.mobile}</Text>
//             </TouchableOpacity>
//           </View>
//         ))}

//         {filteredConsumers.length === 0 && (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No consumers found</Text>
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     backgroundColor: '#fff',
//     padding: 20,
//     paddingTop: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 4,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     margin: 16,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     marginLeft: 10,
//     color: '#333',
//   },
//   listContainer: {
//     flex: 1,
//     paddingHorizontal: 16,
//   },
//   consumerItem: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   consumerInfo: {
//     flex: 1,
//   },
//   consumerName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//   },
//   consumerLocation: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 2,
//   },
//   consumerCapacity: {
//     fontSize: 14,
//     color: '#007AFF',
//     fontWeight: '500',
//   },
//   callButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#007AFF',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 6,
//   },
//   mobileNumber: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '500',
//     marginLeft: 6,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#999',
//   },
// });

// export default ConsumerList;
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert,
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Assigned Consumers</Text>
          <Text style={styles.headerSubtitle}>
            {consumers.length} consumer{consumers.length !== 1 ? 's' : ''} assigned to you
          </Text>
        </View>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{consumers.length}</Text>
          <Text style={styles.statLabel}>Total Consumers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {consumers.reduce((total, consumer) => {
              const cow = consumer.milk_requirement?.cow_milk_litre || 0;
              const buffalo = consumer.milk_requirement?.buffalo_milk_litre || 0;
              return total + cow + buffalo;
            }, 0)}L
          </Text>
          <Text style={styles.statLabel}>Daily Milk</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {consumers.filter(c => c.status?.toLowerCase() === 'active' || !c.status).length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
      </View>

      {/* Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchAssignedConsumers} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading your assigned consumers...</Text>
        </View>
      ) : (
        <FlatList
          data={consumers}
          keyExtractor={(item, index) => `consumer_${item.id || item.customer_id || index}`}
          renderItem={renderConsumerItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={80} color="#E5E5EA" />
              <Text style={styles.emptyTitle}>No Assigned Consumers</Text>
              <Text style={styles.emptyText}>
                No consumers have been assigned to you yet. Contact your vendor or check back later.
              </Text>
              <TouchableOpacity onPress={fetchAssignedConsumers} style={styles.refreshButtonLarge}>
                <Ionicons name="refresh-outline" size={20} color="#fff" />
                <Text style={styles.refreshButtonLargeText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Stats Card
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
    }),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 16,
  },

  // Error
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEB',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Loading
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#8E8E93',
    fontSize: 16,
  },

  // List
  listContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },

  // Consumer Item
  consumerItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    elevation: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
    }),
  },
  consumerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
  },

  // Avatar
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },

  // Consumer Info
  consumerInfo: {
    flex: 1,
    gap: 6,
  },
  consumerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  consumerContact: {
    fontSize: 14,
    color: '#007AFF',
    flex: 1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  consumerAddress: {
    fontSize: 12,
    color: '#8E8E93',
    flex: 1,
  },
  milkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  milkRequirement: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '600',
    flex: 1,
  },
  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vendorName: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
    flex: 1,
  },

  // Action
  actionContainer: {
    alignItems: 'center',
    marginLeft: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  refreshButtonLarge: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshButtonLargeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ConsumerList;
