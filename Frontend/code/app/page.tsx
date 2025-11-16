"use client";

import { useState } from "react";
import SidebarNav from "@/components/sidebar-nav";
import HeaderTop from "@/components/header-top";
import MetricsCards from "@/components/metrics-cards";
import EmailsTab from "@/components/emails-tab";
import AnalyticsTab from "@/components/analytics-tab";
import SettingsTab from "@/components/settings-tab";

export default function Page() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <HeaderTop />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-8 py-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="mt-2 text-muted-foreground">
                  High-level overview of student email volume and advisor workload.
                </p>
              </div>
              <MetricsCards />
              <p className="text-xs text-muted-foreground">
                For detailed email review and approvals, use the Emails tab.
              </p>
            </div>
          )}

          {/* Emails Tab */}
          {activeTab === "emails" && <EmailsTab />}

          {/* Analytics Tab */}
          {activeTab === "analytics" && <AnalyticsTab />}

          {/* Settings Tab */}
          {activeTab === "settings" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}