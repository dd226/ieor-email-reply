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
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

// ---------------------
// Auto-send threshold
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
// ---------------------
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
      "Hello {student_name},\n\nTo withdraw from a course after the add/drop period, please submit the Course Withdrawal form located in the Records and Registration section of the student portal. The form requires signatures from both you and the course instructor. Once approved, the Registrar will record a grade of 'W'.\n\nBest,\nAcademic Advising Team",
    uses: 24,
  },
  {
    id: "financial-aid-inquiry",
    name: "Financial Aid Inquiry",
    body:
      "Hello {student_name},\n\nFor questions about your financial aid status, please visit the Financial Aid Status page to review outstanding checklist items, disbursement dates, and award details. If something looks incorrect, you can contact the Financial Aid Office at finaid@university.edu.\n\nBest,\nAcademic Advising Team",
    uses: 18,
  },
  {
    id: "grade-appeal",
    name: "Grade Appeal",
    body:
      "Hello {student_name},\n\nIf you believe there is an error with your final grade, we first recommend contacting your instructor to discuss the grading breakdown. If further review is needed, you may follow the department’s formal grade appeal process, which is outlined on the Academic Policies page.\n\nBest,\nAcademic Advising Team",
    uses: 12,
  },
];

export default function SettingsTab() {
  // Threshold state
  const [thresholdPct, setThresholdPct] = useState(
    DEFAULT_CONFIDENCE_THRESHOLD_PCT,
  );
  const [savedPct, setSavedPct] = useState<number | null>(null);

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

  // ---------------------
  // Load everything on mount
  // ---------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load threshold
    const stored = window.localStorage.getItem(CONFIDENCE_THRESHOLD_KEY);
    if (stored) {
      const value = Number(stored);
      if (!Number.isNaN(value)) {
        setThresholdPct(value);
        setSavedPct(value);
      }
    }

    // Load advisor profile
    const storedProfile = window.localStorage.getItem(PROFILE_KEY);
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile) as Partial<AdvisorProfile>;
        setProfile({
          name: parsed.name ?? DEFAULT_PROFILE.name,
          email: parsed.email ?? DEFAULT_PROFILE.email,
          department: parsed.department ?? DEFAULT_PROFILE.department,
        });
      } catch {
        console.error("Invalid stored advisor profile");
      }
    }

    // Load knowledge base uploads
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
  }, []);

  // ---------------------
  // Threshold interactions
  // ---------------------
  function handleSliderChange(value: number[]) {
    if (!value || value.length === 0) return;
    setThresholdPct(value[0]);
  }

  function handleSaveThreshold() {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CONFIDENCE_THRESHOLD_KEY, String(thresholdPct));
    setSavedPct(thresholdPct);
  }

  const hasUnsavedChanges =
    savedPct === null
      ? thresholdPct !== DEFAULT_CONFIDENCE_THRESHOLD_PCT
      : savedPct !== thresholdPct;

  // ---------------------
  // Profile interactions
  // ---------------------
  function updateField(field: keyof AdvisorProfile) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfile({ ...profile, [field]: e.target.value });
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
  function persistUploads(newUploads: UploadItem[]) {
    setUploads(newUploads);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(KB_UPLOADS_KEY, JSON.stringify(newUploads));
    }
  }

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    const allowedExtensions = ["pdf", "docx", "txt"];
    const maxSizeBytes = 10 * 1024 * 1024;
    const now = new Date();

    const newItems: UploadItem[] = [];
    let errorMsg: string | null = null;

    Array.from(fileList).forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!allowedExtensions.includes(ext)) {
        errorMsg = "Only PDF, DOCX, and TXT files are allowed.";
        return;
      }
      if (file.size > maxSizeBytes) {
        errorMsg = "Each file must be 10MB or smaller.";
        return;
      }

      newItems.push({
        id: `${now.getTime()}-${file.name}-${Math.random()
          .toString(36)
          .slice(2)}`,
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
    if (!isDragging) setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleClickDropzone() {
    fileInputRef.current?.click();
  }

  function handleDeleteUpload(id: string) {
    const next = uploads.filter((u) => u.id !== id);
    persistUploads(next);
  }

  // ---------------------
  // Email Templates interactions
  // ---------------------
  function persistTemplates(next: EmailTemplate[]) {
    setTemplates(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TEMPLATES_KEY, JSON.stringify(next));
    }
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

    const trimmedName = editName.trim();
    if (!trimmedName) return;

    const next = templates.map((t) =>
      t.id === editingId ? { ...t, name: trimmedName, body: editBody } : t,
    );
    persistTemplates(next);
    cancelEditingTemplate();
  }

  function handleAddTemplate() {
    const id = `template-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;
    const newTemplate: EmailTemplate = {
      id,
      name: "New template",
      body: "",
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">
          Configure your email advising system
        </p>
      </div>

      {/* Main settings grid: 2x2 on md+ */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Auto-Send Threshold */}
        <Card>
          <CardHeader>
            <CardTitle>Auto-Send Threshold</CardTitle>
            <CardDescription>
              Emails with confidence above this level will be treated as high
              confidence.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-foreground">
                  Confidence Threshold
                </label>
                <span className="text-2xl font-bold text-blue-600">
                  {thresholdPct}%
                </span>
              </div>
              <Slider
                value={[thresholdPct]}
                onValueChange={handleSliderChange}
                max={100}
                min={50}
                step={1}
              />
              <p className="text-xs text-muted-foreground mt-2">
                High Confidence = ≥ {thresholdPct}%. Low Confidence =
                &nbsp;&lt; {thresholdPct}%.
              </p>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSaveThreshold}
              disabled={!hasUnsavedChanges}
            >
              {hasUnsavedChanges ? "Save Threshold" : "Threshold Saved"}
            </Button>
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
                      {template.uses} uses this month
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
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
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEditingTemplate}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={saveEditingTemplate}>
                    Save Template
                  </Button>
                </div>
              </div>
            )}

            <Button
              className="bg-blue-600 hover:bg-blue-700 w-full"
              onClick={handleAddTemplate}
            >
              Add New Template
            </Button>
          </CardContent>
        </Card>

        {/* Knowledge Base */}
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Base</CardTitle>
            <CardDescription>Upload policies and documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Hidden input */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={(e) => handleFilesSelected(e.target.files)}
            />

            {/* Dropzone */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-blue-400 bg-blue-50/60"
                  : "border-border hover:bg-gray-50"
              }`}
              onClick={handleClickDropzone}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <p className="text-sm font-medium text-foreground">
                Drop files here or click to upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, DOCX, TXT up to 10MB
              </p>
            </div>

            {uploadError && (
              <p className="text-xs text-red-600">{uploadError}</p>
            )}

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Recent Uploads ({uploads.length})
              </p>

              {uploads.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No files uploaded yet.
                </p>
              )}

              {uploads.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <div className="text-xs text-foreground truncate">
                    {file.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(file.uploadedAt), "MMM d, yyyy")}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground"
                      onClick={() => handleDeleteUpload(file.id)}
                      aria-label={`Delete ${file.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your advisor profile</CardDescription>
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