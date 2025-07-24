   // PRD-Compliant Widget Types (Updated to match backend)
export type WidgetType = 'expandable_list' | 'horizontal_cards' | 'image_list' | 
                         'text_block' | 'highlight_banner' | 'quick_actions';

export type ContentType = 'static' | 'dynamic';

export type LoadingState = 'skeleton' | 'hidden';
export type ErrorState = 'hidden' | 'message' | 'retry';

// Core Widget Descriptor Interface (matches backend)
export interface WidgetDescriptor {
  id: string;
  type: ContentType;
  widgetType: WidgetType;
  config: StaticConfig | DynamicConfig;
}

// Configuration Types
export interface StaticConfig {
  staticContent: Record<string, any>;
}

export interface DynamicConfig {
  dataUrl: string;
  loadingState: LoadingState;
  errorState: ErrorState;
}

// API Response Types
export interface GetWidgetsResponse {
  widgets: WidgetDescriptor[];
}

export interface CreateWidgetDescriptorRequest {
  widgetType: WidgetType;
  contentType: ContentType;
  dataUrl?: string;
  loadingState?: LoadingState;
  errorState?: ErrorState;
  staticContent?: Record<string, any>;
}

// Legacy Types (for backward compatibility during migration)
export type LegacyWidgetType = 'text' | 'image' | 'video' | 'link' | 'chart';

export interface LegacyWidget {
  id: string;
  type: LegacyWidgetType;
  content: string;
  timestamp: string;
}

// Legacy API Types (for backward compatibility)
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateWidgetRequest {
  type: LegacyWidgetType;
  content: string;
}

export interface UpdateWidgetRequest {
  content: string;
}

export interface CreateWidgetResponse extends ApiResponse {
  widget?: LegacyWidget;
}

export interface UpdateWidgetResponse extends ApiResponse {
  widget?: LegacyWidget;
}

export interface GetAllWidgetsResponse extends ApiResponse {
  widgets?: LegacyWidget[];
}

export interface DeleteWidgetResponse extends ApiResponse {
  message?: string;
}

export interface GetSortedWidgetsResponse extends ApiResponse {
  widgets?: LegacyWidget[];
}

// Sorting Types (legacy)
export type SortField = 'timestamp' | 'type';
export type SortOrder = 'asc' | 'desc';

export interface GetSortedWidgetsRequest {
  sortBy?: SortField;
  sortOrder?: SortOrder;
}