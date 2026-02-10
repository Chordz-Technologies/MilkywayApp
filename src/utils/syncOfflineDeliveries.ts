import NetInfo from '@react-native-community/netinfo';
import { getUnsyncedDeliveries, markDeliverySynced } from '../realm/offlineDeliveryRealm';
import { markDeliveryAsSuccessful } from '../apiServices/allApi';

export const syncOfflineDeliveries = async () => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) return;

    const deliveries = getUnsyncedDeliveries();

    for (const delivery of deliveries) {
        try {
            await markDeliveryAsSuccessful({
                customer_id: (Number(delivery.customer_id)),
                date: (String(delivery.date)),
                milkman_id: (Number(delivery.milkman_id)),
                status: delivery.status as "delivered" | "cancelled",
                cow_milk: (Number(delivery.cow_milk)),
                buffalo_milk: (Number(delivery.buffalo_milk)),
                remarks: (String(delivery.remarks)),
                reason: (String(delivery.reason)),
            });

            markDeliverySynced((String(delivery.local_id)));
        } catch (e) {
            console.log('Sync failed for delivery', delivery.local_id);
        }
    }
};
