import type { RouteObject } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { HomePage } from "./pages/HomePage";
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
import { ClaimFormPage } from "@/features/cases/ClaimFormPage";

import { InvestigationFormPage } from "@/features/investigations/InvestigationFormPage";
import { LegalEventFormPage } from "@/features/investigations/LegalEventFormPage";

import { SourceDetailPage } from "@/features/sources/SourceDetailPage";
import { SourceFormPage } from "@/features/sources/SourceFormPage";

import { ReportPage } from "@/features/reports/ReportPage";
import { ReviewDashboardPage } from "@/features/reviews/ReviewDashboardPage";
import { AdminDashboardPage } from "@/features/admin/AdminDashboardPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
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
          { path: "biography", element: <BiographyTab /> },
          { path: "political-history", element: <PoliticalHistoryTab /> },
          { path: "legal-status", element: <LegalStatusTab /> },
          { path: "criminal-cases", element: <CasesTab caseType="criminal" /> },
          { path: "civil-cases", element: <CasesTab caseType="civil" /> },
          { path: "investigations", element: <InvestigationsTab /> },
          { path: "timeline", element: <TimelineTab /> },
          { path: "sources", element: <SourcesTab /> },
          { path: "report", element: <ReportTab /> },
        ],
      },

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
      {
        path: "investigations/new",
        element: (
          <RequireRole minimum="researcher">
            <InvestigationFormPage />
          </RequireRole>
        ),
      },
      {
        path: "legal-events/new",
        element: (
          <RequireRole minimum="researcher">
            <LegalEventFormPage />
          </RequireRole>
        ),
      },

      { path: "sources/:sourceId", element: <SourceDetailPage /> },
      {
        path: "sources/new",
        element: (
          <RequireRole minimum="researcher">
            <SourceFormPage />
          </RequireRole>
        ),
      },

      { path: "reports/:reportId", element: <ReportPage /> },

      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "account", element: <AccountPage /> },

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
