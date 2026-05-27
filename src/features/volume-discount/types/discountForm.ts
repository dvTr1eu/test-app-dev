import type { DiscountOptionFormValues } from './discountOption';

export interface DiscountFormValues {
    campaign: string;
    title: string;
    description: string;
    options: DiscountOptionFormValues[];
}
