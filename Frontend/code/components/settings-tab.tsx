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
import { useEffect, useState } from "react";

const CONFIDENCE_THRESHOLD_KEY = "confidenceThresholdPct";
const DEFAULT_CONFIDENCE_THRESHOLD_PCT = 92; // starting value on fresh load

export default function SettingsTab() {
  const [thresholdPct, setThresholdPct] = useState<number>(
    DEFAULT_CONFIDENCE_THRESHOLD_PCT,
  );
  const [savedPct, setSavedPct] = useState<number | null>(null);

  // Load saved threshold (if any) on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(CONFIDENCE_THRESHOLD_KEY);
    if (!stored) return;

    const value = Number(stored);
    if (!Number.isNaN(value) && value >= 0 && value <= 100) {
      setThresholdPct(value);
      setSavedPct(value);
    }
  }, []);

  function handleSliderChange(value: number[]) {
    if (!value || value.length === 0) return;
    setThresholdPct(value[0]);
  }

  function handleSaveThreshold() {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      CONFIDENCE_THRESHOLD_KEY,
      String(thresholdPct),
    );
    setSavedPct(thresholdPct);
  }

  const hasUnsavedChanges =
    savedPct === null ? thresholdPct !== DEFAULT_CONFIDENCE_THRESHOLD_PCT : savedPct !== thresholdPct;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">
          Configure your email advising system
        </p>
      </div>

      {/* Auto-Send Threshold */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Send Threshold</CardTitle>
          <CardDescription>
            Emails with confidence at or above this level will be treated as
            high confidence. The Emails tab uses this threshold for the High /
            Low Confidence filters.
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
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Recommended: 90–95% for safe auto-sending. High Confidence ={" "}
              <span className="font-mono">&ge; {thresholdPct}%</span>, Low
              Confidence ={" "}
              <span className="font-mono">&lt; {thresholdPct}%</span>.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This threshold is stored in your browser and read by the Emails
              tab to separate High / Low Confidence.
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
          <CardDescription>
            Manage response templates for common student inquiries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {[
              { name: "Course Withdrawal", usage: 24 },
              { name: "Financial Aid Inquiry", usage: 18 },
              { name: "Grade Appeal", usage: 12 },
              { name: "Transcript Request", usage: 31 },
              { name: "Add/Drop Process", usage: 16 },
            ].map((template) => (
              <div
                key={template.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {template.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {template.usage} uses this month
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </div>
            ))}
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 w-full">
            Add New Template
          </Button>
        </CardContent>
      </Card>

      {/* Knowledge Base */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base</CardTitle>
          <CardDescription>
            Upload policies, forms, and documents for the AI to reference
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
            <p className="text-sm font-medium text-foreground">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, DOCX, TXT up to 10MB each
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Recent Uploads (3)
            </p>
            {[
              { name: "Academic-Policies.pdf", date: "Nov 2, 2024" },
              { name: "Financial-Aid-Guide.docx", date: "Oct 28, 2024" },
              { name: "Course-Catalog-2024.pdf", date: "Oct 15, 2024" },
            ].map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="text-xs text-foreground">{file.name}</div>
                <div className="text-xs text-muted-foreground">
                  {file.date}
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
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input defaultValue="Dr. Sarah Smith" className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input defaultValue="sarah.smith@university.edu" className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">
              Department
            </label>
            <Input
              defaultValue="Academic Advising Center"
              className="mt-2"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}