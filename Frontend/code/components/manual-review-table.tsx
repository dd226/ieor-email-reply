"use client";

import { Email } from "./emails-tab";
import { CheckSquare, Square, Clock, Send } from "lucide-react";
import DraftBadge from "./draft-badge";

type ManualReviewTableProps = {
  emails?: Email[];
  searchTerm?: string;
  onApprove: (id: number) => void;
  onDelete: (id: number) => void;
  onSelect: (email: Email) => void;
  selectedIds?: Set<number>;
  onToggleSelect?: (id: number) => void;
  savedDrafts?: Record<number, string>;
};

function formatReceivedEastern(received_at: string) {
  if (!received_at) return "—";

  // If the string has no timezone info, assume it's UTC and append "Z"
  const iso =
    received_at.endsWith("Z") || received_at.includes("+")
      ? received_at
      : received_at + "Z";

  const date = new Date(iso);

  return date.toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

type WaitingTimeInfo = {
  label: string;
  minutes: number;
  severity: "green" | "yellow" | "red";
};

function getWaitingTime(received_at: string): WaitingTimeInfo {
  if (!received_at) return { label: "—", minutes: 0, severity: "green" };

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

  // Determine severity level (shared with other tabs)
  let severity: WaitingTimeInfo["severity"];
  if (diffHours <= 12) {
    severity = "green";
  } else if (diffHours <= 24) {
    severity = "yellow";
  } else {
    severity = "red";
  }

  return { label, minutes: diffMinutes, severity };
}

export default function ManualReviewTable({
  emails = [],
  onApprove,
  onDelete,
  onSelect,
  selectedIds = new Set(),
  onToggleSelect,
  savedDrafts = {},
}: ManualReviewTableProps) {
  if (emails.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No emails needing review.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            {onToggleSelect && (
              <th className="px-3 py-2 text-left w-[40px]">
                <span className="sr-only">Select</span>
              </th>
            )}
            <th className="px-4 py-2 text-left">Student</th>
            <th className="px-4 py-2 text-left w-[80px]">UNI</th>
            <th className="px-4 py-2 text-left">Subject</th>
            <th className="px-4 py-2 text-left">Confidence</th>
            <th className="px-4 py-2 text-left">Waiting</th>
            <th className="px-4 py-2 text-left">Received</th>
            <th className="px-4 py-2 text-left w-[240px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((email) => {
            const isSelected = selectedIds.has(email.id);
            const hasDraft = !!savedDrafts[email.id];
            const waitingTime = getWaitingTime(email.received_at);

            return (
              <tr
                key={email.id}
                className={`border-t border-border hover:bg-muted/40 ${
                  isSelected ? "bg-blue-50" : ""
                }`}
              >
                {onToggleSelect && (
                  <td className="px-3 py-2">
                    <button
                      onClick={() => onToggleSelect(email.id)}
                      className="p-1 rounded hover:bg-gray-200"
                      aria-label={isSelected ? "Deselect" : "Select"}
                    >
                      {isSelected ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Square className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </td>
                )}
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="truncate">{email.student_name ?? "Unknown"}</span>
                    {hasDraft && <DraftBadge />}
                  </div>
                </td>

                {/* UNI — now same size & color as Student */}
                <td className="px-4 py-2 w-[80px] whitespace-nowrap">
                  {email.uni ?? "—"}
                </td>

                <td className="px-4 py-2 w-[260px] max-w-[260px]">
                  <span className="block truncate" title={email.subject}>
                    {email.subject}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      email.confidence < 0.6
                        ? "bg-red-100 text-red-800"
                        : email.confidence < 0.8
                        ? "bg-yellow-100 text-yellow-800"
                        : email.confidence < 0.95
                        ? "bg-green-100 text-green-800"
                        : "bg-green-200 text-green-900"
                    }`}
                  >
                    {(email.confidence * 100).toFixed(0)}%
                  </span>
                </td>

                {/* Waiting Time Column */}
                <td className="px-4 py-2">
                  <div
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      waitingTime.severity === "green"
                        ? "bg-green-100 text-green-800"
                        : waitingTime.severity === "yellow"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    {waitingTime.label}
                  </div>
                </td>

                <td className="px-4 py-2">
                  {formatReceivedEastern(email.received_at)}
                </td>
                <td className="px-4 py-2 space-x-2 w-[240px] whitespace-nowrap">
                  <button
                    onClick={() => onSelect(email)}
                    className="px-3 py-1 rounded-md text-xs font-medium bg-gray-200 text-foreground hover:bg-gray-300"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onApprove(email.id)}
                    className="px-3 py-1 rounded-md text-xs font-medium bg-green-600 text-white hover:bg-green-700 inline-flex items-center gap-1"
                  >
                    <Send className="h-3 w-3" />
                    Send
                  </button>
                  <button
                    onClick={() => onDelete(email.id)}
                    className="px-3 py-1 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
