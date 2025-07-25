import React from 'react';
import { WidgetDescriptor } from '../../types';
import { TextBlock } from './TextBlock';
import { ExpandableList } from './ExpandableList';
import { HorizontalCards } from './HorizontalCards';
import { ImageList } from './ImageList';
// Import other widget components as we create them
// import { HighlightBanner } from './HighlightBanner';
// import { QuickActions } from './QuickActions';

export interface WidgetRendererProps {
  descriptor: WidgetDescriptor;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ descriptor }) => {
  switch (descriptor.widgetType) {
    case 'text_block':
      return <TextBlock descriptor={descriptor} />;
    
    case 'expandable_list':
      return <ExpandableList descriptor={descriptor} />;
    
    case 'horizontal_cards':
      return <HorizontalCards descriptor={descriptor} />;
    
    case 'image_list':
      return <ImageList descriptor={descriptor} />;
    
    case 'highlight_banner':
      // TODO: Implement HighlightBanner component
      return <div>HighlightBanner component coming soon...</div>;
    
    case 'quick_actions':
      // TODO: Implement QuickActions component
      return <div>QuickActions component coming soon...</div>;
    
    default:
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#dc2626' }}>
          Unknown widget type: {descriptor.widgetType}
        </div>
      );
  }
};
