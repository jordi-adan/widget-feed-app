import React from 'react';
import { BaseWidget } from './BaseWidget';
import { WidgetDescriptor } from '../../types';
import './HighlightBanner.css';

export interface HighlightBannerProps {
  descriptor: WidgetDescriptor;
}

export interface CTAButton {
  text: string;
  url: string;
  style: 'primary' | 'secondary';
}

export const HighlightBanner: React.FC<HighlightBannerProps> = ({ descriptor }) => {
  return (
    <BaseWidget descriptor={descriptor}>
      {(data, loading, error) => {
        if (loading) {
          return (
            <div className="widget-skeleton" data-testid="banner-skeleton">
              <div className="skeleton-banner">
                <div className="skeleton-line skeleton-line--title"></div>
                <div className="skeleton-line skeleton-line--subtitle"></div>
                <div className="skeleton-line skeleton-line--description"></div>
                <div className="skeleton-button"></div>
              </div>
            </div>
          );
        }

        if (!data || Object.keys(data).length === 0) {
          return <div className="highlight-banner-empty">No banner content available</div>;
        }

        const {
          title,
          subtitle,
          description,
          backgroundImage,
          ctaButton,
          theme = 'light'
        } = data;

        const bannerStyle = backgroundImage ? {
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {};

        return (
          <div 
            className={`highlight-banner highlight-banner--${theme}`}
            style={bannerStyle}
            data-testid="highlight-banner"
          >
            <div className="highlight-banner__content">
              {title && (
                <h2 className="highlight-banner__title">{title}</h2>
              )}
              
              {subtitle && (
                <h3 className="highlight-banner__subtitle">{subtitle}</h3>
              )}
              
              {description && (
                <p className="highlight-banner__description">{description}</p>
              )}
              
              {ctaButton && (
                <a 
                  href={ctaButton.url}
                  className={`highlight-banner__cta highlight-banner__cta--${ctaButton.style}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ctaButton.text}
                </a>
              )}
            </div>
          </div>
        );
      }}
    </BaseWidget>
  );
};
