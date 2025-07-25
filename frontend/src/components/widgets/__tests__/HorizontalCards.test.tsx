import React from 'react';
import { render, screen } from '@testing-library/react';
import { HorizontalCards } from '../HorizontalCards';
import { WidgetDescriptor } from '../../../types';

describe('HorizontalCards', () => {
  const mockStaticDescriptor: WidgetDescriptor = {
    id: 'test-horizontal-cards-1',
    type: 'static',
    widgetType: 'horizontal_cards',
    config: {
      staticContent: {
        title: 'Featured Cards',
        cards: [
          {
            id: 'card-1',
            title: 'Card Title 1',
            description: 'Card description 1',
            imageUrl: 'https://example.com/image1.jpg',
            actionUrl: 'https://example.com/action1'
          },
          {
            id: 'card-2', 
            title: 'Card Title 2',
            description: 'Card description 2',
            imageUrl: 'https://example.com/image2.jpg',
            actionUrl: 'https://example.com/action2'
          }
        ]
      }
    }
  };

  const mockDynamicDescriptor: WidgetDescriptor = {
    id: 'test-horizontal-cards-2',
    type: 'dynamic',
    widgetType: 'horizontal_cards',
    config: {
      dataUrl: 'https://api.example.com/cards',
      loadingState: 'skeleton',
      errorState: 'retry'
    }
  };

  it('should render horizontal cards with static content', () => {
    render(<HorizontalCards descriptor={mockStaticDescriptor} />);
    
    expect(screen.getByText('Featured Cards')).toBeInTheDocument();
    expect(screen.getByText('Card Title 1')).toBeInTheDocument();
    expect(screen.getByText('Card description 1')).toBeInTheDocument();
    expect(screen.getByText('Card Title 2')).toBeInTheDocument();
    expect(screen.getByText('Card description 2')).toBeInTheDocument();
  });

  it('should render cards in horizontal layout', () => {
    render(<HorizontalCards descriptor={mockStaticDescriptor} />);
    
    const cardsContainer = screen.getByTestId('horizontal-cards-container');
    expect(cardsContainer).toHaveClass('horizontal-cards__container');
  });

  it('should handle dynamic content loading', () => {
    render(<HorizontalCards descriptor={mockDynamicDescriptor} />);
    
    // Should show loading skeleton initially for dynamic content
    expect(screen.getByTestId('cards-skeleton')).toBeInTheDocument();
  });

  it('should render empty state when no cards provided', () => {
    const emptyDescriptor: WidgetDescriptor = {
      ...mockStaticDescriptor,
      config: {
        staticContent: {
          title: 'Empty Cards',
          cards: []
        }
      }
    };

    render(<HorizontalCards descriptor={emptyDescriptor} />);
    
    expect(screen.getByText('No cards available')).toBeInTheDocument();
  });

  it('should render card images with proper alt text', () => {
    render(<HorizontalCards descriptor={mockStaticDescriptor} />);
    
    const cardImage1 = screen.getByAltText('Card Title 1');
    const cardImage2 = screen.getByAltText('Card Title 2');
    
    expect(cardImage1).toBeInTheDocument();
    expect(cardImage2).toBeInTheDocument();
    expect(cardImage1).toHaveAttribute('src', 'https://example.com/image1.jpg');
    expect(cardImage2).toHaveAttribute('src', 'https://example.com/image2.jpg');
  });
});
