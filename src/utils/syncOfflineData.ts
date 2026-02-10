import NetInfo from '@react-native-community/netinfo';
import { getUnsyncedDeliveries, markDeliverySynced } from '../realm/offlineDeliveryRealm';
import { markDeliveryAsSuccessful } from '../apiServices/allApi';
import { store } from '../store';
import { fetchDistributorCalendarData, applySyncedDelivery } from '../store/distributorSlice';

export const syncOfflineData = async () => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
        console.log('[Sync] No internet connection');
        return;
    }

    console.log('[Sync] Starting offline data sync...');

    // SYNC DELIVERIES
    await syncOfflineDeliveries();

    console.log('[Sync] Sync completed');
};

const pad = (n: number) => String(n).padStart(2, '0');

const syncOfflineDeliveries = async () => {
    const deliveries = getUnsyncedDeliveries();

    if (deliveries.length === 0) {
        console.log('[Sync] No offline deliveries to sync');
        return;
    }

    console.log(`[Sync] Syncing ${deliveries.length} deliveries...`);

    // Track which milkman and month pairs were updated so we can refresh calendars
    const refreshMap: Record<string, Set<string>> = {};

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

            // Immediately update Redux calendar state so UI reflects the change without waiting
            try {
                store.dispatch(applySyncedDelivery({ milkmanId: Number(delivery.milkman_id), date: String(delivery.date), status: String(delivery.status) }));
            } catch (err) {
                console.log('[Sync] Error applying synced delivery to store', err);
            }

            // compute month string from delivery date (YYYY-MM)
            try {
                const d = new Date(String(delivery.date));
                const monthStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
                const milkmanId = String(Number(delivery.milkman_id));
                refreshMap[milkmanId] ??= new Set<string>();
                refreshMap[milkmanId].add(monthStr);
            } catch (err) {
                // ignore date parse failures
            }
        } catch (e) {
            console.log(`[Sync] ❌ Delivery sync failed: ${delivery.local_id}`, e);
        }
    }

    // Dispatch calendar refreshes for affected milkmen/months
    try {
        Object.entries(refreshMap).forEach(([milkmanId, months]) => {
            const id = Number(milkmanId);
            months.forEach((monthStr) => {
                console.log(`[Sync] Dispatching calendar refresh for milkman ${id} month ${monthStr}`);
                store.dispatch(fetchDistributorCalendarData({ milkmanId: id, month: monthStr }));
            });
        });
    } catch (err) {
        console.log('[Sync] Error dispatching calendar refresh', err);
    }
};

