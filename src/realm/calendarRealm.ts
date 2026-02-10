import { realm } from './index';

// GET CONSUMER DELIVERY SUMMARY FOR A MONTH (OFFLINE)
export const getConsumerDeliverySummary = (customerId: number, year: number, month: number) => {
    const consumer = realm.objectForPrimaryKey('Consumer', customerId);

    if (!consumer) return { delivered: 0, cancelled: 0, pending: 0, total: 0 };

    try {
        const deliveryHistory = typeof consumer.deliveryHistory === 'string'
            ? JSON.parse(consumer.deliveryHistory)
            : consumer.deliveryHistory || [];

        const monthDeliveries = deliveryHistory.filter((d: any) => {
            const [year_str, month_str] = d.date.split('-');
            return parseInt(year_str) === year && parseInt(month_str) === month;
        });

        const delivered = monthDeliveries.filter((d: any) => d.status === 'delivered').length;
        const cancelled = monthDeliveries.filter((d: any) => d.status === 'cancelled').length;
        const pending = new Date().getMonth() + 1 === month ? 0 : 0; // Calculate pending for current month

        return {
            delivered,
            cancelled,
            pending,
            total: delivered + cancelled + pending,
        };
    } catch (e) {
        console.error('Error calculating delivery summary:', e);
        return { delivered: 0, cancelled: 0, pending: 0, total: 0 };
    }
};

// GET CONSUMER DELIVERY HISTORY FOR A SPECIFIC DATE RANGE (OFFLINE)
export const getConsumerDeliveryHistory = (customerId: number, startDate?: string, endDate?: string) => {
    const consumer = realm.objectForPrimaryKey('Consumer', customerId);

    if (!consumer) return [];

    try {
        const deliveryHistory = typeof consumer.deliveryHistory === 'string'
            ? JSON.parse(consumer.deliveryHistory)
            : consumer.deliveryHistory || [];

        if (!startDate || !endDate) {
            return deliveryHistory;
        }

        return deliveryHistory.filter((d: any) => {
            return d.date >= startDate && d.date <= endDate;
        });
    } catch (e) {
        console.error('Error getting delivery history:', e);
        return [];
    }
};

// GET DELIVERY STATUS FOR A SPECIFIC DATE (OFFLINE)
export const getConsumerDeliveryOnDate = (customerId: number, date: string) => {
    const consumer = realm.objectForPrimaryKey('Consumer', customerId);

    if (!consumer) return null;

    try {
        const deliveryHistory = typeof consumer.deliveryHistory === 'string'
            ? JSON.parse(consumer.deliveryHistory)
            : consumer.deliveryHistory || [];

        return deliveryHistory.find((d: any) => d.date === date) || null;
    } catch (e) {
        console.error('Error getting delivery on date:', e);
        return null;
    }
};

// GET ALL DELIVERIES FOR A MILKMAN IN A MONTH (OFFLINE)
export const getMilkmanMonthSummary = (milkmanId: number, year: number, month: number) => {
    const consumers = realm
        .objects('Consumer')
        .filtered('assigned_distributor_id == $0', milkmanId);

    let totalDelivered = 0;
    let totalCancelled = 0;
    let totalConsumers = 0;

    consumers.forEach((consumer: any) => {
        try {
            const deliveryHistory = typeof consumer.deliveryHistory === 'string'
                ? JSON.parse(consumer.deliveryHistory)
                : consumer.deliveryHistory || [];

            const monthDeliveries = deliveryHistory.filter((d: any) => {
                const [year_str, month_str] = d.date.split('-');
                return parseInt(year_str) === year && parseInt(month_str) === month;
            });

            if (monthDeliveries.length > 0) {
                totalDelivered += monthDeliveries.filter((d: any) => d.status === 'delivered').length;
                totalCancelled += monthDeliveries.filter((d: any) => d.status === 'cancelled').length;
                totalConsumers++;
            }
        } catch (e) {
            console.error('Error processing consumer:', consumer.customer_id, e);
        }
    });

    return {
        totalDelivered,
        totalCancelled,
        totalConsumers,
        totalCount: totalDelivered + totalCancelled,
    };
};

// GET DAILY DELIVERY STATUS FOR CALENDAR VIEW (OFFLINE)
export const getDailyDeliveryStatus = (milkmanId: number, date: string) => {
    const consumers = realm
        .objects('Consumer')
        .filtered('assigned_distributor_id == $0', milkmanId);

    const deliveries: any[] = [];

    consumers.forEach((consumer: any) => {
        try {
            const deliveryHistory = typeof consumer.deliveryHistory === 'string'
                ? JSON.parse(consumer.deliveryHistory)
                : consumer.deliveryHistory || [];

            const dayDelivery = deliveryHistory.find((d: any) => d.date === date);
            if (dayDelivery) {
                deliveries.push({
                    customer_id: consumer.customer_id,
                    customer_name: consumer.customer_name,
                    status: dayDelivery.status,
                    remarks: dayDelivery.remarks,
                });
            }
        } catch (e) {
            console.error('Error processing consumer:', consumer.customer_id, e);
        }
    });

    return deliveries;
};