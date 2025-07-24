   import React, { useState, useEffect } from 'react';
import './WidgetFeed.css';
import { WidgetItem } from './WidgetItem';
import { CreateWidgetForm } from './CreateWidgetForm';
import { Widget, WidgetType } from '../types';
import { widgetApi } from '../services/widgetApi';

export const WidgetFeed: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
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
      const response = await widgetApi.getAllWidgets();
      setWidgets(response.widgets || []);
    } catch (err) {
      setError('Failed to load widgets');
      console.error('Error loading widgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWidget = async (type: WidgetType, content: string) => {
    try {
      setError(null);
      const response = await widgetApi.createWidget({ type, content });
      if (response.success && response.widget) {
        setWidgets(prev => [response.widget!, ...prev]);
        setShowCreateForm(false);
      } else {
        setError(response.error || 'Failed to create widget');
      }
    } catch (err) {
      setError('Failed to create widget');
      console.error('Error creating widget:', err);
    }
  };

  const handleUpdateWidget = async (id: string, content: string) => {
    try {
      setError(null);
      const response = await widgetApi.updateWidget(id, { content });
      if (response.success && response.widget) {
        setWidgets(prev => 
          prev.map(widget => 
            widget.id === id ? response.widget! : widget
          )
        );
      } else {
        setError(response.error || 'Failed to update widget');
      }
    } catch (err) {
      setError('Failed to update widget');
      console.error('Error updating widget:', err);
    }
  };

  const handleDeleteWidget = async (id: string) => {
    try {
      setError(null);
      const response = await widgetApi.deleteWidget(id);
      if (response.success) {
        setWidgets(prev => prev.filter(widget => widget.id !== id));
      } else {
        setError(response.error || 'Failed to delete widget');
      }
    } catch (err) {
      setError('Failed to delete widget');
      console.error('Error deleting widget:', err);
    }
  };

  if (loading) {
    return (
      <div className="widget-feed">
        <div className="loading">Loading widgets...</div>
      </div>
    );
  }

  return (
    <div className="widget-feed">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="dismiss-error">×</button>
        </div>
      )}
      
      <div className="widget-feed-header">
        <button 
          className="create-widget-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ Create Widget'}
        </button>
      </div>

      {showCreateForm && (
        <CreateWidgetForm 
          onSubmit={handleCreateWidget}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="widgets-container">
        {widgets.length === 0 ? (
          <div className="empty-state">
            <h3>No widgets yet</h3>
            <p>Create your first widget to get started!</p>
          </div>
        ) : (
          widgets.map(widget => (
            <WidgetItem 
              key={widget.id}
              widget={widget}
              onUpdate={handleUpdateWidget}
              onDelete={handleDeleteWidget}
            />
          ))
        )}
      </div>
    </div>
  );
};