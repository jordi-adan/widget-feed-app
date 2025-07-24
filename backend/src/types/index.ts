   // Domain Types
export interface WidgetPrimitive {
  id: string;
  type: string;
  content: string;
  timestamp: string;
}

// API Request/Response Types
export interface CreateWidgetRequest {
  type: string;
  content: string;
}

export interface UpdateWidgetContentRequest {
  id: string;
  content: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateWidgetResponse extends ApiResponse {
  widget?: WidgetPrimitive;
}

export interface UpdateWidgetContentResponse extends ApiResponse {
  widget?: WidgetPrimitive;
}

export interface GetAllWidgetsResponse extends ApiResponse {
  widgets?: WidgetPrimitive[];
}

// Valid widget types
export type ValidWidgetType = 'text' | 'image' | 'video' | 'link' | 'chart';