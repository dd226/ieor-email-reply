"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

const BACKEND_URL = "http://127.0.0.1:8000";

// ---------------------
// Shared auto-send threshold (used by other tabs)
// ---------------------
const CONFIDENCE_THRESHOLD_KEY = "confidenceThresholdPct";
const DEFAULT_CONFIDENCE_THRESHOLD_PCT = 92;

// ---------------------
// Advisor profile storage
// ---------------------
const PROFILE_KEY = "advisorProfile";

type AdvisorProfile = {
  name: string;
  email: string;
  department: string;
};

const DEFAULT_PROFILE: AdvisorProfile = {
  name: "Dr. Sarah Smith",
  email: "sarah.smith@university.edu",
  department: "Academic Advising Center",
};

// ---------------------
// Knowledge base uploads
// ---------------------
const KB_UPLOADS_KEY = "knowledgeBaseUploads";

type UploadItem = {
  id: string;
  name: string;
  uploadedAt: string; // ISO
};

// ---------------------
// Email templates
// ------------------
const TEMPLATES_KEY = "emailTemplates";

type EmailTemplate = {
  id: string;
  name: string;
  body: string;
  uses: number;
};

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: "course-withdrawal",
    name: "Course Withdrawal",
    body:
      "Hello {student_name},\n\nTo withdraw from a course after the drop deadline, you'll need to submit a Course Withdrawal form via Student Services Online (SSOL) and speak with an academic advisor. Please be aware that a withdrawal may impact your financial aid, visa status (if applicable), and time to degree completion.\n\nOnce processed, your transcript will record a grade of 'W'.\n\nBest,\nAcademic Advising Team",
    uses: 24,
  },
  {
    id: "financial-aid-inquiry",
    name: "Financial Aid Inquiry",
    body:
      "Hello {student_name},\n\nFor questions about your financial aid status, package, or disbursement, the best resource is the Financial Aid Office. You can review your current aid information in NetPartner and schedule an appointment with a financial aid counselor through their website.\n\nIf your question also affects course planning or enrollment, feel free to follow up with us so we can coordinate with Financial Aid on your behalf.\n\nBest,\nAcademic Advising Team",
    uses: 18,
  },
  {
    id: "grade-appeal",
    name: "Grade Appeal",
    body:
      "Hello {student_name},\n\nIf you believe there is an error in your final course grade, the first step is to contact your instructor directly to request clarification. If, after speaking with the instructor, you still feel the grade is inaccurate, you may follow the department's formal grade appeal process.\n\nPolicies and timelines for appeals can be found on the Academic Policies page.\n\nBest,\nAcademic Advising Team",
    uses: 12,
  },
];

// ---------------------
// Email client (Gmail API via OAuth) settings
// ---------------------
type EmailSettingsState = {
  auto_send_enabled: boolean;
  auto_send_threshold: number; // percent 0–100 (shared with other tabs)
  last_synced_at: string | null;
  gmail_connected: boolean;
  gmail_address: string | null;
};

export default function SettingsTab() {
  // Profile state
  const [profile, setProfile] = useState<AdvisorProfile>(DEFAULT_PROFILE);
  const [profileDirty, setProfileDirty] = useState(false);

  // Knowledge base uploads
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Email templates
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editBody, setEditBody] = useState("");

  // Email client / Gmail OAuth settings
  const [emailSettings, setEmailSettings] = useState<EmailSettingsState>({
    auto_send_enabled: false,
    auto_send_threshold: DEFAULT_CONFIDENCE_THRESHOLD_PCT,
    last_synced_at: null,
    gmail_connected: false,
    gmail_address: null,
  });
  const [savingEmailSettings, setSavingEmailSettings] = useState(false);
  const [syncingInbox, setSyncingInbox] = useState(false);
  const [emailSettingsError, setEmailSettingsError] = useState<string | null>(
    null,
  );
  const [settingsSaved, setSettingsSaved] = useState(false);

  // ---------------------
  // Load all settings on mount
  // ---------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Shared auto-send threshold used by other tabs
    const storedThreshold = window.localStorage.getItem(
      CONFIDENCE_THRESHOLD_KEY,
    );
    let thresholdPct = DEFAULT_CONFIDENCE_THRESHOLD_PCT;
    if (storedThreshold) {
      const value = Number(storedThreshold);
      if (!Number.isNaN(value)) {
        thresholdPct = value;
      }
    }

    // Load profile
    const storedProfile = window.localStorage.getItem(PROFILE_KEY);
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile) as AdvisorProfile;
        setProfile(parsed);
      } catch {
        setProfile(DEFAULT_PROFILE);
      }
    } else {
      setProfile(DEFAULT_PROFILE);
    }

    // Load KB uploads
    const storedUploads = window.localStorage.getItem(KB_UPLOADS_KEY);
    if (storedUploads) {
      try {
        const parsed = JSON.parse(storedUploads) as UploadItem[];
        setUploads(parsed);
      } catch {
        console.error("Invalid stored knowledge base uploads");
      }
    }

    // Load email templates
    const storedTemplates = window.localStorage.getItem(TEMPLATES_KEY);
    if (storedTemplates) {
      try {
        const parsed = JSON.parse(storedTemplates) as EmailTemplate[];
        if (parsed.length > 0) {
          setTemplates(parsed);
        } else {
          setTemplates(DEFAULT_TEMPLATES);
        }
      } catch {
        console.error("Invalid stored email templates");
        setTemplates(DEFAULT_TEMPLATES);
      }
    } else {
      setTemplates(DEFAULT_TEMPLATES);
    }

    // Load email settings (auto-send + threshold) best-effort
    fetch(`${BACKEND_URL}/email-settings`)
      .then((res) => {
        if (!res.ok) return;
        return res.json();
      })
      .then((data) => {
        if (!data) {
          setEmailSettings((prev) => ({
            ...prev,
            auto_send_threshold: thresholdPct,
          }));
          return;
        }
        setEmailSettings((prev) => ({
          ...prev,
          auto_send_enabled:
            typeof data.auto_send_enabled === "boolean"
              ? data.auto_send_enabled
              : prev.auto_send_enabled,
          auto_send_threshold:
            typeof data.auto_send_threshold === "number"
              ? Math.round(data.auto_send_threshold * 100)
              : thresholdPct,
          last_synced_at: data.last_synced_at ?? prev.last_synced_at,
        }));
      })
      .catch(() => {
        setEmailSettings((prev) => ({
          ...prev,
          auto_send_threshold: thresholdPct,
        }));
      });

    // Load Gmail connection status (OAuth)
    fetch(`${BACKEND_URL}/gmail/status`)
      .then((res) => {
        if (!res.ok) return;
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setEmailSettings((prev) => ({
          ...prev,
          gmail_connected: !!data.connected,
          gmail_address: data.email_address ?? null,
          last_synced_at: data.last_synced_at ?? prev.last_synced_at,
        }));
      })
      .catch(() => {
        // If this fails, just treat as "not connected"
      });
  }, []);

  // ---------------------
  // Profile interactions
  // ---------------------
  function updateField<K extends keyof AdvisorProfile>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = { ...profile, [key]: e.target.value };
      setProfile(next);
      setProfileDirty(true);
    };
  }

  function saveProfile() {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    setProfileDirty(false);

    // Let header-top know
    window.dispatchEvent(
      new CustomEvent("advisor-profile-updated", { detail: profile }),
    );
  }

  // ---------------------
  // Knowledge Base interactions
  // ---------------------
  function persistUploads(next: UploadItem[]) {
    setUploads(next);
    if (typeof window === "undefined") return;
    window.localStorage.setItem(KB_UPLOADS_KEY, JSON.stringify(next));
  }

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    const now = new Date();
    const newItems: UploadItem[] = [];
    let errorMsg: string | null = null;

    Array.from(fileList).forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (ext !== "json" && ext !== "txt" && ext !== "md" && ext !== "pdf") {
        errorMsg =
          "Only .json, .txt, .md, or .pdf files are currently supported.";
        return;
      }

      newItems.push({
        id: `${now.getTime()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        uploadedAt: now.toISOString(),
      });
    });

    if (errorMsg) {
      setUploadError(errorMsg);
    } else {
      setUploadError(null);
    }

    if (newItems.length > 0) {
      const merged = [...newItems, ...uploads].slice(0, 10);
      persistUploads(merged);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFilesSelected(e.dataTransfer.files);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (isDragging) {
      setIsDragging(false);
    }
  }

  function handleClearUploads() {
    persistUploads([]);
  }

  // ---------------------
  // Email Templates interactions
  // ---------------------
  function persistTemplates(next: EmailTemplate[]) {
    setTemplates(next);
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TEMPLATES_KEY, JSON.stringify(next));
  }

  function startEditingTemplate(template: EmailTemplate) {
    setEditingId(template.id);
    setEditName(template.name);
    setEditBody(template.body);
  }

  function cancelEditingTemplate() {
    setEditingId(null);
    setEditName("");
    setEditBody("");
  }

  function saveEditingTemplate() {
    if (!editingId) return;
    const next = templates.map((t) =>
      t.id === editingId ? { ...t, name: editName, body: editBody } : t,
    );
    persistTemplates(next);
    cancelEditingTemplate();
  }

  function handleAddTemplate() {
    const newTemplate: EmailTemplate = {
      id: `template-${Date.now().toString(36)}`,
      name: "New Template",
      body:
        "Hello {student_name},\n\nThank you for reaching out. [Add your response here.]\n\nBest,\nAcademic Advising Team",
      uses: 0,
    };
    const next = [newTemplate, ...templates];
    persistTemplates(next);
    startEditingTemplate(newTemplate);
  }

  function handleDeleteTemplate(id: string) {
    const next = templates.filter((t) => t.id !== id);
    persistTemplates(next);
    if (editingId === id) {
      cancelEditingTemplate();
    }
  }

  // ---------------------
  // Email Client settings interactions (Gmail OAuth)
  // ---------------------
  
  function updateEmailSettings<K extends keyof EmailSettingsState>(
    key: K,
    value: EmailSettingsState[K],
  ) {
    setEmailSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSaveEmailSettings() {
  setSavingEmailSettings(true);
  setEmailSettingsError(null);
  setSettingsSaved(false);

  // Always save threshold locally so other tabs (Dashboard / Emails) see it
  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      CONFIDENCE_THRESHOLD_KEY,
      String(emailSettings.auto_send_threshold),
    );
  }

  try {
    const payload: any = {
      auto_send_enabled: emailSettings.auto_send_enabled,
      auto_send_threshold: emailSettings.auto_send_threshold / 100,
    };

    const res = await fetch(`${BACKEND_URL}/email-settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      setEmailSettings((prev) => ({
        ...prev,
        auto_send_enabled:
          typeof data.auto_send_enabled === "boolean"
            ? data.auto_send_enabled
            : prev.auto_send_enabled,
        auto_send_threshold:
          typeof data.auto_send_threshold === "number"
            ? Math.round(data.auto_send_threshold * 100)
            : prev.auto_send_threshold,
        last_synced_at: data.last_synced_at ?? prev.last_synced_at,
      }));
    } else {
      // Backend responded but not 2xx – log and move on
      const text = await res.text();
      console.error("Failed to update /email-settings:", text);
    }
  } catch (err) {
    // Network / CORS / browser weirdness – don't spam the UI
    console.error("Error calling /email-settings:", err);
  } finally {
    setSavingEmailSettings(false);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  }
}

  async function handleSyncInbox() {
    setSyncingInbox(true);
    setEmailSettingsError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/emails/sync`, {
        method: "POST",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to sync inbox");
      }
      const data = await res.json();
      setEmailSettings((prev) => ({
        ...prev,
        last_synced_at:
          data.last_synced_at ?? new Date().toISOString(),
      }));
    } catch (err: any) {
      setEmailSettingsError(err.message ?? "Unable to sync inbox");
    } finally {
      setSyncingInbox(false);
    }
  }

  async function handleConnectGmail() {
    setEmailSettingsError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/gmail/auth-url`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to start Gmail connection");
      }
      const data = await res.json();
      if (data.auth_url) {
        // Redirect to Google's OAuth consent screen
        window.location.href = data.auth_url;
      } else {
        throw new Error("auth_url missing from backend response");
      }
    } catch (err: any) {
      setEmailSettingsError(
        err?.message ?? "Unable to open Gmail authorization",
      );
    }
  }

  async function handleDisconnectGmail() {
    setEmailSettingsError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/gmail/disconnect`, {
        method: "POST",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to disconnect Gmail");
      }
      // Clear local Gmail status
      setEmailSettings((prev) => ({
        ...prev,
        gmail_connected: false,
        gmail_address: null,
        last_synced_at: null,
      }));
    } catch (err: any) {
      setEmailSettingsError(err?.message ?? "Unable to disconnect Gmail");
    }
  }

  // ---------------------
  // Render
  // ---------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">
          Configure your email advising system
        </p>
      </div>

      {/* 4 cards in a 2x2 layout on md+ */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Email Client Integration (Gmail OAuth + auto-send threshold) */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Email Client Integration</CardTitle>
              <CardDescription>
                Connect a Gmail inbox via OAuth and control auto-send behavior.
              </CardDescription>
            </div>
            {settingsSaved && (
              <span className="text-xs font-semibold text-green-600">
                Settings saved
              </span>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {emailSettingsError && (
              <p className="text-xs text-red-600 whitespace-pre-line">
                {emailSettingsError}
              </p>
            )}

            <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
              <div>
                <p className="text-sm font-medium">
                  {emailSettings.gmail_connected
                    ? "Connected to Gmail"
                    : "Not connected to Gmail"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {emailSettings.gmail_connected
                    ? emailSettings.gmail_address || "Gmail account connected"
                    : "Use your Google account to authorize access via OAuth."}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={emailSettings.gmail_connected ? "outline" : "default"}
                  className={
                    emailSettings.gmail_connected
                      ? ""
                      : "bg-blue-600 hover:bg-blue-700"
                  }
                  onClick={handleConnectGmail}
                >
                  {emailSettings.gmail_connected ? "Reconnect" : "Connect Gmail"}
                </Button>
                {emailSettings.gmail_connected && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleDisconnectGmail}
                  >
                    Disconnect
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Auto-send replies</p>
                <p className="text-xs text-muted-foreground">
                  When enabled, high-confidence replies will be sent
                  automatically from the connected Gmail account.
                </p>
              </div>
              <Switch
                checked={emailSettings.auto_send_enabled}
                onCheckedChange={(checked) =>
                  updateEmailSettings("auto_send_enabled", checked)
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Auto-send confidence threshold
              </label>
              <div className="mt-2 flex items-center gap-3">
                <Slider
                  value={[emailSettings.auto_send_threshold]}
                  onValueChange={([v]) =>
                    updateEmailSettings("auto_send_threshold", v)
                  }
                  max={100}
                  min={50}
                  step={1}
                />
                <span className="text-sm font-semibold text-blue-600">
                  {emailSettings.auto_send_threshold}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Shared with other tabs. Emails with confidence ≥ this percentage
                can be auto-sent.
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="text-xs text-muted-foreground">
                Last synced:{" "}
                {emailSettings.last_synced_at
                  ? format(
                      new Date(emailSettings.last_synced_at),
                      "MMM d, yyyy h:mm a",
                    )
                  : "Never"}
              </div>
              <div className="flex gap-2">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleSaveEmailSettings}
                  disabled={savingEmailSettings}
                >
                  {savingEmailSettings ? "Saving..." : "Save Settings"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSyncInbox}
                  disabled={syncingInbox || !emailSettings.gmail_connected}
                >
                  {syncingInbox ? "Syncing..." : "Sync Inbox Now"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>Manage response templates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {template.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Used {template.uses} times
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEditingTemplate(template)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground"
                      onClick={() => handleDeleteTemplate(template.id)}
                      aria-label={`Delete ${template.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {templates.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No templates yet. Add one below.
                </p>
              )}
            </div>

            {editingId && (
              <div className="mt-4 border rounded-lg p-4 space-y-3 bg-gray-50">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Edit Template
                </p>
                <div>
                  <label className="text-xs font-medium text-foreground">
                    Template Name
                  </label>
                  <Input
                    className="mt-1"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground">
                    Template Body
                  </label>
                  <textarea
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    rows={6}
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    You can use placeholders like{" "}
                    <code className="font-mono">{`{student_name}`}</code> in the
                    body.
                  </p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEditingTemplate}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={saveEditingTemplate}>
                    Save
                  </Button>
                </div>
              </div>
            )}

            {!editingId && (
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                variant="default"
                onClick={handleAddTemplate}
              >
                Add Template
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Knowledge Base Uploads */}
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Base</CardTitle>
            <CardDescription>
              Track which knowledge base files are currently in use.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center text-sm transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-border bg-muted/40"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDragEnd={handleDragLeave}
            >
              <p className="font-medium">
                Drag and drop files here to update the knowledge base
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JSON, TXT, MD, or PDF files. This is a visual tracker only; file
                content is managed separately.
              </p>
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
              </div>
            </div>

            {uploadError && (
              <p className="text-xs text-red-600">{uploadError}</p>
            )}

            <div className="space-y-2">
              {uploads.length > 0 ? (
                uploads.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-md bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Uploaded{" "}
                        {format(new Date(item.uploadedAt), "MMM d, yyyy h:mm a")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">
                  No recent knowledge base uploads tracked yet.
                </p>
              )}
            </div>

            {uploads.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleClearUploads}
              >
                Clear Upload History
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Advisor Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Advisor Profile</CardTitle>
            <CardDescription>
              This information is shown in signatures and in the app header.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                className="mt-2"
                value={profile.name}
                onChange={updateField("name")}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                className="mt-2"
                value={profile.email}
                onChange={updateField("email")}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Department</label>
              <Input
                className="mt-2"
                value={profile.department}
                onChange={updateField("department")}
              />
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={saveProfile}
              disabled={!profileDirty}
            >
              {profileDirty ? "Update Profile" : "Profile Updated"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}