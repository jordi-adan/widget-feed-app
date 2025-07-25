import React, { useState } from 'react';
import { LegacyWidget } from '../types';
import './WidgetItem.css';

interface WidgetItemProps {
  widget: LegacyWidget & { type: string }; // Allow any string type for flexibility
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

const getWidgetIcon = (type: string): string => {
  switch (type) {
    case 'text_block': return '📝';
    case 'expandable_list': return '📋';
    case 'horizontal_cards': return '🎴';
    case 'image_list': return '🖼️';
    case 'highlight_banner': return '📢';
    case 'quick_actions': return '⚡';
    // Legacy types for backward compatibility
    case 'text': return '📝';
    case 'image': return '🖼️';
    case 'video': return '🎥';
    case 'link': return '🔗';
    case 'chart': return '📊';
    default: return '📄';
  }
};

const getIconEmoji = (iconName: string): string => {
  switch (iconName) {
    case 'plus': return '➕';
    case 'list': return '📋';
    case 'settings': return '⚙️';
    case 'help': return '❓';
    case 'create': return '➕';
    case 'view_all': return '👁️';
    case 'edit': return '✏️';
    case 'delete': return '🗑️';
    case 'share': return '📤';
    case 'download': return '⬇️';
    case 'upload': return '⬆️';
    case 'search': return '🔍';
    case 'filter': return '🔽';
    case 'sort': return '🔀';
    case 'home': return '🏠';
    case 'profile': return '👤';
    case 'notifications': return '🔔';
    case 'menu': return '☰';
    default: return '🔘';
  }
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    const minutes = Math.floor(diffInHours * 60);
    return minutes <= 1 ? 'Just now' : `${minutes} minutes ago`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const WidgetItem: React.FC<WidgetItemProps> = ({ widget, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(widget.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveEdit = async () => {
    if (editContent.trim() === widget.content) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdate(widget.id, editContent.trim());
      setIsEditing(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(widget.content);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(widget.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const renderContent = () => {
    try {
      // Try to parse JSON content (new PRD widgets)
      const parsedContent = JSON.parse(widget.content);
      
      // Handle different widget types
      const widgetType = widget.type as string;
      switch (widgetType) {
        case 'text_block':
          return (
            <div className="text-block-content">
              {parsedContent.title && <h3>{parsedContent.title}</h3>}
              <p>{parsedContent.text}</p>
            </div>
          );
          
        case 'expandable_list':
          return (
            <div className="expandable-list-content">
              {parsedContent.title && <h3>{parsedContent.title}</h3>}
              <ul>
                {parsedContent.items?.map((item: any, index: number) => (
                  <li key={index}>
                    <strong>{item.title}</strong>: {item.description}
                  </li>
                ))}
              </ul>
            </div>
          );
          
        case 'horizontal_cards':
          return (
            <div className="horizontal-cards-content">
              {parsedContent.title && <h3>{parsedContent.title}</h3>}
              <div className="cards-container">
                {parsedContent.cards?.map((card: any, index: number) => (
                  <div key={index} className="card">
                    {(card.imageUrl || card.image) && (
                      <img 
                        src={card.imageUrl || card.image} 
                        alt={card.title} 
                        className="card-image"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDE1MCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MyA0MEw4NyA2NEw3NCA3N0w1MCA1M0w2MyA0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPGNpcmNsZSBjeD0iNjUiIGN5PSI0NSIgcj0iNSIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                        }}
                      />
                    )}
                    <div className="card-content">
                      <h4>{card.title}</h4>
                      <p>{card.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
          
        case 'highlight_banner':
          return (
            <div className="highlight-banner-content">
              {parsedContent.title && <h3>{parsedContent.title}</h3>}
              <p>{parsedContent.message}</p>
            </div>
          );
          
        case 'quick_actions':
          return (
            <div className="quick-actions-content">
              {parsedContent.title && <h3>{parsedContent.title}</h3>}
              <div className="actions">
                {parsedContent.actions?.map((action: any, index: number) => (
                  <button key={index} className="action-btn">
                    <span className="action-icon">{getIconEmoji(action.icon)}</span>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          );
          
        case 'image_list':
          return (
            <div className="image-list-content">
              {parsedContent.title && <h3>{parsedContent.title}</h3>}
              <div className="images">
                {parsedContent.images?.map((img: any, index: number) => (
                  <div key={index} className="image-item">
                    <img 
                      src={img.url} 
                      alt={img.altText || img.alt}
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgODBMMTc1IDEzMEwxNTAgMTU1TDEwMCAxMDVMMTI1IDgwWiIgZmlsbD0iIzlDQTNBRiIvPgo8Y2lyY2xlIGN4PSIxMzAiIGN5PSI5MCIgcj0iMTAiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==';
                      }}
                    />
                    <p>{img.caption}</p>
                  </div>
                ))}
              </div>
            </div>
          );
          
        default:
          // Fallback for unknown types - show JSON formatted
          return (
            <div className="json-content">
              <pre>{JSON.stringify(parsedContent, null, 2)}</pre>
            </div>
          );
      }
    } catch (error) {
      // Fallback for non-JSON content (legacy widgets)
      return (
        <div className="plain-content">
          {widget.content}
        </div>
      );
    }
  };

  return (
    <div className={`widget-item widget-${widget.type}`}>
      <div className="widget-header">
        <div className="widget-type">
          <span className="widget-icon">{getWidgetIcon(widget.type)}</span>
          <span className="widget-type-label">{widget.type}</span>
        </div>
        <div className="widget-meta">
          <span className="widget-timestamp">{formatTimestamp(widget.timestamp)}</span>
          <div className="widget-actions">
            <button
              className="edit-btn"
              onClick={() => setIsEditing(true)}
              disabled={isEditing || showDeleteConfirm}
              title="Edit widget"
            >
              ✏️
            </button>
            <button
              className="delete-btn"
              onClick={handleDeleteClick}
              disabled={isEditing || showDeleteConfirm || isDeleting}
              title="Delete widget"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <div className="widget-content">
        {isEditing ? (
          <div className="edit-mode">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="edit-textarea"
              rows={3}
              maxLength={10000}
            />
            <div className="character-count">
              {editContent.length}/10,000 characters
            </div>
            <div className="edit-actions">
              <button
                onClick={handleCancelEdit}
                className="btn btn-secondary"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="btn btn-primary"
                disabled={!editContent.trim() || isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <div className="view-mode">
            {renderContent()}
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <div className="delete-confirmation-content">
            <p>Are you sure you want to delete this widget?</p>
            <div className="delete-actions">
              <button
                onClick={handleCancelDelete}
                className="btn btn-secondary"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn btn-danger"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
