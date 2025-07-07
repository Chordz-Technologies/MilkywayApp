import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,

} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


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
                {/* Header */}
                <View style={styles.headerRow}>
                    <Image
                        source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
                        style={styles.avatarSmall}
                    />
                    <Text style={styles.headerTitle}>Home</Text>
                    <Ionicons name="notifications-outline" size={26} color="#007AFF" />
                </View>

                {/* Profile */}
                <View style={styles.profileCard}>
                    <Image
                        source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
                        style={styles.avatarLarge}
                    />
                    <View style={{ marginLeft: 16, flex: 1 }}>
                        <Text style={styles.profileName}>Vendor</Text>
                        <Text style={styles.profileLocation}>Pune</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.profileRating}> 4.8</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.editBtn}>
                        <Ionicons name="create-outline" size={18} color="#007AFF" />
                    </TouchableOpacity>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={[styles.statsBox, styles.statsBoxShadow]}>
                        <Ionicons name="people" size={24} color="#007AFF" style={{ marginBottom: 4 }} />
                        <Text style={styles.statsLabel}>Total Customers</Text>
                        <Text style={styles.statsValue}>120</Text>
                    </View>
                    <View style={[styles.statsBox, styles.statsBoxShadow]}>
                        <Ionicons name="alert-circle" size={24} color="#FF6B6B" style={{ marginBottom: 4 }} />
                        <Text style={styles.statsLabel}>Payment Defaulters</Text>
                        <Text style={styles.statsValue}>5</Text>
                    </View>
                </View>
                <View style={[styles.statsBoxWide, styles.statsBoxShadow]}>
                    <Ionicons name="checkmark-done-circle" size={24} color="#4CD964" style={{ marginBottom: 4 }} />
                    <Text style={styles.statsLabel}>Customers Paid Bills</Text>
                    <Text style={styles.statsValue}>115</Text>
                </View>

                {/* Daily Quote */}
                <View style={styles.quoteCard}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' }}
                        style={styles.milkImage}
                    />
                    <View style={{ flex: 1 }}>
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

                {/* Customer List */}
                <Text style={styles.sectionTitle}>Customer List</Text>
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={18} color="#888" style={{ marginRight: 6 }} />
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
                        <Text style={{ color: '#888', textAlign: 'center', marginVertical: 12 }}>
                            No customers found.
                        </Text>
                    ) : (
                        filteredCustomers.map(c => (
                            <View key={c.id} style={styles.customerRow}>
                                <View>
                                    <Text style={styles.customerName}>{c.name}</Text>
                                    <Text style={styles.customerAddress}>{c.address}</Text>
                                </View>
                                <Text style={[
                                    styles.customerStatus,
                                    c.status === 'Paid' ? styles.statusPaid : styles.statusPending
                                ]}>
                                    {c.status}
                                </Text>
                            </View>
                        ))
                    )}
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActionsRow}>
                    <View style={[styles.quickActionBox, styles.quickActionShadow]}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' }}
                            style={styles.quickActionImage}
                        />
                        <Text style={styles.quickActionTitle}>Today's Orders</Text>
                        <Text style={styles.quickActionSubtitle}>12 new orders</Text>
                        <TouchableOpacity style={styles.quickActionButton}>
                            <Text style={styles.quickActionButtonText}>View</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.quickActionBox, styles.quickActionShadow]}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' }}
                            style={styles.quickActionImage}
                        />
                        <Text style={styles.quickActionTitle}>Inventory Status</Text>
                        <Text style={styles.quickActionSubtitle}>Sufficient stock</Text>
                        <TouchableOpacity style={styles.quickActionButton}>
                            <Text style={styles.quickActionButtonText}>View</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.quickActionBox, styles.quickActionShadow]}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' }}
                            style={styles.quickActionImage}
                        />
                        <Text style={styles.quickActionTitle}>Customer Reviews</Text>
                        <Text style={styles.quickActionSubtitle}>feedback</Text>
                        <TouchableOpacity style={styles.quickActionButton}>
                            <Text style={styles.quickActionButtonText}>View</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bottom Navigation (Mock) */}
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8faff' },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 18,
        marginBottom: 10,
        paddingHorizontal: 18,
    },
    avatarSmall: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
        letterSpacing: 0.5,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 14,
        marginBottom: 18,
        borderRadius: 18,
        padding: 16,
        elevation: 3,
        shadowColor: '#007AFF',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#eee',
        borderWidth: 2,
        borderColor: '#007AFF',
    },
    editBtn: {
        backgroundColor: '#eaf4ff',
        borderRadius: 16,
        padding: 6,
        marginLeft: 10,
    },
    profileName: {
        fontSize: 21,
        fontWeight: 'bold',
        color: '#222',
    },
    profileLocation: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
    },
    profileRating: {
        fontSize: 15,
        color: '#FFD700',
        fontWeight: 'bold',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 14,
        marginBottom: 10,
    },
    statsBox: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 18,
        marginHorizontal: 6,
        alignItems: 'center',
    },
    statsBoxShadow: {
        elevation: 2,
        shadowColor: '#007AFF',
        shadowOpacity: 0.07,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    statsBoxWide: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 18,
        marginHorizontal: 14,
        marginBottom: 16,
        alignItems: 'center',
        marginTop: 2,
    },
    statsLabel: {
        fontSize: 14,
        color: '#888',
        marginBottom: 2,
    },
    statsValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
    },
    quoteCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eaf4ff',
        borderRadius: 14,
        marginHorizontal: 14,
        marginBottom: 18,
        padding: 12,
        elevation: 1,
    },
    milkImage: {
        width: 70,
        height: 90,
        borderRadius: 10,
        marginRight: 14,
        backgroundColor: '#fff',
    },
    dailyQuoteTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 2,
    },
    dailyQuoteText: {
        fontSize: 14,
        color: '#444',
        marginBottom: 4,
    },
    dailyQuoteOffer: {
        fontSize: 13,
        color: '#007AFF',
        fontWeight: 'bold',
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#222',
        marginLeft: 18,
        marginTop: 10,
        marginBottom: 8,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f3f3',
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 10,
        paddingHorizontal: 10,
        height: 40,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#222',
    },
    customerListCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        marginHorizontal: 14,
        marginBottom: 18,
        paddingVertical: 8,
        paddingHorizontal: 8,
        elevation: 1,
    },
    customerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 4,
        marginBottom: 10,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    customerName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
    },
    customerAddress: {
        fontSize: 13,
        color: '#888',
    },
    customerStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        minWidth: 60,
        textAlign: 'right',
    },
    statusPaid: {
        color: '#4CD964',
    },
    statusPending: {
        color: '#FF6B6B',
    },
    quickActionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginTop: 8,
        marginBottom: 80,
    },
    quickActionBox: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 14,
        alignItems: 'center',
        marginHorizontal: 4,
        padding: 12,
    },
    quickActionShadow: {
        elevation: 2,
        shadowColor: '#007AFF',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    quickActionImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: '#eaf4ff',
    },
    quickActionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 2,
    },
    quickActionSubtitle: {
        fontSize: 13,
        color: '#888',
        marginBottom: 6,
    },
    quickActionButton: {
        backgroundColor: '#eaf4ff',
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 18,
        marginTop: 2,
    },
    quickActionButtonText: {
        color: '#007AFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 56,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        elevation: 2,
    },
});