"use client";

import { Email } from "./emails-tab";

type AutoSentTableProps = {
  emails?: Email[];
  searchTerm?: string;
  onDelete: (id: number) => void;
  onSelect: (email: Email) => void;
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

export default function AutoSentTable({
  emails = [],
  onDelete,
  onSelect,
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
            <th className="px-4 py-2 text-left">Student</th>
            <th className="px-4 py-2 text-left">Subject</th>
            <th className="px-4 py-2 text-left">Confidence</th>
            <th className="px-4 py-2 text-left">Received</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((email) => (
            <tr
              key={email.id}
              className="border-t border-border hover:bg-muted/40"
            >
              <td className="px-4 py-2">
                {email.student_name ?? "Unknown"}
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
              <td className="px-4 py-2">
                {formatReceivedEastern(email.received_at)}
              </td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => onSelect(email)}
                  className="px-3 py-1 rounded-md text-xs font-medium bg-gray-200 text-foreground hover:bg-gray-300"
                >
                  View
                </button>
                <button
                  onClick={() => onDelete(email.id)}
                  className="px-3 py-1 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}