import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuickActions } from '../QuickActions';
import { WidgetDescriptor } from '../../../types';

describe('QuickActions', () => {
  const mockStaticDescriptor: WidgetDescriptor = {
    id: 'test-quick-actions-1',
    type: 'static',
    widgetType: 'quick_actions',
    config: {
      staticContent: {
        title: 'Quick Actions',
        layout: 'grid',
        actions: [
          {
            id: 'action-1',
            label: 'Download App',
            icon: '📱',
            url: 'https://example.com/download',
            style: 'primary'
          },
          {
            id: 'action-2',
            label: 'Contact Support',
            icon: '💬',
            url: 'mailto:support@example.com',
            style: 'secondary'
          },
          {
            id: 'action-3',
            label: 'View Documentation',
            icon: '📚',
            url: 'https://docs.example.com',
            style: 'outline'
          },
          {
            id: 'action-4',
            label: 'Share',
            icon: '🔗',
            url: 'https://example.com/share',
            style: 'ghost'
          }
        ]
      }
    }
  };

  const mockDynamicDescriptor: WidgetDescriptor = {
    id: 'test-quick-actions-2',
    type: 'dynamic',
    widgetType: 'quick_actions',
    config: {
      dataUrl: 'https://api.example.com/actions',
      loadingState: 'skeleton',
      errorState: 'retry'
    }
  };

  it('should render quick actions with static content', () => {
    render(<QuickActions descriptor={mockStaticDescriptor} />);
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Download App')).toBeInTheDocument();
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
    expect(screen.getByText('View Documentation')).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('should render actions in grid layout', () => {
    render(<QuickActions descriptor={mockStaticDescriptor} />);
    
    const actionsContainer = screen.getByTestId('quick-actions-grid');
    expect(actionsContainer).toHaveClass('quick-actions__grid');
  });

  it('should render action buttons with correct styles', () => {
    render(<QuickActions descriptor={mockStaticDescriptor} />);
    
    const primaryButton = screen.getByText('Download App').closest('a');
    const secondaryButton = screen.getByText('Contact Support').closest('a');
    const outlineButton = screen.getByText('View Documentation').closest('a');
    const ghostButton = screen.getByText('Share').closest('a');
    
    expect(primaryButton).toHaveClass('quick-actions__button--primary');
    expect(secondaryButton).toHaveClass('quick-actions__button--secondary');
    expect(outlineButton).toHaveClass('quick-actions__button--outline');
    expect(ghostButton).toHaveClass('quick-actions__button--ghost');
  });

  it('should render action icons', () => {
    render(<QuickActions descriptor={mockStaticDescriptor} />);
    
    expect(screen.getByText('📱')).toBeInTheDocument();
    expect(screen.getByText('💬')).toBeInTheDocument();
    expect(screen.getByText('📚')).toBeInTheDocument();
    expect(screen.getByText('🔗')).toBeInTheDocument();
  });

  it('should handle dynamic content loading', () => {
    render(<QuickActions descriptor={mockDynamicDescriptor} />);
    
    // Should show loading skeleton initially for dynamic content
    expect(screen.getByTestId('actions-skeleton')).toBeInTheDocument();
  });

  it('should render empty state when no actions provided', () => {
    const emptyDescriptor: WidgetDescriptor = {
      id: 'test-quick-actions-empty',
      type: 'static',
      widgetType: 'quick_actions',
      config: {
        staticContent: {
          title: 'Empty Actions',
          layout: 'grid',
          actions: []
        }
      }
    };

    render(<QuickActions descriptor={emptyDescriptor} />);
    
    expect(screen.getByText('No actions available')).toBeInTheDocument();
  });

  it('should support list layout', () => {
    const listDescriptor: WidgetDescriptor = {
      id: 'test-quick-actions-list',
      type: 'static',
      widgetType: 'quick_actions',
      config: {
        staticContent: {
          title: 'Action List',
          layout: 'list',
          actions: [
            {
              id: 'list-action-1',
              label: 'First Action',
              icon: '⚡',
              url: 'https://example.com/action1',
              style: 'primary'
            }
          ]
        }
      }
    };

    render(<QuickActions descriptor={listDescriptor} />);
    
    const actionsContainer = screen.getByTestId('quick-actions-container');
    expect(actionsContainer).toHaveClass('quick-actions--list');
  });

  it('should handle action button clicks', () => {
    render(<QuickActions descriptor={mockStaticDescriptor} />);
    
    const downloadButton = screen.getByText('Download App');
    expect(downloadButton.closest('a')).toHaveAttribute('href', 'https://example.com/download');
    
    const supportButton = screen.getByText('Contact Support');
    expect(supportButton.closest('a')).toHaveAttribute('href', 'mailto:support@example.com');
  });

  it('should render without title when not provided', () => {
    const noTitleDescriptor: WidgetDescriptor = {
      id: 'test-quick-actions-no-title',
      type: 'static',
      widgetType: 'quick_actions',
      config: {
        staticContent: {
          layout: 'grid',
          actions: [
            {
              id: 'action-1',
              label: 'Action',
              icon: '🎯',
              url: 'https://example.com',
              style: 'primary'
            }
          ]
        }
      }
    };

    render(<QuickActions descriptor={noTitleDescriptor} />);
    
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
