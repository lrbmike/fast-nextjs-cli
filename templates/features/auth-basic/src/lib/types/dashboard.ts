export type DashboardStat = {
  label: string;
  value: string;
  detail?: string;
};

export type DashboardData = {
  user: {
    name: string;
    role: string;
  };
  stats: DashboardStat[];
  activity: string[];
  updatedAt: string;
};
