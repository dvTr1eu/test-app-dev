import type { DiscountFormValues } from '../types/discountForm';

export const DEFAULT_DISCOUNT_FORM_VALUES: DiscountFormValues = {
    campaign: 'Volume discount #2',
    title: 'Buy more and save',
    description: 'Apply for all products in store',
    options: [
        {
            id: '1',
            title: 'Single',
            subtitle: 'Standard price',
            label: '',
            quantity: 1,
            discountType: 'none',
            amount: 0,
        },
        {
            id: '2',
            title: 'Duo',
            subtitle: 'Save 10%',
            label: 'Popular',
            quantity: 2,
            discountType: 'percentage',
            amount: 10,
        },
    ],
};
