import React from 'react';
import { SortField, SortOrder } from '../types';
import './SortControls.css';

interface SortControlsProps {
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortField, sortOrder: SortOrder) => void;
  disabled?: boolean;
}

export const SortControls: React.FC<SortControlsProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
  disabled = false
}) => {
  const handleFieldChange = (field: SortField) => {
    onSortChange(field, sortOrder);
  };

  const handleOrderToggle = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(sortBy, newOrder);
  };

  const getSortFieldLabel = (field: SortField): string => {
    switch (field) {
      case 'timestamp':
        return 'Date';
      case 'type':
        return 'Type';
      default:
        return field;
    }
  };

  const getSortOrderIcon = (order: SortOrder): string => {
    return order === 'asc' ? '↑' : '↓';
  };

  const getSortOrderLabel = (order: SortOrder): string => {
    if (sortBy === 'timestamp') {
      return order === 'asc' ? 'Oldest First' : 'Newest First';
    } else {
      return order === 'asc' ? 'A-Z' : 'Z-A';
    }
  };

  return (
    <div className="sort-controls">
      <div className="sort-field">
        <label htmlFor="sort-field">Sort by:</label>
        <select
          id="sort-field"
          value={sortBy}
          onChange={(e) => handleFieldChange(e.target.value as SortField)}
          disabled={disabled}
          className="sort-select"
        >
          <option value="timestamp">Date</option>
          <option value="type">Type</option>
        </select>
      </div>

      <button
        className={`sort-order-btn ${sortOrder}`}
        onClick={handleOrderToggle}
        disabled={disabled}
        title={`Currently: ${getSortOrderLabel(sortOrder)}. Click to reverse.`}
      >
        <span className="sort-order-icon">{getSortOrderIcon(sortOrder)}</span>
        <span className="sort-order-text">{getSortOrderLabel(sortOrder)}</span>
      </button>
    </div>
  );
};
