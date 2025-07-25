import React, { useState } from 'react';
import { BaseWidget } from './BaseWidget';
import { WidgetDescriptor } from '../../types';
import './ImageList.css';

export interface ImageListProps {
  descriptor: WidgetDescriptor;
}

export interface ImageItem {
  id: string;
  url: string;
  caption: string;
  altText: string;
}

export const ImageList: React.FC<ImageListProps> = ({ descriptor }) => {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  const handleImageClick = (image: ImageItem) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <BaseWidget descriptor={descriptor}>
      {(data, loading, error) => {
        if (loading) {
          return (
            <div className="widget-skeleton" data-testid="images-skeleton">
              <div className="skeleton-line"></div>
              <div className="skeleton-grid">
                <div className="skeleton-image"></div>
                <div className="skeleton-image"></div>
                <div className="skeleton-image"></div>
              </div>
            </div>
          );
        }

        if (!data) {
          return <div className="image-list-empty">No images available</div>;
        }

        const title = data.title;
        const layout = data.layout || 'grid';
        const images: ImageItem[] = data.images || [];

        if (images.length === 0) {
          return <div className="image-list-empty">No images available</div>;
        }

        return (
          <div className={`image-list image-list--${layout}`} data-testid="image-list-container">
            {title && <h3 className="image-list__title">{title}</h3>}
            
            <div 
              className={layout === 'grid' ? 'image-list__grid' : 'image-list__list'} 
              data-testid={layout === 'grid' ? 'image-list-grid' : 'image-list-list'}
            >
              {images.map((image) => (
                <div key={image.id} className="image-list__item" onClick={() => handleImageClick(image)}>
                  <img 
                    src={image.url} 
                    alt={image.altText}
                    className="image-list__image"
                  />
                  <div className="image-list__caption">{image.caption}</div>
                </div>
              ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
              <div className="image-lightbox" data-testid="image-lightbox" onClick={closeLightbox}>
                <div className="image-lightbox__content" onClick={(e) => e.stopPropagation()}>
                  <button className="image-lightbox__close" onClick={closeLightbox}>
                    ×
                  </button>
                  <img 
                    src={selectedImage.url} 
                    alt={selectedImage.altText}
                    className="image-lightbox__image"
                  />
                  <div className="image-lightbox__caption">{selectedImage.caption}</div>
                </div>
              </div>
            )}
          </div>
        );
      }}
    </BaseWidget>
  );
};
