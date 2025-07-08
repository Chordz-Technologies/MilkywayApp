// import { StyleSheet } from 'react-native';

// export const vendorStyles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f8faff' },
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: 18,
//     marginBottom: 10,
//     paddingHorizontal: 18,
//   },
//   avatarSmall: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     borderWidth: 2,
//     borderColor: '#fff',
//     backgroundColor: '#eee',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#222',
//     letterSpacing: 0.5,
//   },
//   profileCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     marginHorizontal: 14,
//     marginBottom: 18,
//     borderRadius: 18,
//     padding: 16,
//     elevation: 3,
//     shadowColor: '#007AFF',
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   avatarLarge: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#eee',
//     borderWidth: 2,
//     borderColor: '#007AFF',
//   },
//   editBtn: {
//     backgroundColor: '#eaf4ff',
//     borderRadius: 16,
//     padding: 6,
//     marginLeft: 10,
//   },
//   profileName: {
//     fontSize: 21,
//     fontWeight: 'bold',
//     color: '#222',
//   },
//   profileLocation: {
//     fontSize: 14,
//     color: '#888',
//     marginTop: 2,
//   },
//   profileRating: {
//     fontSize: 15,
//     color: '#FFD700',
//     fontWeight: 'bold',
//   },
//   statsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginHorizontal: 14,
//     marginBottom: 10,
//   },
//   statsBox: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     padding: 18,
//     marginHorizontal: 6,
//     alignItems: 'center',
//   },
//   statsBoxShadow: {
//     elevation: 2,
//     shadowColor: '#007AFF',
//     shadowOpacity: 0.07,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   statsBoxWide: {
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     padding: 18,
//     marginHorizontal: 14,
//     marginBottom: 16,
//     alignItems: 'center',
//     marginTop: 2,
//   },
//   statsLabel: {
//     fontSize: 14,
//     color: '#888',
//     marginBottom: 2,
//   },
//   statsValue: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#222',
//   },
//   quoteCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#eaf4ff',
//     borderRadius: 14,
//     marginHorizontal: 14,
//     marginBottom: 18,
//     padding: 12,
//     elevation: 1,
//   },
//   milkImage: {
//     width: 70,
//     height: 90,
//     borderRadius: 10,
//     marginRight: 14,
//     backgroundColor: '#fff',
//   },
//   dailyQuoteTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#007AFF',
//     marginBottom: 2,
//   },
//   dailyQuoteText: {
//     fontSize: 14,
//     color: '#444',
//     marginBottom: 4,
//   },
//   dailyQuoteOffer: {
//     fontSize: 13,
//     color: '#007AFF',
//     fontWeight: 'bold',
//     marginTop: 2,
//   },
//   sectionTitle: {
//     fontSize: 17,
//     fontWeight: 'bold',
//     color: '#222',
//     marginLeft: 18,
//     marginTop: 10,
//     marginBottom: 8,
//   },
//   searchBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f3f3f3',
//     borderRadius: 8,
//     marginHorizontal: 16,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//     height: 40,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 15,
//     color: '#222',
//   },
//   customerListCard: {
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     marginHorizontal: 14,
//     marginBottom: 18,
//     paddingVertical: 8,
//     paddingHorizontal: 8,
//     elevation: 1,
//   },
//   customerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginHorizontal: 4,
//     marginBottom: 10,
//     paddingBottom: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   customerName: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#222',
//   },
//   customerAddress: {
//     fontSize: 13,
//     color: '#888',
//   },
//   customerStatus: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     minWidth: 60,
//     textAlign: 'right',
//   },
//   statusPaid: {
//     color: '#4CD964',
//   },
//   statusPending: {
//     color: '#FF6B6B',
//   },
//   quickActionsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginHorizontal: 10,
//     marginTop: 8,
//     marginBottom: 80,
//   },
//   quickActionBox: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     alignItems: 'center',
//     marginHorizontal: 4,
//     padding: 12,
//   },
//   quickActionShadow: {
//     elevation: 2,
//     shadowColor: '#007AFF',
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   quickActionImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     marginBottom: 8,
//     backgroundColor: '#eaf4ff',
//   },
//   quickActionTitle: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     color: '#222',
//     marginBottom: 2,
//   },
//   quickActionSubtitle: {
//     fontSize: 13,
//     color: '#888',
//     marginBottom: 6,
//   },
//   quickActionButton: {
//     backgroundColor: '#eaf4ff',
//     borderRadius: 16,
//     paddingVertical: 4,
//     paddingHorizontal: 18,
//     marginTop: 2,
//   },
//   quickActionButtonText: {
//     color: '#007AFF',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   bottomNav: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     height: 56,
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: 10,
//     elevation: 2,
//   },
// });
import { StyleSheet } from 'react-native';

export const vendorStyles = StyleSheet.create({
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

  profileInfoWrapper: {
    marginLeft: 16,
    flex: 1,
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

  profileRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  profileRating: {
    fontSize: 15,
    color: '#FFD700',
    fontWeight: 'bold',
  },

  editBtn: {
    backgroundColor: '#eaf4ff',
    borderRadius: 16,
    padding: 6,
    marginLeft: 10,
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
  iconMarginRight: {
  marginRight: 6,
},
iconMarginBottom: {
  marginBottom: 4,
},
noCustomerText: {
  color: '#888',
  textAlign: 'center',
  marginVertical: 12,
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
