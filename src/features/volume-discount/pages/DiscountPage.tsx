import { useState } from 'react';
import { useForm, Controller, useFieldArray, type FieldErrors } from 'react-hook-form';
import { saveVolumeDiscount } from '../api/saveVolumeDiscount';
import {
  Page,
  Grid,
  Card,
  FormLayout,
  Button,
  BlockStack,
  Text,
  Banner,
  InlineError,
} from '@shopify/polaris';
import type { DiscountFormValues } from '../types/discountForm';
import type { DiscountOptionFormValues, DiscountType } from '../types/discountOption';
import { DEFAULT_DISCOUNT_FORM_VALUES } from '../constants/defaultDiscountForm';
import OptionItem from '../components/OptionItem';
import FullScreenLoading from '../components/FullScreenLoading';
import { useNavigate } from 'react-router-dom';
import { FaCirclePlus } from "react-icons/fa6";

import './DiscountPage.css';
import CustomTextInput from '../components/CustomTextInput';
import { validateRequiredText } from '../utils/validators';

function hasErrorMessages(errors: FieldErrors<DiscountFormValues>): boolean {
  const visit = (value: unknown): boolean => {
    if (!value || typeof value !== 'object') {
      return false;
    }
    if ('message' in value && typeof (value as { message?: string }).message === 'string') {
      return true;
    }
    return Object.values(value).some(visit);
  };

  return visit(errors);
}

export default function DiscountPage() {
  const navigate = useNavigate();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    watch,
    trigger,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<DiscountFormValues>({
    defaultValues: DEFAULT_DISCOUNT_FORM_VALUES,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const formValues = watch();

  const isSaveDisabled =
    isSaving ||
    fields.length < 1 ||
    !isValid ||
    hasErrorMessages(errors);

  const handleSave = async () => {
    setSaveSuccess(false);

    const optionsError = validateRequiredText(fields.length.toString(), 'Quantity');
    if (optionsError !== true) {
      setError('options', { type: 'manual', message: optionsError });
    }

    setIsSaving(true);
    try {
      await saveVolumeDiscount(getValues());
      setSaveSuccess(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddOption = () => {
    const previousOptions = formValues.options;
    const lastQuantity =
      previousOptions.length > 0
        ? previousOptions[previousOptions.length - 1].quantity
        : 0;

    const newIndex = fields.length;

    const newOption: DiscountOptionFormValues = {
      id: Date.now().toString(),
      title: '',
      subtitle: '',
      label: '',
      quantity: lastQuantity + 1,
      discountType: 'none',
      amount: 0,
    };
    append(newOption);
    clearErrors('options');

    const titleError = validateRequiredText('', 'Title');
    if (titleError !== true) {
      setError(`options.${newIndex}.title`, { type: 'manual', message: titleError });
    }

    requestAnimationFrame(() => {
      void trigger(`options.${newIndex}.title`);
    });
  };

  const getDiscountTypeLabel = (type: DiscountType): string => {
    switch (type) {
      case 'none':
        return 'None';
      case 'percentage':
        return '%discount';
      case 'each':
        return '$';
      default:
        return '';
    }
  };

  const getAmountLabel = (type: DiscountType, amount: number): string => {
    switch (type) {
      case 'none':
        return '-';
      case 'percentage':
        return `${amount} %`;
      case 'each':
        return `${amount} $`;
    }
  };

  return (
    <div className="discount-page">
    {isSaving && <FullScreenLoading message="Saving volume discount..." />}
    <Page
      title="Create volume discount"
      backAction={{
        content: 'Back',
        accessibilityLabel: 'Back to volume discounts',
        onAction: () => navigate('/'),
      }}
      primaryAction={{
        content: 'Save',
        onAction: handleSave,
        loading: isSaving,
        disabled: isSaveDisabled,
      }}
    >
      <div className="discount-page-spacing">
      {saveSuccess && (
        <Banner tone="success" onDismiss={() => setSaveSuccess(false)}>
          Volume discount saved successfully.
        </Banner>
      )}
      <Grid columns={{ xs: 1, lg: 12 }} gap={{ xs: '400', lg: '400' }}>
        <Grid.Cell columnSpan={{ xs: 1, lg: 7 }}>
          <BlockStack gap="400">
            {/* General Section */}
            <Card padding="600">
              <BlockStack gap="400" >
                <div>
                  <Text variant="headingMd" as="h2">
                    General
                  </Text>
                </div>

                <FormLayout>
                  <Controller
                    name="campaign"
                    control={control}
                    rules={{ validate: (value) =>
                      validateRequiredText(value, 'Campaign name'), }}
                    render={({ field, fieldState }) => (
                      <CustomTextInput
                        label="Campaign"
                        autoComplete="off"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={fieldState.error?.message}
                      />
                    )}
                  />

                  <Controller
                    name="title"
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
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <CustomTextInput
                        label="Description"
                        autoComplete="off"
                        {...field}
                      />
                    )}
                  />
                </FormLayout>
              </BlockStack>
            </Card>

            {/* Volume Discount Rule Section */}
            
              <BlockStack>
                <div className="option-section-header">
                  <Text variant="headingMd" as="h2">
                    Volume discount rule
                  </Text>
                </div>

                {errors.options?.message && (
                  <div className="discount-page-options-error">
                    <InlineError message={errors.options.message} fieldID="options" />
                  </div>
                )}

                <BlockStack>
                  {fields.map((field, index) => (
                    <OptionItem
                      key={field.id}
                      index={index}
                      control={control}
                      onRemove={(index) => {
                        remove(index);
                        if (fields.length <= 1) {
                          const optionsError = validateRequiredText('0', 'Quantity');
                          if (optionsError !== true) {
                            setError('options', { type: 'manual', message: optionsError });
                          }
                        } else {
                          clearErrors('options');
                        }
                      }}
                      trigger={trigger}
                    />
                  ))}
                </BlockStack>

                <div className="custom-add-button">
  <Button
    onClick={handleAddOption}
    icon={<FaCirclePlus size={18} />}
    variant="primary"
  >
    Add option
  </Button>
</div>
              </BlockStack>
          </BlockStack>
        </Grid.Cell>

        <Grid.Cell columnSpan={{ xs: 1, lg: 5 }}>
          <Card>
            <BlockStack gap="400">
              <div>
                <Text variant="headingMd" as="h2">
                  Preview
                </Text>
              </div>

              <div className="preview-content">
                <div className="preview-title">
                  <Text variant="headingMd" as="h3" alignment='center'>
                    {formValues.title || 'Buy more and save'}
                  </Text>
                </div>

                <div className="preview-description">
                  <Text as="p">
                    {formValues.description || 'Apply for all products in store'}
                  </Text>
                </div>

                <div className="preview-table">
                  <div className="preview-table-header">
                    <div className="preview-table-cell preview-table-cell--title">Title</div>
                    <div className="preview-table-cell preview-table-cell--discount">
                      <span className="preview-table-cell-inner">Discount Type</span>
                    </div>
                    <div className="preview-table-cell preview-table-cell--quantity">
                      <span className="preview-table-cell-inner">Quantity</span>
                    </div>
                    <div className="preview-table-cell preview-table-cell--amount">
                      <span className="preview-table-cell-inner">Amount</span>
                    </div>
                  </div>
                  {formValues.options.map((option) => (
                    <div key={option.id} className="preview-table-row">
                      <div className="preview-table-cell preview-table-cell--title">{option.title}</div>
                      <div className="preview-table-cell preview-table-cell--discount">
                        <span className="preview-table-cell-inner">
                          {getDiscountTypeLabel(option.discountType)}
                        </span>
                      </div>
                      <div className="preview-table-cell preview-table-cell--quantity">
                        <span className="preview-table-cell-inner">{option.quantity}</span>
                      </div>
                      <div className="preview-table-cell preview-table-cell--amount">
                        <span className="preview-table-cell-inner">
                          {getAmountLabel(option.discountType, option.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </BlockStack>
          </Card>
        </Grid.Cell>
      </Grid>
      </div>
    </Page>
    </div>
  );
}
