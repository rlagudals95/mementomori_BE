import {
  ConditionTransaction,
  CreateTransaction,
  DeleteTransaction,
  GetTransaction,
  UpdateTransaction,
} from 'dynamoose/dist/Model';

export declare type TransactionType = {
  get: GetTransaction;
  create: CreateTransaction;
  delete: DeleteTransaction;
  update: UpdateTransaction;
  condition: ConditionTransaction;
};

export interface TransactionProvidable {
  get transaction(): TransactionType;
}
