import { CreateWidgetRequest, CreateWidgetResponse, GetAllWidgetsResponse, UpdateWidgetRequest, UpdateWidgetResponse, DeleteWidgetResponse, GetSortedWidgetsRequest, GetSortedWidgetsResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class WidgetApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async getAllWidgets(): Promise<GetAllWidgetsResponse> {
    return this.request<GetAllWidgetsResponse>('/widgets');
  }

  async createWidget(widget: CreateWidgetRequest): Promise<CreateWidgetResponse> {
    return this.request<CreateWidgetResponse>('/widgets', {
      method: 'POST',
      body: JSON.stringify(widget),
    });
  }

  async updateWidget(id: string, update: UpdateWidgetRequest): Promise<UpdateWidgetResponse> {
    return this.request<UpdateWidgetResponse>(`/widgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(update),
    });
  }

  async deleteWidget(id: string): Promise<DeleteWidgetResponse> {
    return this.request<DeleteWidgetResponse>(`/widgets/${id}`, {
      method: 'DELETE',
    });
  }

  async getSortedWidgets(params: GetSortedWidgetsRequest = {}): Promise<GetSortedWidgetsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.sortBy) {
      searchParams.append('sortBy', params.sortBy);
    }
    
    if (params.sortOrder) {
      searchParams.append('sortOrder', params.sortOrder);
    }

    const query = searchParams.toString();
    const endpoint = query ? `/widgets/sorted?${query}` : '/widgets/sorted';
    
    return this.request<GetSortedWidgetsResponse>(endpoint);
  }
}

export const widgetApi = new WidgetApiService();
