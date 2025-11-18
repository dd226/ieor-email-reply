"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BACKEND_URL = "http://127.0.0.1:8000";

interface MetricsData {
  emailsToday: number;
  autoSent: number;
  manualReview: number;
  avgConfidence: number; // 0–1
}

type BackendMetrics = {
  emails_total: number;
  emails_today: number;
  auto_count: number;
  review_count: number;
  avg_confidence: number;
  avg_auto_confidence: number;
};

type EmailStatus = "auto" | "review";

type Email = {
  id: number;
  student_name?: string | null;
  subject: string;
  body: string;
  confidence: number;
  status: EmailStatus;
  suggested_reply: string;
  received_at: string;
};

type ChartPoint = { date: string; count: number };

export default function MetricsCards() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartView, setChartView] =
    useState<"daily" | "weekly" | "monthly">("daily");

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      const [metricsRes, emailsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/metrics`),
        fetch(`${BACKEND_URL}/emails`),
      ]);

      if (!metricsRes.ok || !emailsRes.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const metricsData: BackendMetrics = await metricsRes.json();
      const emailsData: Email[] = await emailsRes.json();

      setMetrics({
        emailsToday: metricsData.emails_today,
        autoSent: metricsData.auto_count,
        manualReview: metricsData.review_count,
        avgConfidence: metricsData.avg_confidence ?? 0,
      });

      setEmails(emailsData);
    } catch (err) {
      console.error(err);
      setError("Could not load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const getConfidenceColor = (score: number) => {
    if (score < 0.8) return "text-red-600";
    if (score < 0.95) return "text-amber-600";
    return "text-green-600";
  };

  const getConfidenceBgColor = (score: number) => {
    if (score < 0.8) return "bg-red-100";
    if (score < 0.95) return "bg-amber-100";
    return "bg-green-100";
  };

  const reviewEmails = emails.filter((e) => e.status === "review");

  function sameDay(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function buildDailyData(sourceEmails: Email[]): ChartPoint[] {
    const today = new Date();
    const days: ChartPoint[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const label = d.toLocaleDateString(undefined, { weekday: "short" });

      const count = sourceEmails.filter((e) => {
        const t = new Date(e.received_at);
        return sameDay(t, d);
      }).length;

      days.push({ date: label, count });
    }

    return days;
  }

  function buildWeeklyData(sourceEmails: Email[]): ChartPoint[] {
    const today = new Date();
    const weeks: ChartPoint[] = [];

    for (let w = 3; w >= 0; w--) {
      const start = new Date(today);
      start.setDate(today.getDate() - 7 * w);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);

      const label =
        w === 0
          ? "This week"
          : w === 1
          ? "Last week"
          : `${w} weeks ago`;

      const count = sourceEmails.filter((e) => {
        const t = new Date(e.received_at);
        return t >= start && t < end;
      }).length;

      weeks.push({ date: label, count });
    }
    return weeks;
  }

  function buildMonthlyData(sourceEmails: Email[]): ChartPoint[] {
    const today = new Date();
    const months: ChartPoint[] = [];

    for (let m = 5; m >= 0; m--) {
      const d = new Date(today);
      d.setMonth(today.getMonth() - m);
      d.setDate(1);

      const year = d.getFullYear();
      const month = d.getMonth();

      const label = d.toLocaleDateString(undefined, { month: "short" });

      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);

      const count = sourceEmails.filter((e) => {
        const t = new Date(e.received_at);
        return t >= start && t < end;
      }).length;

      months.push({ date: label, count });
    }

    return months;
  }

  const chartData =
    chartView === "daily"
      ? buildDailyData(emails)
      : chartView === "weekly"
      ? buildWeeklyData(emails)
      : buildMonthlyData(emails);

  const adjustedChartData =
    chartView === "daily" && chartData.length > 0
      ? chartData.map((point, idx) =>
          idx === chartData.length - 1
            ? { ...point, count: metrics?.emailsToday ?? point.count }
            : point,
        )
      : chartData;

  const oldestPendingLabel = (() => {
    if (reviewEmails.length === 0) return "No emails pending review";

    // Helper: treat timestamps as UTC if they don't have explicit timezone info,
    // same as in ManualReviewTable.
    const parseReceivedAt = (received_at: string): Date | null => {
      if (!received_at) return null;

      const iso =
        received_at.endsWith("Z") || received_at.includes("+")
          ? received_at
          : received_at + "Z";

      const d = new Date(iso);
      if (isNaN(d.getTime())) return null;
      return d;
    };

    const dates = reviewEmails
      .map((e) => parseReceivedAt(e.received_at))
      .filter((d): d is Date => d !== null);

    if (dates.length === 0) return "Unknown";

    const now = new Date();
    const oldest = dates.reduce((min, d) => (d < min ? d : min), dates[0]);

    let diffMs = now.getTime() - oldest.getTime();
    if (diffMs < 0) diffMs = 0; // guard against any future timestamps

    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return "< 1 min ago";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    const remMinutes = diffMinutes % 60;

    if (diffHours < 24) {
      if (remMinutes === 0)
        return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
      return `${diffHours} hr${diffHours === 1 ? "" : "s"} ${remMinutes} min ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  })();

  if (loading && !metrics && !error) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i} className="border border-blue-100 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Loading…
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="space-y-4">
        <Card className="border border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-red-700">
              Could not load dashboard data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-red-600">
              Make sure the backend is running on {BACKEND_URL}.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const emailsToday = metrics.emailsToday;
  const autoSent = metrics.autoSent;
  const manualReview = metrics.manualReview;
  const avgConfidence = metrics.avgConfidence || 0;

  return (
    <div className="space-y-4">
      {/* Top Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Emails Today */}
        <Card className="border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Emails Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{emailsToday}</div>
            <p className="mt-2 text-xs text-muted-foreground">
              Total emails received today
            </p>
          </CardContent>
        </Card>

        {/* Auto-sent */}
        <Card className="border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Auto-Sent Emails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{autoSent}</div>
            <p className="mt-2 text-xs text-muted-foreground">
              Total emails auto-sent so far
            </p>
          </CardContent>
        </Card>

        {/* Manual Review */}
        <Card className="border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Manual Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{manualReview}</div>

            <p className="mt-2 text-xs text-muted-foreground">
              {manualReview === 0 ? (
                "No emails pending review"
              ) : (
                <>
                  Emails waiting for advisor review.
                  <br />
                  Oldest pending: {oldestPendingLabel}
                </>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Average Confidence */}
        <Card
          className={`border shadow-sm hover:shadow-md transition-shadow ${getConfidenceBgColor(
            avgConfidence,
          )}`}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${getConfidenceColor(
                avgConfidence,
              )}`}
            >
              {(avgConfidence * 100).toFixed(0)}%
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              All emails in the system
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border border-blue-100 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Emails Received Over Time
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={chartView === "daily" ? "default" : "outline"}
              onClick={() => setChartView("daily")}
              className={
                chartView === "daily" ? "bg-blue-600 hover:bg-blue-700" : ""
              }
            >
              Daily
            </Button>
            <Button
              size="sm"
              variant={chartView === "weekly" ? "default" : "outline"}
              onClick={() => setChartView("weekly")}
              className={
                chartView === "weekly" ? "bg-blue-600 hover:bg-blue-700" : ""
              }
            >
              Weekly
            </Button>
            <Button
              size="sm"
              variant={chartView === "monthly" ? "default" : "outline"}
              onClick={() => setChartView("monthly")}
              className={
                chartView === "monthly" ? "bg-blue-600 hover:bg-blue-700" : ""
              }
            >
              Monthly
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={adjustedChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #d1d5db",
                }}
                formatter={(value) => [`${value} emails`, "Emails received"]}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ fill: "#2563eb", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}