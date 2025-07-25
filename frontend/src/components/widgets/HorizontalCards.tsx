import React from 'react';
import { BaseWidget } from './BaseWidget';
import { WidgetDescriptor } from '../../types';
import './HorizontalCards.css';

export interface HorizontalCardsProps {
  descriptor: WidgetDescriptor;
}

export interface CardItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  actionUrl: string;
}

export const HorizontalCards: React.FC<HorizontalCardsProps> = ({ descriptor }) => {
  return (
    <BaseWidget descriptor={descriptor}>
      {(data, loading, error) => {
        if (loading) {
          return (
            <div className="widget-skeleton" data-testid="cards-skeleton">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
          );
        }

        if (!data) {
          return <div className="horizontal-cards-empty">No cards available</div>;
        }

        const title = data.title;
        const cards: CardItem[] = data.cards || [];

        if (cards.length === 0) {
          return <div className="horizontal-cards-empty">No cards available</div>;
        }

        return (
          <div className="horizontal-cards">
            {title && <h3 className="horizontal-cards__title">{title}</h3>}
            <div className="horizontal-cards__container" data-testid="horizontal-cards-container">
              {cards.map((card) => (
                <div key={card.id} className="horizontal-cards__card">
                  <img 
                    src={card.imageUrl} 
                    alt={card.title}
                    className="horizontal-cards__image"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDE1MCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MyA0MEw4NyA2NEw3NCA3N0w1MCA1M0w2MyA0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPGNpcmNsZSBjeD0iNjUiIGN5PSI0NSIgcj0iNSIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                    }}
                  />
                  <div className="horizontal-cards__content">
                    <h4 className="horizontal-cards__card-title">{card.title}</h4>
                    <p className="horizontal-cards__description">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </BaseWidget>
  );
};
