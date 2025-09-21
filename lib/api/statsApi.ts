import { IStatsContent } from "@/models/StatsModel";

export interface ApiResponse {
  success: boolean;
  data: IStatsContent;
  isFallback?: boolean;
  message?: string;
  error?: string;
}

const API_URL = "/api/aapi/stats";

export const statsApi = {
  async getStats(): Promise<ApiResponse> {
    const response = await fetch(API_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch stats");
    }

    return response.json();
  },

  async updateStats(content: IStatsContent): Promise<ApiResponse> {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      throw new Error("Failed to update stats");
    }

    return response.json();
  },

  async addTestimonial(
    testimonial: Omit<any, "_id" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "testimonial",
        item: testimonial,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add testimonial");
    }

    return response.json();
  },

  async addStat(
    stat: Omit<any, "_id" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "stat",
        item: stat,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add stat");
    }

    return response.json();
  },

  async deleteTestimonial(id: string): Promise<ApiResponse> {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "testimonial",
        id,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete testimonial");
    }

    return response.json();
  },

  async deleteStat(id: string): Promise<ApiResponse> {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "stat",
        id,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete stat");
    }

    return response.json();
  },
};
