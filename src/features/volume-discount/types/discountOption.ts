export type DiscountType = 'none' | 'percentage' | 'each';
import type { SelectOption } from '@shopify/polaris';

export const DISCOUNT_TYPE_OPTIONS: SelectOption[] = [
    { label: 'None', value: 'none' },
    { label: '% discount', value: 'percentage' },
    { label: 'Discount / each', value: 'each' }
];

export interface DiscountOptionFormValues {
    id: string;
    title: string;
    subtitle: string;
    label: string;
    quantity: number;
    discountType: DiscountType;
    amount: number;
}

export type DiscountOption = DiscountOptionFormValues;
