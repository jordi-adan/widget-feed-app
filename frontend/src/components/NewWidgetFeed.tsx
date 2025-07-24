import React, { useState, useEffect } from 'react';
import { WidgetDescriptor, CreateWidgetDescriptorRequest } from '../types';
import { widgetDescriptorApi } from '../services/widgetDescriptorApi';
import { WidgetRenderer } from './widgets/WidgetRenderer';
import './NewWidgetFeed.css';

export const NewWidgetFeed: React.FC = () => {
  const [widgets, setWidgets] = useState<WidgetDescriptor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadWidgets();
  }, []);

  const loadWidgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await widgetDescriptorApi.getWidgetDescriptors();
      setWidgets(response.widgets || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load widgets';
      setError(errorMessage);
      console.error('Error loading widgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWidget = async (request: CreateWidgetDescriptorRequest) => {
    try {
      setError(null);
      const newWidget = await widgetDescriptorApi.createWidgetDescriptor(request);
      setWidgets(prev => [newWidget, ...prev]);
      setShowCreateForm(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create widget';
      setError(errorMessage);
      console.error('Error creating widget:', err);
    }
  };

  if (loading) {
    return (
      <div className="new-widget-feed">
        <div className="feed-header">
          <h2>Widget Feed</h2>
          <div className="loading-spinner">Loading...</div>
        </div>
        <div className="feed-content">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="widget-skeleton-placeholder">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="new-widget-feed">
      <div className="feed-header">
        <div className="header-content">
          <h2>Widget Feed</h2>
          <p className="subtitle">PRD-Compliant Widget System</p>
        </div>
        <button
          className="create-button"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? '✕ Cancel' : '+ Create Widget'}
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={loadWidgets} className="retry-link">
            Retry
          </button>
        </div>
      )}

      {showCreateForm && (
        <CreateWidgetForm
          onSubmit={handleCreateWidget}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="feed-content">
        {widgets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📱</div>
            <h3>No widgets yet</h3>
            <p>Create your first widget to get started!</p>
            <button
              className="create-button primary"
              onClick={() => setShowCreateForm(true)}
            >
              Create Widget
            </button>
          </div>
        ) : (
          <div className="widgets-grid">
            {widgets.map((widget) => (
              <WidgetRenderer key={widget.id} descriptor={widget} />
            ))}
          </div>
        )}
      </div>

      <div className="feed-footer">
        <p>
          Powered by PRD-compliant Widget API • {widgets.length} widgets loaded
        </p>
      </div>
    </div>
  );
};

// Simple Create Widget Form Component
interface CreateWidgetFormProps {
  onSubmit: (request: CreateWidgetDescriptorRequest) => void;
  onCancel: () => void;
}

const CreateWidgetForm: React.FC<CreateWidgetFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateWidgetDescriptorRequest>({
    widgetType: 'text_block',
    contentType: 'static',
    staticContent: {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="create-widget-form">
      <h3>Create New Widget</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Widget Type:</label>
          <select
            value={formData.widgetType}
            onChange={(e) => setFormData(prev => ({ ...prev, widgetType: e.target.value as any }))}
          >
            <option value="text_block">Text Block</option>
            <option value="expandable_list">Expandable List</option>
            <option value="horizontal_cards">Horizontal Cards</option>
            <option value="image_list">Image List</option>
            <option value="highlight_banner">Highlight Banner</option>
            <option value="quick_actions">Quick Actions</option>
          </select>
        </div>

        <div className="form-group">
          <label>Content Type:</label>
          <select
            value={formData.contentType}
            onChange={(e) => setFormData(prev => ({ ...prev, contentType: e.target.value as any }))}
          >
            <option value="static">Static</option>
            <option value="dynamic">Dynamic</option>
          </select>
        </div>

        {formData.contentType === 'static' ? (
          <div className="form-group">
            <label>Static Content (JSON):</label>
            <textarea
              placeholder='{"text": "Hello World!", "style": "primary"}'
              onChange={(e) => {
                try {
                  const content = JSON.parse(e.target.value);
                  setFormData(prev => ({ ...prev, staticContent: content }));
                } catch (err) {
                  // Invalid JSON, ignore
                }
              }}
            />
          </div>
        ) : (
          <>
            <div className="form-group">
              <label>Data URL:</label>
              <input
                type="url"
                placeholder="https://api.example.com/data"
                onChange={(e) => setFormData(prev => ({ ...prev, dataUrl: e.target.value }))}
              />
            </div>
            
            <div className="form-group">
              <label>Loading State:</label>
              <select
                value={formData.loadingState || 'skeleton'}
                onChange={(e) => setFormData(prev => ({ ...prev, loadingState: e.target.value as any }))}
              >
                <option value="skeleton">Skeleton</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Error State:</label>
              <select
                value={formData.errorState || 'retry'}
                onChange={(e) => setFormData(prev => ({ ...prev, errorState: e.target.value as any }))}
              >
                <option value="hidden">Hidden</option>
                <option value="message">Message</option>
                <option value="retry">Retry</option>
              </select>
            </div>
          </>
        )}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Create Widget
          </button>
        </div>
      </form>
    </div>
  );
};
