import React from 'react';
import { WidgetDescriptor } from '../../types';
import { TextBlock } from './TextBlock';
import { ExpandableList } from './ExpandableList';
import { HorizontalCards } from './HorizontalCards';
import { ImageList } from './ImageList';
import { HighlightBanner } from './HighlightBanner';
import { QuickActions } from './QuickActions';

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
      return <HighlightBanner descriptor={descriptor} />;
    
    case 'quick_actions':
      return <QuickActions descriptor={descriptor} />;
    
    default:
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#dc2626' }}>
          Unknown widget type: {descriptor.widgetType}
        </div>
      );
  }
};
