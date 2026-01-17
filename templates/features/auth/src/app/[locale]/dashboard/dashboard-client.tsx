"use client";

import type { DashboardData } from "@/lib/types/dashboard";

type DashboardClientProps = {
  data: DashboardData;
};

export default function DashboardClient({ data }: DashboardClientProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {data.stats.map((stat) => (
          <div key={stat.label} className="rounded-md border px-3 py-2">
            <div className="text-xs text-muted-foreground">{stat.label}</div>
            <div className="text-lg font-semibold">{stat.value}</div>
            {stat.detail ? (
              <div className="text-xs text-muted-foreground">{stat.detail}</div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="rounded-md border px-3 py-2">
        <div className="text-xs font-medium">Recent activity</div>
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          {data.activity.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="text-xs text-muted-foreground">
        Last updated: {new Date(data.updatedAt).toLocaleString()}
      </div>
    </div>
  );
}
