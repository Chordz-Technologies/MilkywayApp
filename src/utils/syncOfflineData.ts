import NetInfo from '@react-native-community/netinfo';
import { getUnsyncedDeliveries, markDeliverySynced } from '../realm/offlineDeliveryRealm';
import { markDeliveryAsSuccessful } from '../apiServices/allApi';

export const syncOfflineData = async () => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
        console.log('[Sync] No internet connection');
        return;
    }

    console.log('[Sync] Starting offline data sync...');

    // 🔥 SYNC DELIVERIES
    await syncOfflineDeliveries();

    console.log('[Sync] Sync completed');
};

const syncOfflineDeliveries = async () => {
    const deliveries = getUnsyncedDeliveries();

    if (deliveries.length === 0) {
        console.log('[Sync] No offline deliveries to sync');
        return;
    }

    console.log(`[Sync] Syncing ${deliveries.length} deliveries...`);

    for (const delivery of deliveries) {
        try {
            await markDeliveryAsSuccessful({
                customer_id: Number(delivery.customer_id),
                date: String(delivery.date),
                milkman_id: Number(delivery.milkman_id),
                status: delivery.status as "delivered" | "cancelled",
                cow_milk: Number(delivery.cow_milk),
                buffalo_milk: Number(delivery.buffalo_milk),
                remarks: String(delivery.remarks || ''),
                reason: String(delivery.reason || ''),
            });

            markDeliverySynced(String(delivery.local_id));
            console.log(`[Sync] ✅ Delivery synced: ${delivery.local_id}`);
        } catch (e) {
            console.log(`[Sync] ❌ Delivery sync failed: ${delivery.local_id}`, e);
        }
    }
};

