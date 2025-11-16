"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import ManualReviewTable from "@/components/manual-review-table";
import AutoSentTable from "@/components/auto-sent-table";
import { SAMPLE_EMAILS } from "@/components/sample-emails";

type FilterType = "all" | "today" | "high" | "low";
type EmailStatus = "auto" | "review";

export type Email = {
  id: number;
  student_name?: string | null;
  uni?: string | null;
  subject: string;
  body: string;
  confidence: number; // 0–1
  status: EmailStatus;
  suggested_reply: string;
  received_at: string; // ISO timestamp from backend
};

type Metrics = {
  emails_total: number;
  emails_today: number;
  auto_count: number;
  review_count: number;
};

const BACKEND_URL = "http://127.0.0.1:8000";
const CONFIDENCE_THRESHOLD_KEY = "confidenceThresholdPct";
const DEFAULT_CONFIDENCE_THRESHOLD_PCT = 90; // fallback if nothing saved

export default function EmailsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeSection, setActiveSection] = useState<"review" | "auto">("review");

  const [reviewEmails, setReviewEmails] = useState<Email[]>([]);
  const [autoEmails, setAutoEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState<boolean>(false);

  // detail panel
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [replyDraft, setReplyDraft] = useState<string>("");

  // metrics from backend
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  // confidence threshold for high vs low (0–1), set from Settings
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(
    DEFAULT_CONFIDENCE_THRESHOLD_PCT / 100,
  );

  const filters: { id: FilterType; label: string; description: string }[] = [
    { id: "all", label: "All", description: "Show all emails" },
    {
      id: "today",
      label: "Sent Today",
      description: "Emails received today",
    },
    {
      id: "high",
      label: "High Confidence",
      description: "Emails at or above the advisor's confidence threshold",
    },
    {
      id: "low",
      label: "Low Confidence",
      description: "Emails below the advisor's confidence threshold",
    },
  ];

  // --- Load confidence threshold from localStorage (set in Settings) ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem(CONFIDENCE_THRESHOLD_KEY);
    if (!saved) return;

    const pct = Number(saved);
    if (!Number.isNaN(pct) && pct >= 0 && pct <= 100) {
      setConfidenceThreshold(pct / 100);
    }
  }, []);

  // --- Fetch emails from backend ---
  async function fetchEmails() {
    try {
      setLoading(true);
      setError(null);

      const [autoRes, reviewRes] = await Promise.all([
        fetch(`${BACKEND_URL}/emails?status=auto`),
        fetch(`${BACKEND_URL}/emails?status=review`),
      ]);

      if (!autoRes.ok || !reviewRes.ok) {
        throw new Error("Failed to fetch emails from backend");
      }

      const autoData: Email[] = await autoRes.json();
      const reviewData: Email[] = await reviewRes.json();

      setAutoEmails(autoData);
      setReviewEmails(reviewData);
    } catch (err) {
      console.error(err);
      setError("Could not load emails from backend");
    } finally {
      setLoading(false);
    }
  }

  // --- Fetch metrics from backend ---
  async function fetchMetrics() {
    try {
      const res = await fetch(`${BACKEND_URL}/metrics`);
      if (!res.ok) {
        throw new Error("Failed to fetch metrics");
      }
      const data: Metrics = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error(err);
      // metrics failure is non-blocking
    }
  }

  // --- Seed ONE random example email into backend ---
  async function seedExampleEmails() {
    try {
      setSeeding(true);
      setError(null);

      const random =
        SAMPLE_EMAILS[Math.floor(Math.random() * SAMPLE_EMAILS.length)];

      const sampleEmail = {
        student_name: random.student_name,
        uni: random.uni,
        subject: random.subject,
        body: random.body,
        received_at: new Date().toISOString(),
      };

      await fetch(`${BACKEND_URL}/emails/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sampleEmail),
      });

      await Promise.all([fetchEmails(), fetchMetrics()]);
    } catch (err) {
      console.error(err);
      setError("Could not create sample email");
    } finally {
      setSeeding(false);
    }
  }

  // --- Advisor actions: approve reply (status -> auto) ---
  async function handleApprove(emailId: number, newReply?: string) {
    try {
      const body: any = { status: "auto" };
      if (newReply !== undefined) {
        body.suggested_reply = newReply;
      }

      await fetch(`${BACKEND_URL}/emails/${emailId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      await Promise.all([fetchEmails(), fetchMetrics()]);
    } catch (err) {
      console.error(err);
      setError("Could not update email status");
    }
  }

  // --- Advisor actions: delete email ---
  async function handleDelete(emailId: number) {
    try {
      await fetch(`${BACKEND_URL}/emails/${emailId}`, {
        method: "DELETE",
      });

      await Promise.all([fetchEmails(), fetchMetrics()]);
    } catch (err) {
      console.error(err);
      setError("Could not delete email");
    }
  }

  // --- Selecting an email (for detail panel) ---
  function handleSelect(email: Email) {
    setSelectedEmail(email);
    setReplyDraft(email.suggested_reply || "");
  }

  function closeDetail() {
    setSelectedEmail(null);
    setReplyDraft("");
  }

  useEffect(() => {
    fetchEmails();
    fetchMetrics();
  }, []);

  // --- Helper: calendar "same day" check for Sent Today ---
  function isSameDay(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  // --- Helper: apply filter + search to a list of emails ---
  function filterEmails(emails: Email[]): Email[] {
    let filtered = [...emails];

    // Sent Today → filter by calendar day
    if (activeFilter === "today") {
      const today = new Date();
      filtered = filtered.filter((e) => {
        const t = new Date(e.received_at);
        return isSameDay(t, today);
      });
    }

    // High / Low confidence using the advisor-set threshold
    if (activeFilter === "high") {
      filtered = filtered.filter((e) => e.confidence >= confidenceThreshold);
    }
    if (activeFilter === "low") {
      filtered = filtered.filter((e) => e.confidence < confidenceThreshold);
    }

    // Text search: student name, UNI, subject
    if (searchTerm.trim().length > 0) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((e) => {
        return (
          (e.student_name ?? "").toLowerCase().includes(q) ||
          (e.uni ?? "").toLowerCase().includes(q) ||
          e.subject.toLowerCase().includes(q)
        );
      });
    }

    return filtered;
  }

  const filteredReviewEmails = filterEmails(reviewEmails);
  const filteredAutoEmails = filterEmails(autoEmails);

  if (loading && !seeding && reviewEmails.length === 0 && autoEmails.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Email Management</h2>
        <p className="text-muted-foreground mt-1">Loading emails…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Email Management</h2>
        <p className="text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  const thresholdPctLabel = Math.round(confidenceThreshold * 100);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Email Management</h2>
          <p className="text-muted-foreground mt-1">
            Review and manage student emails
          </p>
        </div>

        {/* Metrics strip */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Total emails</p>
              <p className="text-xl font-semibold">{metrics.emails_total}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Emails today</p>
              <p className="text-xl font-semibold">{metrics.emails_today}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Needs review</p>
              <p className="text-xl font-semibold">{metrics.review_count}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Approved</p>
              <p className="text-xl font-semibold">{metrics.auto_count}</p>
            </div>
          </div>
        )}

        {/* Seed sample email button */}
        <div className="flex items-center gap-3">
          <button
            onClick={seedExampleEmails}
            disabled={seeding}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white shadow-md hover:bg-blue-700 disabled:opacity-60"
          >
            {seeding ? "Creating sample email..." : "Generate sample email"}
          </button>
          <span className="text-xs text-muted-foreground">
            Each click adds a new example student email into the system.
          </span>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === filter.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-foreground hover:bg-gray-200"
              }`}
              title={filter.description}
            >
              {filter.label}
            </button>
          ))}
          <span className="text-xs text-muted-foreground">
            High/Low confidence split at {thresholdPctLabel}% (set in Settings).
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-border">
          <button
            onClick={() => setActiveSection("review")}
            className={`pb-3 px-1 font-medium text-sm transition-all ${
              activeSection === "review"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Needs Review ({filteredReviewEmails.length})
          </button>
          <button
            onClick={() => setActiveSection("auto")}
            className={`pb-3 px-1 font-medium text-sm transition-all ${
              activeSection === "auto"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Approved ({filteredAutoEmails.length})
          </button>
        </div>

        {/* Tables + per-section search boxes */}
        {activeSection === "review" && (
          <div className="space-y-4">
            {/* Search bar for Needs Review */}
            <Input
              placeholder="Search by student name, UNI, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />

            <ManualReviewTable
              emails={filteredReviewEmails}
              searchTerm={searchTerm}
              onApprove={(id) => handleApprove(id)}
              onDelete={handleDelete}
              onSelect={handleSelect}
            />
          </div>
        )}

        {activeSection === "auto" && (
          <div className="space-y-4">
            {/* Search bar for Approved */}
            <Input
              placeholder="Search by student name, UNI, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />

            <AutoSentTable
              emails={filteredAutoEmails}
              searchTerm={searchTerm}
              onDelete={handleDelete}
              onSelect={handleSelect}
            />
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
          <div className="w-full max-w-xl bg-background h-full shadow-xl p-6 overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedEmail.subject}
                </h3>
                <p className="text-sm text-muted-foreground">
                  From: {selectedEmail.student_name ?? "Unknown student"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Received:{" "}
                  {new Date(selectedEmail.received_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={closeDetail}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {/* Student email */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-1">Student email</h4>
              <div className="text-sm border border-border rounded-md p-3 bg-muted/40 whitespace-pre-wrap">
                {selectedEmail.body}
              </div>
            </div>

            {/* AI reply */}
            <div className="mb-2">
              <h4 className="text-sm font-semibold mb-1">AI-suggested reply</h4>

              {selectedEmail.status === "review" ? (
                // Editable textarea when still needing review
                <textarea
                  className="w-full border border-border rounded-md p-2 text-sm min-h-[160px] resize-vertical"
                  value={replyDraft}
                  onChange={(e) => setReplyDraft(e.target.value)}
                />
              ) : (
                // Read-only for approved emails
                <div className="text-sm border border-border rounded-md p-3 bg-muted/40 whitespace-pre-wrap">
                  {selectedEmail.suggested_reply}
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Confidence: {(selectedEmail.confidence * 100).toFixed(0)}%
            </p>

            <div className="flex gap-2">
              {/* ONLY show Approve button when email is NOT approved */}
              {selectedEmail.status === "review" && (
                <button
                  onClick={async () => {
                    await handleApprove(selectedEmail.id, replyDraft);
                    closeDetail();
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700"
                >
                  Approve Reply
                </button>
              )}

              {/* Delete is always available */}
              <button
                onClick={async () => {
                  await handleDelete(selectedEmail.id);
                  closeDetail();
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>

              <button
                onClick={closeDetail}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted/40"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}