import { realm } from './index';
import uuid from 'react-native-uuid';

export const saveOfflineDelivery = (payload: any) => {
    realm.write(() => {
        realm.create('OfflineDelivery', {
            local_id: uuid.v4() as string,
            ...payload,
            isSynced: false,
            createdAt: new Date(),
        });
    });
};

export const getUnsyncedDeliveries = () => {
    return realm.objects('OfflineDelivery').filtered('isSynced == false');
};

export const markDeliverySynced = (local_id: string) => {
    realm.write(() => {
        const record = realm.objectForPrimaryKey('OfflineDelivery', local_id);
        if (record) record.isSynced = true;
    });
};
