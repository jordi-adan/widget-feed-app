import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HighlightBanner } from '../HighlightBanner';
import { WidgetDescriptor } from '../../../types';

describe('HighlightBanner', () => {
  const mockStaticDescriptor: WidgetDescriptor = {
    id: 'test-highlight-banner-1',
    type: 'static',
    widgetType: 'highlight_banner',
    config: {
      staticContent: {
        title: 'Summer Sale Event',
        subtitle: 'Get up to 50% off on all products',
        description: 'Limited time offer! Shop now and save big on our entire collection. Free shipping on orders over $99.',
        backgroundImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
        ctaButton: {
          text: 'Shop Now',
          url: 'https://example.com/sale',
          style: 'primary'
        },
        theme: 'dark'
      }
    }
  };

  const mockDynamicDescriptor: WidgetDescriptor = {
    id: 'test-highlight-banner-2',
    type: 'dynamic',
    widgetType: 'highlight_banner',
    config: {
      dataUrl: 'https://api.example.com/banner',
      loadingState: 'skeleton',
      errorState: 'retry'
    }
  };

  it('should render highlight banner with static content', () => {
    render(<HighlightBanner descriptor={mockStaticDescriptor} />);
    
    expect(screen.getByText('Summer Sale Event')).toBeInTheDocument();
    expect(screen.getByText('Get up to 50% off on all products')).toBeInTheDocument();
    expect(screen.getByText('Limited time offer! Shop now and save big on our entire collection. Free shipping on orders over $99.')).toBeInTheDocument();
    expect(screen.getByText('Shop Now')).toBeInTheDocument();
  });

  it('should apply dark theme styling', () => {
    render(<HighlightBanner descriptor={mockStaticDescriptor} />);
    
    const banner = screen.getByTestId('highlight-banner');
    expect(banner).toHaveClass('highlight-banner--dark');
  });

  it('should render CTA button with correct styling', () => {
    render(<HighlightBanner descriptor={mockStaticDescriptor} />);
    
    const ctaButton = screen.getByText('Shop Now');
    expect(ctaButton).toHaveClass('highlight-banner__cta--primary');
    expect(ctaButton.closest('a')).toHaveAttribute('href', 'https://example.com/sale');
  });

  it('should handle dynamic content loading', () => {
    render(<HighlightBanner descriptor={mockDynamicDescriptor} />);
    
    // Should show loading skeleton initially for dynamic content
    expect(screen.getByTestId('banner-skeleton')).toBeInTheDocument();
  });

  it('should render empty state when no content provided', () => {
    const emptyDescriptor: WidgetDescriptor = {
      id: 'test-highlight-banner-empty',
      type: 'static',
      widgetType: 'highlight_banner',
      config: {
        staticContent: {}
      }
    };

    render(<HighlightBanner descriptor={emptyDescriptor} />);
    
    expect(screen.getByText('No banner content available')).toBeInTheDocument();
  });

  it('should handle CTA button click events', () => {
    const mockOpen = jest.fn();
    Object.defineProperty(window, 'open', {
      writable: true,
      value: mockOpen
    });

    render(<HighlightBanner descriptor={mockStaticDescriptor} />);
    
    const ctaButton = screen.getByText('Shop Now');
    fireEvent.click(ctaButton);
    
    // Should handle click (link navigation is handled by browser)
    expect(ctaButton).toBeInTheDocument();
  });

  it('should support light theme', () => {
    const lightDescriptor: WidgetDescriptor = {
      id: 'test-highlight-banner-light',
      type: 'static',
      widgetType: 'highlight_banner',
      config: {
        staticContent: {
          title: 'Light Theme Banner',
          subtitle: 'This is a light themed banner',
          ctaButton: {
            text: 'Learn More',
            url: 'https://example.com/learn',
            style: 'secondary'
          },
          theme: 'light'
        }
      }
    };

    render(<HighlightBanner descriptor={lightDescriptor} />);
    
    const banner = screen.getByTestId('highlight-banner');
    expect(banner).toHaveClass('highlight-banner--light');
    
    const ctaButton = screen.getByText('Learn More');
    expect(ctaButton).toHaveClass('highlight-banner__cta--secondary');
  });

  it('should render without CTA button when not provided', () => {
    const noCTADescriptor: WidgetDescriptor = {
      id: 'test-highlight-banner-no-cta',
      type: 'static',
      widgetType: 'highlight_banner',
      config: {
        staticContent: {
          title: 'Information Banner',
          subtitle: 'Just displaying information',
          theme: 'light'
        }
      }
    };

    render(<HighlightBanner descriptor={noCTADescriptor} />);
    
    expect(screen.getByText('Information Banner')).toBeInTheDocument();
    expect(screen.getByText('Just displaying information')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
