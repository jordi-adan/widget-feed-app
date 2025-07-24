import React, { useState } from 'react';
import { LegacyWidget } from '../types';
import './WidgetItem.css';

interface WidgetItemProps {
  widget: LegacyWidget;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

const getWidgetIcon = (type: string): string => {
  switch (type) {
    case 'text': return '📝';
    case 'image': return '🖼️';
    case 'video': return '🎥';
    case 'link': return '🔗';
    case 'chart': return '📊';
    default: return '📄';
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
    if (widget.type === 'link' && widget.content.startsWith('http')) {
      return (
        <a 
          href={widget.content} 
          target="_blank" 
          rel="noopener noreferrer"
          className="widget-link"
        >
          {widget.content}
        </a>
      );
    }

    return widget.content;
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
