import { ObjectSchema } from 'realm';

export const ConsumerSchema: ObjectSchema = {
    name: 'Consumer',
    primaryKey: 'customer_id',
    properties: {
        customer_id: 'int',
        customer_name: 'string',
        customer_contact: 'string?',
        assigned_distributor_id: 'int?',
        milk_requirement: 'string?', // JSON
        deliveryHistory: 'string?',  // JSON
        isSynced: { type: 'bool', default: true },
        updatedAt: 'date?',
    },
};