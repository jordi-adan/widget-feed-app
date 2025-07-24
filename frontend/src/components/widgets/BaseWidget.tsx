import React, { useState, useEffect } from 'react';
import { WidgetDescriptor, LoadingState, ErrorState } from '../../types';
import { widgetDescriptorApi } from '../../services/widgetDescriptorApi';
import './BaseWidget.css';

export interface BaseWidgetProps {
  descriptor: WidgetDescriptor;
  children: (data: any, loading: boolean, error: string | null) => React.ReactNode;
}

export const BaseWidget: React.FC<BaseWidgetProps> = ({ descriptor, children }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (descriptor.type === 'dynamic') {
      const config = descriptor.config as { dataUrl: string; loadingState: LoadingState; errorState: ErrorState };
      fetchData(config.dataUrl, config.loadingState);
    } else {
      // For static widgets, use the staticContent directly
      const config = descriptor.config as { staticContent: any };
      setData(config.staticContent);
    }
  }, [descriptor]);

  const fetchData = async (dataUrl: string, loadingState: LoadingState) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await widgetDescriptorApi.fetchWidgetData(descriptor.id, dataUrl);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const shouldShowLoading = () => {
    if (descriptor.type !== 'dynamic') return false;
    const config = descriptor.config as { loadingState: LoadingState };
    return loading && config.loadingState === 'skeleton';
  };

  const shouldShowError = () => {
    if (!error || descriptor.type !== 'dynamic') return false;
    const config = descriptor.config as { errorState: ErrorState };
    return config.errorState !== 'hidden';
  };

  const handleRetry = () => {
    if (descriptor.type === 'dynamic') {
      const config = descriptor.config as { dataUrl: string; loadingState: LoadingState };
      fetchData(config.dataUrl, config.loadingState);
    }
  };

  const renderError = () => {
    if (!shouldShowError()) return null;

    const config = descriptor.config as { errorState: ErrorState };
    
    return (
      <div className="widget-error">
        {config.errorState === 'message' && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>Failed to load content</span>
          </div>
        )}
        {config.errorState === 'retry' && (
          <div className="error-retry">
            <span className="error-icon">⚠️</span>
            <span>Failed to load content</span>
            <button onClick={handleRetry} className="retry-button">
              Retry
            </button>
          </div>
        )}
      </div>
    );
  };

  if (shouldShowError()) {
    return (
      <div className={`base-widget base-widget--${descriptor.widgetType}`}>
        {renderError()}
      </div>
    );
  }

  return (
    <div className={`base-widget base-widget--${descriptor.widgetType}`}>
      {children(data, shouldShowLoading(), error)}
    </div>
  );
};
