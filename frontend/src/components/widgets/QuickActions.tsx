import React from 'react';
import { BaseWidget } from './BaseWidget';
import { WidgetDescriptor } from '../../types';
import './QuickActions.css';

export interface QuickActionsProps {
  descriptor: WidgetDescriptor;
}

export interface ActionItem {
  id: string;
  label: string;
  icon: string;
  url: string;
  style: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export const QuickActions: React.FC<QuickActionsProps> = ({ descriptor }) => {
  return (
    <BaseWidget descriptor={descriptor}>
      {(data, loading, error) => {
        if (loading) {
          return (
            <div className="widget-skeleton" data-testid="actions-skeleton">
              <div className="skeleton-actions">
                <div className="skeleton-line skeleton-line--title"></div>
                <div className="skeleton-actions-grid">
                  <div className="skeleton-action-button"></div>
                  <div className="skeleton-action-button"></div>
                  <div className="skeleton-action-button"></div>
                  <div className="skeleton-action-button"></div>
                </div>
              </div>
            </div>
          );
        }

        if (!data) {
          return <div className="quick-actions-empty">No actions available</div>;
        }

        const title = data.title;
        const layout = data.layout || 'grid';
        const actions: ActionItem[] = data.actions || [];

        if (actions.length === 0) {
          return <div className="quick-actions-empty">No actions available</div>;
        }

        return (
          <div 
            className={`quick-actions quick-actions--${layout}`}
            data-testid="quick-actions-container"
          >
            {title && <h3 className="quick-actions__title">{title}</h3>}
            
            <div 
              className={layout === 'grid' ? 'quick-actions__grid' : 'quick-actions__list'} 
              data-testid={layout === 'grid' ? 'quick-actions-grid' : 'quick-actions-list'}
            >
              {actions.map((action) => (
                <a
                  key={action.id}
                  href={action.url}
                  className={`quick-actions__button quick-actions__button--${action.style}`}
                  target={action.url.startsWith('mailto:') || action.url.startsWith('tel:') ? '_self' : '_blank'}
                  rel={action.url.startsWith('mailto:') || action.url.startsWith('tel:') ? '' : 'noopener noreferrer'}
                >
                  <span className="quick-actions__icon">{action.icon}</span>
                  <span className="quick-actions__label">{action.label}</span>
                </a>
              ))}
            </div>
          </div>
        );
      }}
    </BaseWidget>
  );
};
