"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BACKEND_URL = "http://127.0.0.1:8000";

// must match SettingsTab
const CONFIDENCE_THRESHOLD_KEY = "confidenceThresholdPct";
const DEFAULT_CONFIDENCE_THRESHOLD_PCT = 92;

type EmailStatus = "auto" | "review";

type Email = {
  id: number;
  student_name?: string | null;
  subject: string;
  body: string;
  confidence: number; // 0–1
  status: EmailStatus;
  suggested_reply: string;
  received_at: string;
};

type ConfidenceBucket = {
  range: string;
  count: number;
  percentage: number;
};

type ReviewBucket = {
  name: string;
  value: number; // count of emails in this bucket
  percentage: number; // % of review emails in this bucket
  color: string;
};

export default function AnalyticsTab() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // threshold in PERCENT (50–100), same as SettingsTab slider
  const [thresholdPct, setThresholdPct] = useState<number>(
    DEFAULT_CONFIDENCE_THRESHOLD_PCT,
  );

  // --- Fetch all emails from backend ---
  useEffect(() => {
    async function fetchEmails() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${BACKEND_URL}/emails`);
        if (!res.ok) {
          throw new Error("Failed to fetch emails");
        }
        const data: Email[] = await res.json();
        setEmails(data);
      } catch (err) {
        console.error(err);
        setError("Could not load analytics data");
      } finally {
        setLoading(false);
      }
    }

    fetchEmails();
  }, []);

  // --- Load advisor threshold from the same localStorage key as SettingsTab ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(CONFIDENCE_THRESHOLD_KEY);
    if (stored) {
      const value = Number(stored);
      if (!Number.isNaN(value)) {
        setThresholdPct(value);
      }
    }
  }, []);

  const total = emails.length;

  // --- Confidence distribution buckets (REAL, from DB) ---
  const bucketDefs = [
    { label: "0–60%", min: 0.0, max: 0.6 },
    { label: "60–80%", min: 0.6, max: 0.8 },
    { label: "80–95%", min: 0.8, max: 0.95 },
    { label: "95–100%", min: 0.95, max: 1.01 },
  ];

  const bucketCounts = new Array(bucketDefs.length).fill(0);
  for (const e of emails) {
    const c = e.confidence ?? 0;
    let idx = 0;
    if (c < 0.6) idx = 0;
    else if (c < 0.8) idx = 1;
    else if (c < 0.95) idx = 2;
    else idx = 3;
    bucketCounts[idx] += 1;
  }

  const confidenceDistribution: ConfidenceBucket[] = bucketDefs.map((b, i) => {
    const count = bucketCounts[i];
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      range: b.label,
      count,
      percentage,
    };
  });

  // gradient-style colors for confidence buckets
  const getBucketColor = (range: string) => {
    if (range.startsWith("0")) {
      // 0–60%
      return "#fca5a5"; // soft red
    }
    if (range.startsWith("60")) {
      // 60–80%
      return "#fde68a"; // soft yellow
    }
    if (range.startsWith("80")) {
      // 80–95%
      return "#4ade80"; // light green
    }
    // 95–100%
    return "#22c55e"; // richer green
  };

  // --- Review breakdown (REAL: review emails by confidence bucket) ---
  const reviewEmails = emails.filter((e) => e.status === "review");
  const reviewTotal = reviewEmails.length;

  const reviewBucketCounts = new Array(bucketDefs.length).fill(0);
  for (const e of reviewEmails) {
    const c = e.confidence ?? 0;
    let idx = 0;
    if (c < 0.6) idx = 0;
    else if (c < 0.8) idx = 1;
    else if (c < 0.95) idx = 2;
    else idx = 3;
    reviewBucketCounts[idx] += 1;
  }

  const reviewReasons: ReviewBucket[] = bucketDefs.map((b, i) => {
    const count = reviewBucketCounts[i];
    const percentage =
      reviewTotal > 0 ? Math.round((count / reviewTotal) * 100) : 0;
    return {
      name: b.label,
      value: count,
      percentage,
      color: getBucketColor(b.label),
    };
  });

  // --- Key insight numbers (use threshold from Settings) ---
  const effectiveThreshold = thresholdPct / 100; // convert 92 -> 0.92
  const thresholdPercent = thresholdPct;

  const lowConfAll = emails.filter(
    (e) => (e.confidence ?? 0) < effectiveThreshold,
  ).length;
  const lowConfPercent = total > 0 ? Math.round((lowConfAll / total) * 100) : 0;

  const pendingCount = reviewTotal;
  const pendingPercent = total > 0 ? Math.round((pendingCount / total) * 100) : 0;

  if (loading && !emails.length && !error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
        <p className="mt-1 text-muted-foreground">Loading analytics…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
        <p className="mt-1 text-red-600">{error}</p>
      </div>
    );
  }

  if (!total) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
        <p className="mt-1 text-muted-foreground">
          No emails yet — analytics will appear once emails start flowing into the system.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
        <p className="mt-1 text-muted-foreground">
          Email processing insights and trends (based on real data)
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Confidence Distribution */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">Confidence Distribution</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              How many emails fall into each confidence bracket
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={confidenceDistribution}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis dataKey="range" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f3f4f6",
                    border: "1px solid #d1d5db",
                  }}
                  formatter={(value, name) =>
                    name === "count"
                      ? [`${value} emails`, "Count"]
                      : [value, name]
                  }
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {confidenceDistribution.map((item) => (
                    <Cell
                      key={item.range}
                      fill={getBucketColor(item.range)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Review Confidence Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Review Confidence Breakdown</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              How confidence scores are distributed among emails that still need manual review
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reviewReasons}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  dataKey="value"
                >
                  {reviewReasons.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(_value, _name, info) =>
                    `${info?.payload?.percentage ?? 0}%`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-2">
              {reviewReasons.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-foreground">{item.name}</span>
                  <span className="ml-auto text-sm font-semibold text-muted-foreground">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-4">
            <div className="text-3xl font-bold text-blue-600">
              {lowConfPercent}%
            </div>
            <p className="text-sm text-blue-800">
              of all emails have confidence below {thresholdPercent}%.
              You may want to adjust thresholds or expand the knowledge base
              for these queries.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-3xl font-bold text-blue-600">
              {pendingPercent}%
            </div>
            <p className="text-sm text-blue-800">
              of emails are currently pending manual review ({pendingCount} out of {total}).
              As you approve more replies, this percentage will decrease.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}