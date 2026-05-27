import { TextField } from '@shopify/polaris';
import './CustomTextInput.css';

type TextFieldType = 'text';

interface CustomTextInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: TextFieldType;
  autoComplete?: string;
  suffix?: string;
  placeholder?: string;
  error?: string;
  onBlur?: () => void;
}

export default function CustomTextInput({
  label,
  value,
  onChange,
  type = 'text',
  autoComplete = 'off',
  suffix,
  placeholder,
  error,
  onBlur,
}: CustomTextInputProps) {
  return (
    <div className="custom-text-input-wrapper">
      <TextField
        label={label}
        type={type}
        autoComplete={autoComplete}
        value={value.toString()}
        onChange={onChange}
        onBlur={onBlur}
        suffix={suffix}
        placeholder={placeholder}
        error={error}
      />
    </div>
  );
}
