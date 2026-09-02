import { z } from "zod";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}(-\d{2})?$/, "Use YYYY-MM-DD or YYYY-MM format")
  .optional()
  .or(z.literal(""));

const url = z.string().url("Enter a valid URL");

export const politicianSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    alternativeNames: z.array(z.string()).default([]),
    localLanguageNames: z.array(z.string()).default([]),
    nicknames: z.array(z.string()).default([]),
    country: z.string().min(2, "Country is required"),
    nationality: z.string().optional(),
    dateOfBirth: isoDate,
    placeOfBirth: z.string().optional(),
    profession: z.string().optional(),
    education: z.array(z.string()).default([]),
    politicalParty: z.string().optional(),
    currentPosition: z.string().optional(),
    constituency: z.string().optional(),
    biography: z.string().optional(),
    identityConfidence: z.enum(["high", "medium", "low", "unresolved"]),
    custodyStatus: z.enum(["jailed", "bailed", "not_in_custody"]).default("not_in_custody"),
    custodySince: isoDate,
    bailedSince: isoDate,
    // A blank number input arrives as "" — coerce that to undefined rather than 0, so an
    // unspecified sentence isn't mistaken for a determined zero-year sentence.
    sentenceYears: z.preprocess(
      (v) => (v === "" || v === undefined || v === null ? undefined : v),
      z.coerce.number().int().min(0).max(100).optional(),
    ),
    custodySourceLink: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  })
  .refine((data) => data.custodyStatus === "not_in_custody" || Boolean(data.custodySince), {
    message: "Provide the date",
    path: ["custodySince"],
  })
  .refine((data) => data.custodyStatus === "not_in_custody" || Boolean(data.custodySourceLink), {
    message: "Provide a source link",
    path: ["custodySourceLink"],
  });
export type PoliticianFormValues = z.infer<typeof politicianSchema>;

export const sourceSchema = z.object({
  title: z.string().min(2, "Title is required"),
  publisher: z.string().min(1, "Publisher is required"),
  sourceType: z.enum([
    "court_judgment",
    "court_order",
    "government_record",
    "parliamentary_record",
    "police_statement",
    "agency_document",
    "official_biography",
    "news_article",
    "investigative_report",
    "academic_source",
    "blog",
    "social_media",
    "other",
  ]),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  url,
  archiveUrl: z.string().url().optional().or(z.literal("")),
  publicationDate: isoDate,
  documentDate: isoDate,
  author: z.string().optional(),
  language: z.string().optional(),
  summary: z.string().optional(),
  verificationStatus: z.enum([
    "unverified",
    "partially_verified",
    "verified",
    "disputed",
  ]),
  notes: z.string().optional(),
});
export type SourceFormValues = z.infer<typeof sourceSchema>;

export const legalCaseSchema = z
  .object({
    politicianIds: z.array(z.string()).min(1, "At least one politician is required"),
    caseName: z.string().min(2, "Case name is required"),
    caseNumber: z.string().optional(),
    court: z.string().optional(),
    jurisdiction: z.string().optional(),
    country: z.string().min(2, "Country is required"),
    caseType: z.enum([
      "criminal",
      "civil",
      "constitutional",
      "fundamental_rights",
      "administrative",
      "election",
      "corruption",
      "financial",
      "other",
    ]),
    dateFiled: isoDate,
    allegations: z.string().optional(),
    charges: z.array(z.string()).default([]),
    legalStage: z.enum([
      "allegation_only",
      "complaint",
      "investigation",
      "arrest",
      "remand",
      "bail",
      "indictment",
      "trial",
      "convicted",
      "acquitted",
      "dismissed",
      "withdrawn",
      "settled",
      "appeal_pending",
      "appeal_successful",
      "appeal_unsuccessful",
      "completed",
      "unknown",
    ]),
    currentStatus: z.string().min(2, "Current status summary is required"),
    latestDevelopment: z.string().optional(),
    nextKnownStep: z.string().optional(),
    // At least one of sourceIds (picked from the Sources library) or sourceLinks (plain URLs,
    // used when the Sources subsystem is disabled) is required — see the refine below.
    sourceIds: z.array(z.string()).default([]),
    sourceLinks: z.array(z.string().url("Enter valid URLs")).default([]),
  })
  .refine((data) => data.sourceIds.length > 0 || data.sourceLinks.length > 0, {
    message: "At least one source (from the library, or a source link) is required",
    path: ["sourceLinks"],
  });
export type LegalCaseFormValues = z.infer<typeof legalCaseSchema>;

export const claimSchema = z
  .object({
    politicianId: z.string().min(1),
    caseId: z.string().optional(),
    text: z.string().min(5, "Claim text is required"),
    classification: z.enum([
      "verified_fact",
      "court_finding",
      "conviction",
      "acquittal",
      "formal_allegation",
      "ongoing_investigation",
      "media_report",
      "political_claim",
      "unverified_claim",
    ]),
    claimant: z.string().optional(),
    response: z.string().optional(),
    currentStatus: z.string().optional(),
    sourceIds: z.array(z.string()).default([]),
    sourceLinks: z.array(z.string().url("Enter valid URLs")).default([]),
    confidence: z.enum(["high", "medium", "low"]),
  })
  .refine((data) => data.sourceIds.length > 0 || data.sourceLinks.length > 0, {
    message: "At least one source (from the library, or a source link) is required",
    path: ["sourceLinks"],
  });
export type ClaimFormValues = z.infer<typeof claimSchema>;

export const legalEventSchema = z.object({
  politicianIds: z.array(z.string()).min(1),
  caseId: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  eventType: z.enum([
    "complaint",
    "investigation",
    "arrest",
    "detention",
    "remand",
    "bail",
    "indictment",
    "hearing",
    "judgment",
    "conviction",
    "acquittal",
    "dismissal",
    "appeal",
    "release",
    "warrant",
    "travel_restriction",
    "other",
  ]),
  title: z.string().min(2),
  description: z.string().min(2),
  legalSignificance: z.string().optional(),
  sourceIds: z.array(z.string()).min(1, "At least one source is required"),
});
export type LegalEventFormValues = z.infer<typeof legalEventSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  displayName: z.string().min(2, "Name is required"),
  email: z.string().email(),
  password: z.string().min(8, "Minimum 8 characters"),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;
