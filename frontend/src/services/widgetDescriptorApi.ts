import { 
  WidgetDescriptor, 
  CreateWidgetDescriptorRequest, 
  GetWidgetsResponse 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class WidgetDescriptorApiService {
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

  /**
   * Get all widget descriptors from the PRD-compliant API
   */
  async getWidgetDescriptors(): Promise<GetWidgetsResponse> {
    return this.request<GetWidgetsResponse>('/widgets');
  }

  /**
   * Create a new widget descriptor
   */
  async createWidgetDescriptor(request: CreateWidgetDescriptorRequest): Promise<WidgetDescriptor> {
    return this.request<WidgetDescriptor>('/widgets', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Fetch dynamic widget data (for widgets with dataUrl)
   * This will be implemented when we add the dynamic data endpoint
   */
  async fetchWidgetData(widgetId: string, dataUrl: string): Promise<any> {
    // For now, simulate fetching from the dataUrl
    // TODO: Implement actual data fetching through backend proxy
    try {
      const response = await fetch(dataUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch widget data for ${widgetId}:`, error);
      throw error;
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

// Export singleton instance
export const widgetDescriptorApi = new WidgetDescriptorApiService();

// Also export the class for testing
export { WidgetDescriptorApiService };
