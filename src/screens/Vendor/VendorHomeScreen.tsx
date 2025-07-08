import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { vendorStyles as styles } from '../../styles/VendorHomeStyle';

const customers = [
  { id: '1', name: 'User1', address: 'User Address', status: 'Paid' },
  { id: '2', name: 'User2', address: 'User Address', status: 'Pending' },
  { id: '3', name: 'User3', address: 'User Address', status: 'Paid' },
];

export default function VendorHomeScreen() {
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
            style={styles.avatarSmall}
          />
          <Text style={styles.headerTitle}>Home</Text>
          <Ionicons name="notifications-outline" size={26} color="#007AFF" />
        </View>

        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
            style={styles.avatarLarge}
          />
          <View style={styles.profileInfoWrapper}>
            <Text style={styles.profileName}>Vendor</Text>
            <Text style={styles.profileLocation}>Pune</Text>
            <View style={styles.profileRatingRow}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.profileRating}> 4.8</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="create-outline" size={18} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statsBox, styles.statsBoxShadow]}>
            <Ionicons name="people" size={24} color="#007AFF" style={styles.iconMarginBottom} />
            <Text style={styles.statsLabel}>Total Customers</Text>
            <Text style={styles.statsValue}>120</Text>
          </View>
          <View style={[styles.statsBox, styles.statsBoxShadow]}>
            <Ionicons name="alert-circle" size={24} color="#FF6B6B" style={styles.iconMarginBottom} />
            <Text style={styles.statsLabel}>Payment Defaulters</Text>
            <Text style={styles.statsValue}>5</Text>
          </View>
        </View>

        <View style={[styles.statsBoxWide, styles.statsBoxShadow]}>
          <Ionicons name="checkmark-done-circle" size={24} color="#4CD964" style={styles.iconMarginBottom} />
          <Text style={styles.statsLabel}>Customers Paid Bills</Text>
          <Text style={styles.statsValue}>115</Text>
        </View>

        <View style={styles.quoteCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' }}
            style={styles.milkImage}
          />
          <View style={styles.profileInfoWrapper}>
            <Text style={styles.dailyQuoteTitle}>Daily Quote</Text>
            <Text style={styles.dailyQuoteText}>
              Start your day with the goodness of fresh milk.
            </Text>
            <Text style={styles.dailyQuoteOffer}>
              <Ionicons name="pricetag" size={14} color="#007AFF" />
              {'  '}10% off on all orders above $50
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Customer List</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#888" style={styles.iconMarginRight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers"
            placeholderTextColor="#bbb"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.customerListCard}>
          {filteredCustomers.length === 0 ? (
            <Text style={styles.noCustomerText}>
              No customers found.
            </Text>
          ) : (
            filteredCustomers.map(c => (
              <View key={c.id} style={styles.customerRow}>
                <View>
                  <Text style={styles.customerName}>{c.name}</Text>
                  <Text style={styles.customerAddress}>{c.address}</Text>
                </View>
                <Text
                  style={[
                    styles.customerStatus,
                    c.status === 'Paid' ? styles.statusPaid : styles.statusPending,
                  ]}
                >
                  {c.status}
                </Text>
              </View>
            ))
          )}
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          {["Today's Orders", 'Inventory Status', 'Customer Reviews'].map((title, index) => (
            <View key={index} style={[styles.quickActionBox, styles.quickActionShadow]}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' }}
                style={styles.quickActionImage}
              />
              <Text style={styles.quickActionTitle}>{title}</Text>
              <Text style={styles.quickActionSubtitle}>
                {index === 0 ? '12 new orders' : index === 1 ? 'Sufficient stock' : 'feedback'}
              </Text>
              <TouchableOpacity style={styles.quickActionButton}>
                <Text style={styles.quickActionButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.bottomNav}>
          <Ionicons name="home" size={26} color="#007AFF" />
          <Ionicons name="menu" size={26} color="#bbb" />
          <Ionicons name="cube" size={26} color="#bbb" />
          <Ionicons name="person" size={26} color="#bbb" />
        </View>
      </ScrollView>
    </View>
  );
}
