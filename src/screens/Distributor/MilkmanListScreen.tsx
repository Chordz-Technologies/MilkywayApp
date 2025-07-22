// MilkmanListScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { allMilkmanList } from '../../apiServices/allApi';
import axios from 'axios'; // Import axios for type checking

// =====================================================================
// 1. Type Definitions
// =====================================================================

type Milkman = {
  id: number;
  full_name: string;
  phone_number: string;
  address: string;
  society_name: string;
  flat_number: string;
};

// =====================================================================
// 2. The Render Item Component
// =====================================================================
const MilkmanListItem = React.memo(({ item }: { item: Milkman }) => (
    <View style={styles.milkmanCard}>
      <View style={styles.infoWrapper}>
        <Text style={styles.name}>{item.full_name}</Text>
        <Text style={styles.detail}>
          <Ionicons name="call" size={14} color="#666" /> {item.phone_number}
        </Text>
        <Text style={styles.detail}>
          <Ionicons name="location" size={14} color="#666" /> {item.address}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#C0C0C0" />
    </View>
));

// =====================================================================
// 3. The Main Screen Component
// =====================================================================

const MilkmanListScreen = ({ navigation }: any) => {
  const [milkmans, setMilkmans] = useState<Milkman[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMilkmans = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await allMilkmanList({});
      console.log('Full Milkman List Response:', response.data);
      setMilkmans(response.data?.milkmans || []);
    } catch (err: unknown) { // <-- The fix is here: type is set to 'unknown'
      console.error('Failed to fetch milkman list:', err);

      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error('API Status:', err.response.status);
          console.error('API Data:', err.response.data);
          const errorDetail = err.response.data?.detail || 'Unknown error';
          setError(`API Error: ${err.response.status} - ${errorDetail}`);
        } else if (err.request) {
          setError('Network Error: Could not connect to the server.');
        } else {
          // This line is now safe because we know it's an AxiosError
          setError(`Request Error: ${err.message}`);
        }
      } else if (err instanceof Error) { // <-- Additional type check for other errors
          setError(`Unexpected Error: ${err.message}`);
      } else {
          setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMilkmans();
  }, []);

  const renderMilkmanItem = useCallback(({ item }: { item: Milkman }) => {
    return <MilkmanListItem item={item} />;
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Milkmans...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMilkmans}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enrolled Milkmans</Text>
      </View>
      <FlatList
        data={milkmans}
        keyExtractor={item => item.id.toString()}
        renderItem={renderMilkmanItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.centered}>
            <Text>No milkmen found.</Text>
          </View>
        )}
      />
    </View>
  );
};

// =====================================================================
// 4. Stylesheet
// =====================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 24,
  },
  backButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
  },
  milkmanCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoWrapper: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default MilkmanListScreen;
