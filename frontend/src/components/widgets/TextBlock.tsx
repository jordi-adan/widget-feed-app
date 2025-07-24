import React from 'react';
import { BaseWidget } from './BaseWidget';
import { WidgetDescriptor } from '../../types';
import './TextBlock.css';

export interface TextBlockProps {
  descriptor: WidgetDescriptor;
}

export const TextBlock: React.FC<TextBlockProps> = ({ descriptor }) => {
  return (
    <BaseWidget descriptor={descriptor}>
      {(data, loading, error) => {
        if (loading) {
          return (
            <div className="widget-skeleton">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
          );
        }

        if (!data) {
          return <div className="text-block-empty">No content available</div>;
        }

        return (
          <div className="text-block">
            <div className="text-block__content">
              {data.title && (
                <h3 className="text-block__title">{data.title}</h3>
              )}
              
              {data.text && (
                <div className={`text-block__text ${data.markdown ? 'markdown' : ''}`}>
                  {data.text}
                </div>
              )}
              
              {data.style && (
                <div className={`text-block__style-indicator text-block__style-indicator--${data.style}`}>
                  {data.style}
                </div>
              )}
            </div>
            
            {data.metadata && (
              <div className="text-block__metadata">
                {data.metadata.author && (
                  <span className="metadata-item">By {data.metadata.author}</span>
                )}
                {data.metadata.timestamp && (
                  <span className="metadata-item">
                    {new Date(data.metadata.timestamp).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      }}
    </BaseWidget>
  );
};
