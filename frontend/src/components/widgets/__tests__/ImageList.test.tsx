import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageList } from '../ImageList';
import { WidgetDescriptor } from '../../../types';

describe('ImageList', () => {
  const mockStaticDescriptor: WidgetDescriptor = {
    id: 'test-image-list-1',
    type: 'static',
    widgetType: 'image_list',
    config: {
      staticContent: {
        title: 'Photo Gallery',
        layout: 'grid',
        images: [
          {
            id: 'img-1',
            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
            caption: 'Mountain landscape with beautiful sunset',
            altText: 'Snow-capped mountains at sunset'
          },
          {
            id: 'img-2',
            url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
            caption: 'Forest trail in autumn',
            altText: 'Wooden path through autumn forest'
          },
          {
            id: 'img-3',
            url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
            caption: 'Serene lake reflection',
            altText: 'Lake with mountain reflection'
          }
        ]
      }
    }
  };

  const mockDynamicDescriptor: WidgetDescriptor = {
    id: 'test-image-list-2',
    type: 'dynamic',
    widgetType: 'image_list',
    config: {
      dataUrl: 'https://api.example.com/images',
      loadingState: 'skeleton',
      errorState: 'retry'
    }
  };

  it('should render image list with static content', () => {
    render(<ImageList descriptor={mockStaticDescriptor} />);
    
    expect(screen.getByText('Photo Gallery')).toBeInTheDocument();
    expect(screen.getByText('Mountain landscape with beautiful sunset')).toBeInTheDocument();
    expect(screen.getByText('Forest trail in autumn')).toBeInTheDocument();
    expect(screen.getByText('Serene lake reflection')).toBeInTheDocument();
  });

  it('should render images in grid layout', () => {
    render(<ImageList descriptor={mockStaticDescriptor} />);
    
    const imageGrid = screen.getByTestId('image-list-grid');
    expect(imageGrid).toHaveClass('image-list__grid');
  });

  it('should render all images with proper alt text', () => {
    render(<ImageList descriptor={mockStaticDescriptor} />);
    
    const mountainImg = screen.getByAltText('Snow-capped mountains at sunset');
    const forestImg = screen.getByAltText('Wooden path through autumn forest');
    const lakeImg = screen.getByAltText('Lake with mountain reflection');
    
    expect(mountainImg).toBeInTheDocument();
    expect(forestImg).toBeInTheDocument();
    expect(lakeImg).toBeInTheDocument();
    
    expect(mountainImg).toHaveAttribute('src', expect.stringContaining('photo-1506905925346'));
    expect(forestImg).toHaveAttribute('src', expect.stringContaining('photo-1441974231531'));
    expect(lakeImg).toHaveAttribute('src', expect.stringContaining('photo-1469474968028'));
  });

  it('should handle dynamic content loading', () => {
    render(<ImageList descriptor={mockDynamicDescriptor} />);
    
    // Should show loading skeleton initially for dynamic content
    expect(screen.getByTestId('images-skeleton')).toBeInTheDocument();
  });

  it('should render empty state when no images provided', () => {
    const emptyDescriptor: WidgetDescriptor = {
      ...mockStaticDescriptor,
      config: {
        staticContent: {
          title: 'Empty Gallery',
          layout: 'grid',
          images: []
        }
      }
    };

    render(<ImageList descriptor={emptyDescriptor} />);
    
    expect(screen.getByText('No images available')).toBeInTheDocument();
  });

  it('should handle image click for lightbox view', () => {
    render(<ImageList descriptor={mockStaticDescriptor} />);
    
    const firstImage = screen.getByAltText('Snow-capped mountains at sunset');
    fireEvent.click(firstImage);
    
    // Should open lightbox (we'll implement this feature)
    expect(screen.getByTestId('image-lightbox')).toBeInTheDocument();
  });

  it('should support list layout', () => {
    const listDescriptor: WidgetDescriptor = {
      id: 'test-image-list-list',
      type: 'static',
      widgetType: 'image_list',
      config: {
        staticContent: {
          title: 'Photo Gallery',
          layout: 'list',
          images: [
            {
              id: 'img-1',
              url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
              caption: 'Mountain landscape',
              altText: 'Mountains at sunset'
            }
          ]
        }
      }
    };

    render(<ImageList descriptor={listDescriptor} />);
    
    const imageList = screen.getByTestId('image-list-container');
    expect(imageList).toHaveClass('image-list--list');
  });
});
