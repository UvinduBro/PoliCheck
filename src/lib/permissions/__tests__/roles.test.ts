import { describe, expect, it } from "vitest";
import { can, canReadByPublicationStatus, canReadClaimByReviewStatus } from "../roles";

describe("role permission checks", () => {
  it("only researcher+ can create records", () => {
    expect(can.createRecords(undefined)).toBe(false);
    expect(can.createRecords("public")).toBe(false);
    expect(can.createRecords("researcher")).toBe(true);
    expect(can.createRecords("reviewer")).toBe(true);
    expect(can.createRecords("admin")).toBe(true);
  });

  it("only reviewer+ can publish records", () => {
    expect(can.publishRecords("researcher")).toBe(false);
    expect(can.publishRecords("reviewer")).toBe(true);
  });

  it("only admin can manage users or view audit logs", () => {
    expect(can.manageUsers("reviewer")).toBe(false);
    expect(can.manageUsers("admin")).toBe(true);
    expect(can.viewAuditLogs("reviewer")).toBe(false);
    expect(can.viewAuditLogs("admin")).toBe(true);
  });

  it("published content is readable by anyone; drafts require researcher+", () => {
    expect(canReadByPublicationStatus("published", undefined)).toBe(true);
    expect(canReadByPublicationStatus("draft", undefined)).toBe(false);
    expect(canReadByPublicationStatus("draft", "researcher")).toBe(true);
  });

  it("approved claims are public; pending/rejected require researcher+", () => {
    expect(canReadClaimByReviewStatus("approved", undefined)).toBe(true);
    expect(canReadClaimByReviewStatus("pending_review", undefined)).toBe(false);
    expect(canReadClaimByReviewStatus("pending_review", "reviewer")).toBe(true);
  });
});
