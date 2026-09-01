import type { Timestamp } from "firebase/firestore";

export type UserRole = "public" | "researcher" | "reviewer" | "admin";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  organization?: string;
  photoURL?: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type PublicationStatus = "draft" | "review" | "published" | "archived";
export type IdentityConfidence = "high" | "medium" | "low" | "unresolved";

export interface Politician {
  id: string;
  fullName: string;
  alternativeNames: string[];
  localLanguageNames: string[];
  nicknames: string[];
  country: string;
  nationality?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  profession?: string;
  education?: string[];
  politicalParty?: string;
  currentPosition?: string;
  constituency?: string;
  biography?: string;
  identityConfidence: IdentityConfidence;
  publicationStatus: PublicationStatus;
  createdBy: string;
  reviewedBy?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastResearchedAt?: Timestamp;
  researchCutoff?: Timestamp;
}

export interface PoliticalPosition {
  id: string;
  politicianId: string;
  title: string;
  institution?: string;
  party?: string;
  constituency?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  sourceIds: string[];
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CaseType =
  | "criminal"
  | "civil"
  | "constitutional"
  | "fundamental_rights"
  | "administrative"
  | "election"
  | "corruption"
  | "financial"
  | "other";

export type CaseStage =
  | "allegation_only"
  | "complaint"
  | "investigation"
  | "arrest"
  | "remand"
  | "bail"
  | "indictment"
  | "trial"
  | "convicted"
  | "acquitted"
  | "dismissed"
  | "withdrawn"
  | "settled"
  | "appeal_pending"
  | "appeal_successful"
  | "appeal_unsuccessful"
  | "completed"
  | "unknown";

export type CasePartyRole =
  | "claimant"
  | "plaintiff"
  | "defendant"
  | "respondent"
  | "appellant"
  | "appellee"
  | "accused"
  | "other";

export interface CaseParty {
  name: string;
  role: CasePartyRole;
}

export interface LegalCase {
  id: string;
  politicianIds: string[];
  caseName: string;
  caseNumber?: string;
  court?: string;
  jurisdiction?: string;
  country: string;
  caseType: CaseType;
  parties: CaseParty[];
  dateFiled?: string;
  allegations?: string;
  charges?: string[];
  legalStage: CaseStage;
  currentStatus: string;
  latestDevelopment?: string;
  nextKnownStep?: string;
  arrestStatus?: "arrested" | "not_arrested" | "unknown";
  remandStatus?: "remanded" | "not_remanded" | "unknown";
  bailStatus?: "granted" | "denied" | "not_applicable" | "unknown";
  convictionStatus?: "convicted" | "not_convicted" | "overturned" | "unknown";
  acquittalStatus?: "acquitted" | "not_acquitted" | "unknown";
  appealStatus?: "pending" | "successful" | "unsuccessful" | "none" | "unknown";
  sourceIds: string[];
  publicationStatus: PublicationStatus;
  createdBy: string;
  reviewedBy?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type InvestigationType =
  | "corruption"
  | "financial"
  | "police"
  | "tax"
  | "election"
  | "other";

export interface Investigation {
  id: string;
  politicianIds: string[];
  agency: string;
  investigationType: InvestigationType;
  subject?: string;
  startDate?: string;
  currentStatus: "open" | "closed" | "referred" | "unknown";
  description?: string;
  latestDevelopment?: string;
  sourceIds: string[];
  publicationStatus: PublicationStatus;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type LegalEventType =
  | "complaint"
  | "investigation"
  | "arrest"
  | "detention"
  | "remand"
  | "bail"
  | "indictment"
  | "hearing"
  | "judgment"
  | "conviction"
  | "acquittal"
  | "dismissal"
  | "appeal"
  | "release"
  | "warrant"
  | "travel_restriction"
  | "other";

export interface LegalEvent {
  id: string;
  politicianIds: string[];
  caseId?: string;
  date: string;
  eventType: LegalEventType;
  title: string;
  description: string;
  legalSignificance?: string;
  sourceIds: string[];
  publicationStatus: PublicationStatus;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ClaimClassification =
  | "verified_fact"
  | "court_finding"
  | "conviction"
  | "acquittal"
  | "formal_allegation"
  | "ongoing_investigation"
  | "media_report"
  | "political_claim"
  | "unverified_claim";

export type ReviewStatus = "draft" | "pending_review" | "approved" | "rejected";

export interface Claim {
  id: string;
  politicianId: string;
  caseId?: string;
  text: string;
  classification: ClaimClassification;
  claimant?: string;
  response?: string;
  currentStatus?: string;
  sourceIds: string[];
  confidence: "high" | "medium" | "low";
  reviewStatus: ReviewStatus;
  createdBy: string;
  reviewedBy?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type SourceTier = 1 | 2 | 3 | 4;

export type SourceType =
  | "court_judgment"
  | "court_order"
  | "government_record"
  | "parliamentary_record"
  | "police_statement"
  | "agency_document"
  | "official_biography"
  | "news_article"
  | "investigative_report"
  | "academic_source"
  | "blog"
  | "social_media"
  | "other";

export type VerificationStatus =
  | "unverified"
  | "partially_verified"
  | "verified"
  | "disputed";

export interface Source {
  id: string;
  title: string;
  publisher: string;
  sourceType: SourceType;
  tier: SourceTier;
  url: string;
  archiveUrl?: string;
  publicationDate?: string;
  documentDate?: string;
  accessedAt: Timestamp;
  author?: string;
  language?: string;
  summary?: string;
  filePath?: string;
  verificationStatus: VerificationStatus;
  notes?: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CorrectionRequestStatus = "open" | "resolved" | "dismissed";

/** Public "report an error" submissions (spec section 17) — reviewed the same way as any other draft content. */
export interface CorrectionRequest {
  id: string;
  politicianId: string;
  description: string;
  submittedByEmail?: string;
  submittedByUid?: string;
  status: CorrectionRequestStatus;
  reviewedBy?: string;
  resolutionNotes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ConfidenceLevel = "high" | "medium" | "low";

export interface ResearchReport {
  id: string;
  politicianId: string;
  title: string;
  researchDate: string;
  researchCutoff: Timestamp;
  contentMarkdown: string;
  confidenceLevel: ConfidenceLevel;
  limitations?: string;
  status: PublicationStatus;
  createdBy: string;
  reviewedBy?: string;
  publishedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  createdAt: Timestamp;
  ipHash?: string;
}
