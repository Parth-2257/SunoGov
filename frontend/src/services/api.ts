import { AIAnalysis, Grievance, ResourceItem } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Helper to handle fetch responses and raise errors on non-2xx status
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData?.detail) {
        errorMessage = errorData.detail;
      }
    } catch {
      // Ignore JSON parsing failures on error response
    }
    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
}

export const apiService = {
  /**
   * Health check to check connection to the backend FastAPI service
   */
  async checkHealth(): Promise<{ status: string; service: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse<{ status: string; service: string }>(response);
  },

  /**
   * AI Analysis placeholder
   */
  async analyzeRequest(text: string): Promise<AIAnalysis> {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return handleResponse<AIAnalysis>(response);
  },

  /**
   * Grievance Creation placeholder
   */
  async createGrievance(data: Omit<Grievance, 'id' | 'status' | 'created_at' | 'updated_at' | 'reminders_sent'>): Promise<Grievance> {
    const response = await fetch(`${API_BASE_URL}/grievances`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Grievance>(response);
  },

  /**
   * Fetch Grievance details placeholder
   */
  async getGrievance(id: string): Promise<Grievance> {
    const response = await fetch(`${API_BASE_URL}/grievances/${id}`);
    return handleResponse<Grievance>(response);
  },

  /**
   * Send a grievance reminder placeholder
   */
  async sendReminder(id: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/grievances/${id}/remind`, {
      method: 'POST',
    });
    return handleResponse<{ success: boolean }>(response);
  },

  /**
   * Fetch information resources placeholder
   */
  async getResources(): Promise<ResourceItem[]> {
    const response = await fetch(`${API_BASE_URL}/resources`);
    return handleResponse<ResourceItem[]>(response);
  }
};
