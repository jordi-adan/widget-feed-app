   // Widget Types
export type WidgetType = 'text' | 'image' | 'video' | 'link' | 'chart';

export interface Widget {
  id: string;
  type: WidgetType;
  content: string;
  timestamp: string;
}

// API Request/Response Types
export interface CreateWidgetRequest {
  type: WidgetType;
  content: string;
}

export interface UpdateWidgetRequest {
  content: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateWidgetResponse extends ApiResponse {
  widget?: Widget;
}

export interface UpdateWidgetResponse extends ApiResponse {
  widget?: Widget;
}

export interface GetAllWidgetsResponse extends ApiResponse {
  widgets?: Widget[];
}

export interface DeleteWidgetResponse extends ApiResponse {
  message?: string;
}

// Sorting Types
export type SortField = 'timestamp' | 'type';
export type SortOrder = 'asc' | 'desc';

export interface GetSortedWidgetsRequest {
  sortBy?: SortField;
  sortOrder?: SortOrder;
}

export interface GetSortedWidgetsResponse extends ApiResponse {
  widgets?: Widget[];
}