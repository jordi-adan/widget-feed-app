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