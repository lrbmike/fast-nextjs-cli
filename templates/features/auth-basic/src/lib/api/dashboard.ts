import "server-only";

import { http, ApiResponse } from "@/lib/http";
import type { DashboardData } from "@/lib/types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  const result = await http<ApiResponse<DashboardData>>("/dashboard");
  return result.data;
}
