import React, { useState } from 'react';
import { BaseWidget } from './BaseWidget';
import { WidgetDescriptor } from '../../types';
import './ExpandableList.css';

export interface ExpandableListProps {
  descriptor: WidgetDescriptor;
}

export const ExpandableList: React.FC<ExpandableListProps> = ({ descriptor }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <BaseWidget descriptor={descriptor}>
      {(data, loading, error) => {
        if (loading) {
          return (
            <div className="widget-skeleton">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
          );
        }

        if (!data || !data.items || !Array.isArray(data.items)) {
          return <div className="expandable-list-empty">No items available</div>;
        }

        return (
          <div className="expandable-list">
            {data.title && (
              <h3 className="expandable-list__title">{data.title}</h3>
            )}
            
            <div className="expandable-list__items">
              {data.items.map((item: any, index: number) => {
                const itemId = item.id || `item-${index}`;
                const isExpanded = expandedItems.has(itemId);
                
                return (
                  <div key={itemId} className="expandable-list__item">
                    <button
                      className={`expandable-list__header ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => toggleItem(itemId)}
                      aria-expanded={isExpanded}
                    >
                      <span className="item-title">{item.title || item.name}</span>
                      <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                        ▼
                      </span>
                    </button>
                    
                    {isExpanded && (
                      <div className="expandable-list__content">
                        {item.description && (
                          <p className="item-description">{item.description}</p>
                        )}
                        
                        {item.details && (
                          <div className="item-details">
                            {Object.entries(item.details).map(([key, value]) => (
                              <div key={key} className="detail-item">
                                <span className="detail-key">{key}:</span>
                                <span className="detail-value">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {item.actions && Array.isArray(item.actions) && (
                          <div className="item-actions">
                            {item.actions.map((action: any, actionIndex: number) => (
                              <button
                                key={actionIndex}
                                className="action-button"
                                onClick={() => console.log('Action clicked:', action)}
                              >
                                {action.label || action.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {data.total && (
              <div className="expandable-list__footer">
                {data.items.length} of {data.total} items
              </div>
            )}
          </div>
        );
      }}
    </BaseWidget>
  );
};
