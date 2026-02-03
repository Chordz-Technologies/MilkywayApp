import { realm } from './index';
import Realm from 'realm';

export const saveConsumers = (consumers: any[]) => {
    realm.write(() => {
        consumers.forEach(c => {
            realm.create(
                'Consumer',
                {
                    ...c,
                    milk_requirement: JSON.stringify(c.milk_requirement),
                    deliveryHistory: JSON.stringify(c.deliveryHistory || []),
                    isSynced: true,
                    updatedAt: new Date(),
                },
                Realm.UpdateMode.Modified
            );
        });
    });
};

export const getConsumersOffline = (milkmanId: number) => {
    return realm
        .objects('Consumer')
        .filtered('assigned_distributor_id == $0', milkmanId);
};