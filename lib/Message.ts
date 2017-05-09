import { Card } from './Card';

export const OPERATION_ADD = 'OPERATION_ADD';
export const OPERATION_REMOVE = 'OPERATION_REMOVE';
export const OPERATION_EDIT = 'OPERATION_EDIT';

export interface Message {
    card?: Card;
    operation?: string;
}