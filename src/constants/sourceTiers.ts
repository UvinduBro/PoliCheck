import type { SourceTier, SourceType } from "@/types";

export const SOURCE_TIER_LABELS: Record<SourceTier, string> = {
  1: "Tier 1: Primary & Authoritative",
  2: "Tier 2: Highly Reliable Journalism",
  3: "Tier 3: Secondary Source",
  4: "Tier 4: Low Confidence",
};

export const SOURCE_TIER_DESCRIPTIONS: Record<SourceTier, string> = {
  1: "Court judgments, court orders, official government records, parliament, election authorities, police statements, Attorney General documents, official investigation-agency documents, government gazettes, official biographies.",
  2: "Reuters, BBC, Associated Press, Agence France-Presse, established national newspapers, established investigative journalism organizations.",
  3: "Established magazines, legal databases, academic sources, research organizations.",
  4: "Blogs, anonymous websites, social media, unsourced claims. Must not be used as evidence of criminal guilt.",
};

/** Source types that automatically qualify as Tier 1 (primary/authoritative). */
export const TIER_1_SOURCE_TYPES: SourceType[] = [
  "court_judgment",
  "court_order",
  "government_record",
  "parliamentary_record",
  "police_statement",
  "agency_document",
  "official_biography",
];

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  court_judgment: "Court Judgment",
  court_order: "Court Order",
  government_record: "Government Record",
  parliamentary_record: "Parliamentary Record",
  police_statement: "Police Statement",
  agency_document: "Agency Document",
  official_biography: "Official Biography",
  news_article: "News Article",
  investigative_report: "Investigative Report",
  academic_source: "Academic Source",
  blog: "Blog",
  social_media: "Social Media",
  other: "Other",
};
