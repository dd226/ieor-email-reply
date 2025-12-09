"use client";

import { Email } from "./emails-tab";
import { CheckSquare, Square, CheckCircle, Clock, Send } from "lucide-react";

type AutoSentTableProps = {
  emails?: Email[];
  searchTerm?: string;
  onDelete: (id: number) => void;
  onSelect: (email: Email) => void;
  onSend?: (id: number) => void;
  selectedIds?: Set<number>;
  onToggleSelect?: (id: number) => void;
};

function formatReceivedEastern(received_at: string) {
  if (!received_at) return "—";

  // If the string has no timezone info, assume it's UTC and append "Z"
  const iso =
    received_at.endsWith("Z") || received_at.includes("+")
      ? received_at
      : received_at + "Z";

  const date = new Date(iso);

  return (
    date.toLocaleString("en-US", {
      timeZone: "America/New_York",
    }) + " ET"
  );
}

type ResponseTimeInfo = {
  label: string;
  minutes: number;
  quality: "excellent" | "good" | "slow" | "very_slow";
};

function getResponseTime(received_at: string, approved_at?: string | null): ResponseTimeInfo {
  if (!received_at || !approved_at) return { label: "—", minutes: 0, quality: "good" };

  const receiveIso =
    received_at.endsWith("Z") || received_at.includes("+")
      ? received_at
      : received_at + "Z";

  const approveIso =
    approved_at.endsWith("Z") || approved_at.includes("+")
      ? approved_at
      : approved_at + "Z";

  const received = new Date(receiveIso);
  const approved = new Date(approveIso);
  let diffMs = approved.getTime() - received.getTime();
  if (diffMs < 0) diffMs = 0;

  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  let label: string;
  if (diffMinutes < 1) {
    label = "<1m";
  } else if (diffMinutes < 60) {
    label = `${diffMinutes}m`;
  } else if (diffHours < 24) {
    const mins = diffMinutes % 60;
    label = mins > 0 ? `${diffHours}h ${mins}m` : `${diffHours}h`;
  } else {
    const hours = diffHours % 24;
    label = hours > 0 ? `${diffDays}d ${hours}h` : `${diffDays}d`;
  }

  // Determine response quality level
  let quality: "excellent" | "good" | "slow" | "very_slow";
  if (diffHours < 1) {
    quality = "excellent";
  } else if (diffHours < 4) {
    quality = "good";
  } else if (diffHours < 24) {
    quality = "slow";
  } else {
    quality = "very_slow";
  }

  return { label, minutes: diffMinutes, quality };
}

export default function AutoSentTable({
  emails = [],
  onDelete,
  onSelect,
  onSend,
  selectedIds = new Set(),
  onToggleSelect,
}: AutoSentTableProps) {
  if (emails.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No approved emails.
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
            <th className="px-4 py-2 text-left">Response Time</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Received</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((email) => {
            const isSelected = selectedIds.has(email.id);
            const responseTime = getResponseTime(email.received_at, email.approved_at);

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
                  {email.student_name ?? "Unknown"}
                </td>

                {/* UNI column */}
                <td className="px-4 py-2 w-[80px] whitespace-nowrap">
                  {email.uni ?? "—"}
                </td>

                <td className="px-4 py-2">{email.subject}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      email.confidence >= 0.8
                        ? "bg-green-100 text-green-800"
                        : email.confidence >= 0.6
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {(email.confidence * 100).toFixed(0)}%
                  </span>
                </td>

                {/* Response Time Column */}
                <td className="px-4 py-2">
                  {email.approved_at ? (
                    <div
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        responseTime.quality === "excellent"
                          ? "bg-green-100 text-green-800"
                          : responseTime.quality === "good"
                          ? "bg-blue-100 text-blue-800"
                          : responseTime.quality === "slow"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                      {responseTime.label}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>

                {/* Status Column */}
                <td className="px-4 py-2">
                  {email.status === "sent" ? (
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3" />
                      Sent
                    </span>
                  ) : email.status === "auto" ? (
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                      <Clock className="h-3 w-3" />
                      Pending Send
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                      {email.status}
                    </span>
                  )}
                </td>

                <td className="px-4 py-2">
                  {formatReceivedEastern(email.received_at)}
                </td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <button
                    onClick={() => onSelect(email)}
                    className="px-3 py-1 rounded-md text-xs font-medium bg-gray-200 text-foreground hover:bg-gray-300"
                  >
                    View
                  </button>
                  {email.status === "auto" && onSend && (
                    <button
                      onClick={() => onSend(email.id)}
                      className="px-3 py-1 rounded-md text-xs font-medium bg-green-600 text-white hover:bg-green-700 inline-flex items-center gap-1"
                    >
                      <Send className="h-3 w-3" />
                      Send
                    </button>
                  )}
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