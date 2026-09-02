import type { RouteObject } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { HomePage } from "./pages/HomePage";
import { DisclaimerPage } from "./pages/DisclaimerPage";
import { NotFoundPage } from "./pages/NotFoundPage";

import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";
import { AccountPage } from "@/features/auth/AccountPage";
import { RequireRole } from "@/features/auth/RequireRole";

import { PoliticiansListPage } from "@/features/politicians/PoliticiansListPage";
import { PoliticianProfileLayout } from "@/features/politicians/PoliticianProfileLayout";
import { PoliticianFormPage } from "@/features/politicians/PoliticianFormPage";
import { ResearchHomePage } from "@/features/politicians/ResearchHomePage";
import { OverviewTab } from "@/features/politicians/tabs/OverviewTab";
import { BiographyTab } from "@/features/politicians/tabs/BiographyTab";
import { PoliticalHistoryTab } from "@/features/politicians/tabs/PoliticalHistoryTab";
import { LegalStatusTab } from "@/features/politicians/tabs/LegalStatusTab";
import { CasesTab } from "@/features/politicians/tabs/CasesTab";
import { InvestigationsTab } from "@/features/politicians/tabs/InvestigationsTab";
import { TimelineTab } from "@/features/politicians/tabs/TimelineTab";
import { SourcesTab } from "@/features/politicians/tabs/SourcesTab";
import { ReportTab } from "@/features/politicians/tabs/ReportTab";

import { CaseDetailPage } from "@/features/cases/CaseDetailPage";
import { CaseFormPage } from "@/features/cases/CaseFormPage";
import { CasesListPage } from "@/features/cases/CasesListPage";
import { ClaimFormPage } from "@/features/cases/ClaimFormPage";

import { InvestigationFormPage } from "@/features/investigations/InvestigationFormPage";
import { InvestigationsListPage } from "@/features/investigations/InvestigationsListPage";
import { LegalEventFormPage } from "@/features/investigations/LegalEventFormPage";

import { SourceDetailPage } from "@/features/sources/SourceDetailPage";
import { SourceFormPage } from "@/features/sources/SourceFormPage";
import { SourcesListPage } from "@/features/sources/SourcesListPage";

import { ReportPage } from "@/features/reports/ReportPage";
import { ReviewDashboardPage } from "@/features/reviews/ReviewDashboardPage";
import { AdminDashboardPage } from "@/features/admin/AdminDashboardPage";

import { FeatureGate } from "@/features/settings/FeatureGate";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "disclaimer", element: <DisclaimerPage /> },
      { path: "search", element: <PoliticiansListPage /> },
      { path: "politicians", element: <PoliticiansListPage /> },
      {
        path: "politicians/new",
        element: (
          <RequireRole minimum="researcher">
            <PoliticianFormPage />
          </RequireRole>
        ),
      },
      {
        path: "politicians/:politicianId/edit",
        element: (
          <RequireRole minimum="researcher">
            <PoliticianFormPage />
          </RequireRole>
        ),
      },
      {
        path: "politicians/:politicianId",
        element: <PoliticianProfileLayout />,
        children: [
          { index: true, element: <OverviewTab /> },
          { path: "overview", element: <OverviewTab /> },
          { path: "biography", element: <FeatureGate flag="biography"><BiographyTab /></FeatureGate> },
          { path: "political-history", element: <FeatureGate flag="politicalHistory"><PoliticalHistoryTab /></FeatureGate> },
          { path: "legal-status", element: <LegalStatusTab /> },
          { path: "criminal-cases", element: <CasesTab caseType="criminal" /> },
          { path: "civil-cases", element: <CasesTab caseType="civil" /> },
          { path: "investigations", element: <FeatureGate flag="investigations"><InvestigationsTab /></FeatureGate> },
          { path: "timeline", element: <FeatureGate flag="timeline"><TimelineTab /></FeatureGate> },
          { path: "sources", element: <FeatureGate flag="sources"><SourcesTab /></FeatureGate> },
          { path: "report", element: <FeatureGate flag="reports"><ReportTab /></FeatureGate> },
        ],
      },

      { path: "cases", element: <CasesListPage /> },
      { path: "cases/:caseId", element: <CaseDetailPage /> },
      {
        path: "cases/new",
        element: (
          <RequireRole minimum="researcher">
            <CaseFormPage />
          </RequireRole>
        ),
      },
      {
        path: "claims/new",
        element: (
          <RequireRole minimum="researcher">
            <ClaimFormPage />
          </RequireRole>
        ),
      },
      { path: "investigations", element: <FeatureGate flag="investigations"><InvestigationsListPage /></FeatureGate> },
      {
        path: "investigations/new",
        element: (
          <FeatureGate flag="investigations">
            <RequireRole minimum="researcher">
              <InvestigationFormPage />
            </RequireRole>
          </FeatureGate>
        ),
      },
      {
        path: "legal-events/new",
        element: (
          <FeatureGate flag="timeline">
            <RequireRole minimum="researcher">
              <LegalEventFormPage />
            </RequireRole>
          </FeatureGate>
        ),
      },

      { path: "sources", element: <FeatureGate flag="sources"><SourcesListPage /></FeatureGate> },
      { path: "sources/:sourceId", element: <FeatureGate flag="sources"><SourceDetailPage /></FeatureGate> },
      {
        path: "sources/new",
        element: (
          <FeatureGate flag="sources">
            <RequireRole minimum="researcher">
              <SourceFormPage />
            </RequireRole>
          </FeatureGate>
        ),
      },

      { path: "reports/:reportId", element: <FeatureGate flag="reports"><ReportPage /></FeatureGate> },

      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "account", element: <AccountPage /> },

      {
        element: <WorkspaceLayout />,
        children: [
          {
            path: "research",
            element: (
              <RequireRole minimum="researcher">
                <ResearchHomePage />
              </RequireRole>
            ),
          },
          {
            path: "review",
            element: (
              <RequireRole minimum="reviewer">
                <ReviewDashboardPage />
              </RequireRole>
            ),
          },
        ],
      },
      {
        path: "admin",
        element: (
          <RequireRole minimum="admin">
            <AdminDashboardPage />
          </RequireRole>
        ),
      },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
