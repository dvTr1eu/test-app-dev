import { Spinner, Text } from '@shopify/polaris';
import './FullScreenLoading.css';

interface FullScreenLoadingProps {
  message?: string;
}

export default function FullScreenLoading({
  message = 'Saving...',
}: FullScreenLoadingProps) {
  return (
    <div className="fullscreen-loading-overlay" role="status" aria-live="polite">
      <div className="fullscreen-loading-content">
        <Spinner accessibilityLabel="Saving data" size="large" />
        <Text as="p" variant="bodyMd">
          {message}
        </Text>
      </div>
    </div>
  );
}
