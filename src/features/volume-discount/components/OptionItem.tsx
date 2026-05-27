import { useEffect } from 'react';
import {
  Controller,
  useWatch,
  type Control,
  type UseFormTrigger,
} from 'react-hook-form';
import {
  FormLayout,
  Select,
  InlineGrid,
  Button,
  BlockStack,
  TextField,
} from '@shopify/polaris';
import type { DiscountFormValues } from '../types/discountForm';
import type { DiscountType } from '../types/discountOption';
import { DISCOUNT_TYPE_OPTIONS } from '../types/discountOption';
import { FaTrashCan } from "react-icons/fa6";
import {
  validateQuantity,
  validateAmount,
  sanitizeIntegerInput,
  sanitizeDecimalInput,
  validateRequiredText,
} from '../utils/validators';

import './OptionItem.css';
import CustomTextInput from './CustomTextInput';

interface OptionItemProps {
  index: number;
  control: Control<DiscountFormValues>;
  onRemove: (index: number) => void;
  trigger: UseFormTrigger<DiscountFormValues>;
}

export default function OptionItem({
  index,
  control,
  onRemove,
  trigger,
}: OptionItemProps) {
  const discountType = useWatch({
    control,
    name: `options.${index}.discountType`,
  }) as DiscountType;

  const titleValue = useWatch({
    control,
    name: `options.${index}.title`,
  });

  useEffect(() => {
    if (!titleValue?.trim()) {
      void trigger(`options.${index}.title`);
    }
  }, [index, titleValue, trigger]);

  const getAmountSuffix = (type: DiscountType): string => {
    switch (type) {
      case 'percentage':
        return '%';
      case 'each':
        return '$';
      default:
        return '';
    }
  };

  const shouldShowAmount = discountType !== 'none';

  return (
    <div className="custom-option-item">
      <BlockStack gap="400">
        <div className="option-header">
          <div className="option-badge">
            OPTION {index + 1}
          </div>

          <Button
            tone="critical"
            variant="plain"
            icon={<FaTrashCan size={18} />}
            onClick={() => onRemove(index)}
          >
          </Button>
        </div>

        <FormLayout>
          <InlineGrid columns={3} gap="1600">
            <Controller
              name={`options.${index}.title`}
              control={control}
              rules={{ validate: (value) =>
                validateRequiredText(value, 'Title'), }}
              render={({ field, fieldState }) => (
                <CustomTextInput
                  label="Title"
                  autoComplete="off"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name={`options.${index}.subtitle`}
              control={control}
              render={({ field }) => (
                <CustomTextInput
                  label="Subtitle"
                  autoComplete="off"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name={`options.${index}.label`}
              control={control}
              render={({ field }) => (
                <CustomTextInput
                  label="Label (optional)"
                  autoComplete="off"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </InlineGrid>

          <InlineGrid columns={3} gap="1600">
            <div className="custom-quantity-input">
              <Controller
                name={`options.${index}.quantity`}
                control={control}
                rules={{ validate: validateQuantity }}
                render={({ field, fieldState }) => (
                  <TextField
                    label="Quantity"
                    type="number"
                    autoComplete="off"
                    min={1}
                    value={field.value === 0 ? '' : String(field.value)}
                    onChange={(value) => {
                      const sanitized = sanitizeIntegerInput(value);
                      field.onChange(sanitized === '' ? 0 : parseInt(sanitized, 10));
                    }}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            <div className="custom-select-wrapper">
              <Controller
                name={`options.${index}.discountType`}
                control={control}
                render={({ field }) => (
                  <Select
                    label="Discount type"
                    options={DISCOUNT_TYPE_OPTIONS}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      void trigger(`options.${index}.amount`);
                    }}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </div>

            {shouldShowAmount && (
              <div className="custom-quantity-input">
                <Controller
                  name={`options.${index}.amount`}
                  control={control}
                  rules={{ validate: validateAmount }}
                  render={({ field, fieldState }) => (
                    <TextField
                      label="Amount"
                      type="number"
                      autoComplete="off"
                      min={0.01}
                      step={0.01}
                      value={field.value === 0 ? '' : String(field.value)}
                      onChange={(value) => {
                        const sanitized = sanitizeDecimalInput(value);
                        field.onChange(sanitized === '' ? 0 : parseFloat(sanitized));
                      }}
                      onBlur={field.onBlur}
                      suffix={getAmountSuffix(discountType)}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>
            )}
          </InlineGrid>
        </FormLayout>
      </BlockStack>
    </div>
  );
}
