"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import ManualReviewTable from "@/components/manual-review-table";
import AutoSentTable from "@/components/auto-sent-table";
import { SAMPLE_EMAILS } from "@/components/sample-emails";
import { CheckSquare, Square, Trash2, Send, Save, X, RotateCcw, Clock, AlertTriangle } from "lucide-react";

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
const DRAFTS_STORAGE_KEY = "emailDrafts";

// Helper to calculate waiting time
type WaitingTimeInfo = {
  label: string;
  minutes: number;
  urgency: "low" | "medium" | "high" | "critical";
};

function getWaitingTime(received_at: string): WaitingTimeInfo {
  if (!received_at) return { label: "—", minutes: 0, urgency: "low" };

  const iso =
    received_at.endsWith("Z") || received_at.includes("+")
      ? received_at
      : received_at + "Z";

  const received = new Date(iso);
  const now = new Date();
  let diffMs = now.getTime() - received.getTime();
  if (diffMs < 0) diffMs = 0;

  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  let label: string;
  if (diffMinutes < 1) {
    label = "< 1m";
  } else if (diffMinutes < 60) {
    label = `${diffMinutes}m`;
  } else if (diffHours < 24) {
    const mins = diffMinutes % 60;
    label = mins > 0 ? `${diffHours}h ${mins}m` : `${diffHours}h`;
  } else {
    const hours = diffHours % 24;
    label = hours > 0 ? `${diffDays}d ${hours}h` : `${diffDays}d`;
  }

  // Determine urgency level
  let urgency: "low" | "medium" | "high" | "critical";
  if (diffHours < 4) {
    urgency = "low";
  } else if (diffHours < 12) {
    urgency = "medium";
  } else if (diffHours < 24) {
    urgency = "high";
  } else {
    urgency = "critical";
  }

  return { label, minutes: diffMinutes, urgency };
}

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
  const [draftSaved, setDraftSaved] = useState<boolean>(false);

  // metrics from backend
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  // confidence threshold for high vs low (0–1), set from Settings
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(
    DEFAULT_CONFIDENCE_THRESHOLD_PCT / 100,
  );

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState<boolean>(false);

  // Saved drafts (localStorage)
  const [savedDrafts, setSavedDrafts] = useState<Record<number, string>>({});

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

  // --- Load saved drafts from localStorage ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(DRAFTS_STORAGE_KEY);
    if (stored) {
      try {
        setSavedDrafts(JSON.parse(stored));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  // --- Save drafts to localStorage whenever they change ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(savedDrafts));
  }, [savedDrafts]);

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

      // Remove from saved drafts after approval
      setSavedDrafts((prev) => {
        const updated = { ...prev };
        delete updated[emailId];
        return updated;
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

      // Remove from saved drafts
      setSavedDrafts((prev) => {
        const updated = { ...prev };
        delete updated[emailId];
        return updated;
      });

      // Remove from selection
      setSelectedIds((prev) => {
        const updated = new Set(prev);
        updated.delete(emailId);
        return updated;
      });

      await Promise.all([fetchEmails(), fetchMetrics()]);
    } catch (err) {
      console.error(err);
      setError("Could not delete email");
    }
  }

  // --- Save draft without sending ---
  function handleSaveDraft(emailId: number, draft: string) {
    setSavedDrafts((prev) => ({
      ...prev,
      [emailId]: draft,
    }));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  }

  // --- Bulk approve selected emails ---
  async function handleBulkApprove() {
    if (selectedIds.size === 0) return;

    setBulkActionLoading(true);
    try {
      const promises = Array.from(selectedIds).map((id) => {
        const draft = savedDrafts[id];
        return handleApprove(id, draft);
      });
      await Promise.all(promises);
      setSelectedIds(new Set());
    } catch (err) {
      console.error(err);
      setError("Could not approve selected emails");
    } finally {
      setBulkActionLoading(false);
    }
  }

  // --- Bulk delete selected emails ---
  async function handleBulkDelete() {
    if (selectedIds.size === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.size} email(s)?`
    );
    if (!confirmed) return;

    setBulkActionLoading(true);
    try {
      const promises = Array.from(selectedIds).map((id) => handleDelete(id));
      await Promise.all(promises);
      setSelectedIds(new Set());
    } catch (err) {
      console.error(err);
      setError("Could not delete selected emails");
    } finally {
      setBulkActionLoading(false);
    }
  }

  // --- Toggle selection for an email ---
  function toggleSelect(emailId: number) {
    setSelectedIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(emailId)) {
        updated.delete(emailId);
      } else {
        updated.add(emailId);
      }
      return updated;
    });
  }

  // --- Select all visible emails ---
  function selectAllVisible(emails: Email[]) {
    const allIds = emails.map((e) => e.id);
    setSelectedIds(new Set(allIds));
  }

  // --- Deselect all ---
  function deselectAll() {
    setSelectedIds(new Set());
  }

  // --- Selecting an email (for detail panel) ---
  function handleSelect(email: Email) {
    setSelectedEmail(email);
    // Load saved draft if exists, otherwise use suggested_reply
    const draft = savedDrafts[email.id] ?? email.suggested_reply ?? "";
    setReplyDraft(draft);
    setDraftSaved(false);
  }

  function closeDetail() {
    setSelectedEmail(null);
    setReplyDraft("");
    setDraftSaved(false);
  }

  // --- Reset reply to original AI suggestion ---
  function resetToOriginal() {
    if (selectedEmail) {
      setReplyDraft(selectedEmail.suggested_reply || "");
      // Remove saved draft
      setSavedDrafts((prev) => {
        const updated = { ...prev };
        delete updated[selectedEmail.id];
        return updated;
      });
    }
  }

  // --- Keyboard shortcuts ---
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedEmail) return;

      // Don't trigger shortcuts when typing in textarea
      if (e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "Escape") {
        closeDetail();
      }
    },
    [selectedEmail]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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

  // Count selected in current view
  const selectedInView = activeSection === "review"
    ? filteredReviewEmails.filter((e) => selectedIds.has(e.id)).length
    : filteredAutoEmails.filter((e) => selectedIds.has(e.id)).length;

  const currentEmails = activeSection === "review" ? filteredReviewEmails : filteredAutoEmails;
  const allVisibleSelected = currentEmails.length > 0 && currentEmails.every((e) => selectedIds.has(e.id));

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

  // Check if current email has unsaved changes
  const hasUnsavedChanges = selectedEmail && replyDraft !== (savedDrafts[selectedEmail.id] ?? selectedEmail.suggested_reply);

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

        {/* Bulk Actions Bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-sm font-medium text-blue-800">
              {selectedIds.size} email{selectedIds.size > 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-2 ml-auto">
              {activeSection === "review" && (
                <button
                  onClick={handleBulkApprove}
                  disabled={bulkActionLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  Approve & Send All
                </button>
              )}
              <button
                onClick={handleBulkDelete}
                disabled={bulkActionLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                Delete All
              </button>
              <button
                onClick={deselectAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-200 text-foreground hover:bg-gray-300"
              >
                <X className="h-4 w-4" />
                Clear Selection
              </button>
            </div>
          </div>
        )}

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
            {/* Search bar + Select All for Needs Review */}
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search by student name, UNI, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
              {filteredReviewEmails.length > 0 && (
                <button
                  onClick={() =>
                    allVisibleSelected ? deselectAll() : selectAllVisible(filteredReviewEmails)
                  }
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-foreground hover:bg-gray-200"
                >
                  {allVisibleSelected ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                  {allVisibleSelected ? "Deselect All" : "Select All"}
                </button>
              )}
            </div>

            <ManualReviewTable
              emails={filteredReviewEmails}
              searchTerm={searchTerm}
              onApprove={(id) => handleApprove(id)}
              onDelete={handleDelete}
              onSelect={handleSelect}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              savedDrafts={savedDrafts}
            />
          </div>
        )}

        {activeSection === "auto" && (
          <div className="space-y-4">
            {/* Search bar + Select All for Approved */}
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search by student name, UNI, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
              {filteredAutoEmails.length > 0 && (
                <button
                  onClick={() =>
                    allVisibleSelected ? deselectAll() : selectAllVisible(filteredAutoEmails)
                  }
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium bg-gray-100 text-foreground hover:bg-gray-200"
                >
                  {allVisibleSelected ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                  {allVisibleSelected ? "Deselect All" : "Select All"}
                </button>
              )}
            </div>

            <AutoSentTable
              emails={filteredAutoEmails}
              searchTerm={searchTerm}
              onDelete={handleDelete}
              onSelect={handleSelect}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
            />
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
          <div className="w-full max-w-xl bg-background h-full shadow-xl p-6 overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">
                  {selectedEmail.subject}
                </h3>
                <p className="text-sm text-muted-foreground">
                  From: {selectedEmail.student_name ?? "Unknown student"}
                  {selectedEmail.uni && (
                    <>
                      {" · UNI: "}
                      {selectedEmail.uni}
                      {" · "}
                      {`${selectedEmail.uni}@columbia.edu`}
                    </>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Received:{" "}
                  {new Date(selectedEmail.received_at).toLocaleString()}
                </p>
                {/* Waiting time indicator */}
                {selectedEmail.status === "review" && (() => {
                  const waitTime = getWaitingTime(selectedEmail.received_at);
                  return (
                    <div
                      className={`inline-flex items-center gap-1.5 mt-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                        waitTime.urgency === "low"
                          ? "bg-green-100 text-green-800"
                          : waitTime.urgency === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : waitTime.urgency === "high"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {waitTime.urgency === "critical" ? (
                        <AlertTriangle className="h-3.5 w-3.5" />
                      ) : (
                        <Clock className="h-3.5 w-3.5" />
                      )}
                      Waiting: {waitTime.label}
                      {waitTime.urgency === "critical" && " — Urgent!"}
                    </div>
                  );
                })()}
              </div>
              <button
                onClick={closeDetail}
                className="text-sm text-muted-foreground hover:text-foreground p-1"
                aria-label="Close details"
              >
                <X className="h-5 w-5" />
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
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold">AI-suggested reply</h4>
                {selectedEmail.status === "review" && (
                  <button
                    onClick={resetToOriginal}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 transition-colors"
                    title="Reset to original AI suggestion"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset to Original
                  </button>
                )}
              </div>

              {selectedEmail.status === "review" ? (
                // Editable textarea when still needing review
                <textarea
                  className="w-full border border-border rounded-md p-2 text-sm min-h-[160px] resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            {/* Confidence + Draft indicator */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-muted-foreground">
                Confidence: {(selectedEmail.confidence * 100).toFixed(0)}%
              </p>
              {savedDrafts[selectedEmail.id] && (
                <span className="text-xs text-amber-600 font-medium">
                  📝 Draft saved
                </span>
              )}
              {draftSaved && (
                <span className="text-xs text-green-600 font-medium animate-pulse">
                  ✓ Saved!
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              {/* ONLY show these buttons when email is NOT approved */}
              {selectedEmail.status === "review" && (
                <>
                  <button
                    onClick={async () => {
                      await handleApprove(selectedEmail.id, replyDraft);
                      closeDetail();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700"
                  >
                    <Send className="h-4 w-4" />
                    Approve & Send
                  </button>
                  <button
                    onClick={() => handleSaveDraft(selectedEmail.id, replyDraft)}
                    disabled={!hasUnsavedChanges}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" />
                    Save Draft
                  </button>
                </>
              )}

              {/* Delete is always available */}
              <button
                onClick={async () => {
                  await handleDelete(selectedEmail.id);
                  closeDetail();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>

              <button
                onClick={closeDetail}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted/40"
              >
                Close
              </button>
            </div>

            {/* Keyboard hint */}
            <p className="mt-4 text-xs text-muted-foreground">
              Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Esc</kbd> to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}