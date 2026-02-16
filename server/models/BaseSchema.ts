
import { SchemaDefinitionProperty } from 'mongoose';

export const SoftDeleteFields = {
  deletedAt: {
    type: Date,
    default: null
  }
};
