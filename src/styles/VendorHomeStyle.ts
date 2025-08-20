import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#666',
  },
  logoutButton: {
    padding: 6,
    borderRadius: 5,
    backgroundColor: '#eee',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#ddd',
    marginRight: 16,
  },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  profileLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statsSection: {
    marginBottom: 15,
  },
  statsLabel: { // <---
    fontSize: 16,
    color: '#222',
    marginBottom: 3,
  },
  statsValue: { // <---
    fontSize: 17,
    fontWeight: 'bold',
    color: '#444',
  },
  pendingCard: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 6,
    marginBottom: 15,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 12,
    marginTop: 12,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#eee',
    alignItems: 'center',
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#0084ff',
  },
  tabText: {
    fontSize: 15,
    color: '#555',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  listContainer: {
    marginTop: 4,
    marginBottom: 8,
  },
  listItem: {
    backgroundColor: '#f7f7f7',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarSmall: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0084ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  listItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  listItemSubtext: {
    fontSize: 12,
    color: '#555',
  },
  statusBadge: {
    backgroundColor: '#eee',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#222',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 27,
  },
  emptyText: {
    fontSize: 15,
    color: '#aaa',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#0084ff',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
