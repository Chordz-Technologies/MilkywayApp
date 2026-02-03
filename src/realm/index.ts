import Realm from 'realm';
import { ConsumerSchema } from './schemas/ConsumerSchema';
import { OfflineDeliverySchema } from './schemas/OfflineDeliverySchema';

export const realm = new Realm({
  schema: [ConsumerSchema, OfflineDeliverySchema],
  schemaVersion: 2,
});
