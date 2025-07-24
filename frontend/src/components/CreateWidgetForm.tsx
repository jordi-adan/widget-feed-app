import React, { useState } from 'react';
import { LegacyWidgetType } from '../types';
import './CreateWidgetForm.css';

interface CreateWidgetFormProps {
  onSubmit: (type: LegacyWidgetType, content: string) => void;
  onCancel: () => void;
}

const WIDGET_TYPES: { value: LegacyWidgetType; label: string; placeholder: string }[] = [
  { value: 'text', label: '📝 Text', placeholder: 'Enter your text content...' },
  { value: 'image', label: '🖼️ Image', placeholder: 'Enter image URL or description...' },
  { value: 'video', label: '🎥 Video', placeholder: 'Enter video URL or description...' },
  { value: 'link', label: '🔗 Link', placeholder: 'Enter URL and description...' },
  { value: 'chart', label: '📊 Chart', placeholder: 'Enter chart data or description...' },
];

export const CreateWidgetForm: React.FC<CreateWidgetFormProps> = ({ onSubmit, onCancel }) => {
  const [selectedType, setSelectedType] = useState<LegacyWidgetType>('text');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(selectedType, content.trim());
      setContent('');
      setSelectedType('text');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentWidgetType = WIDGET_TYPES.find(type => type.value === selectedType);

  return (
    <div className="create-widget-form">
      <h3>Create New Widget</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="widget-type">Widget Type</label>
          <select
            id="widget-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as LegacyWidgetType)}
            className="widget-type-select"
          >
            {WIDGET_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="widget-content">Content</label>
          <textarea
            id="widget-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={currentWidgetType?.placeholder}
            rows={4}
            maxLength={10000}
            required
            className="widget-content-input"
          />
          <div className="character-count">
            {content.length}/10,000 characters
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Widget'}
          </button>
        </div>
      </form>
    </div>
  );
};
