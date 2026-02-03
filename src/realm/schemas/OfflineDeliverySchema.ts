import { ObjectSchema } from 'realm';

export const OfflineDeliverySchema: ObjectSchema = {
    name: 'OfflineDelivery',
    primaryKey: 'local_id',
    properties: {
        local_id: 'string', // uuid
        customer_id: 'int',
        milkman_id: 'int',
        date: 'string',
        status: 'string', // delivered | cancelled
        cow_milk: 'double',
        buffalo_milk: 'double',
        remarks: 'string?',
        reason: 'string?',
        isSynced: { type: 'bool', default: false },
        createdAt: 'date',
    },
};
