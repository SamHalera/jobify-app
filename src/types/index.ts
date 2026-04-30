import type {
  Application,
  Company,
  RecruitmentStage,
  Document,
  ApplicationDocument,
  ApplicationStatus,
  StageType,
  StageOutcome,
  DocumentType,
} from "@/generated/prisma/client";

export type {
  Application,
  Company,
  RecruitmentStage,
  Document,
  ApplicationDocument,
  ApplicationStatus,
  StageType,
  StageOutcome,
  DocumentType,
};

export type ApplicationWithRelations = Application & {
  company: Company;
  stages: RecruitmentStage[];
  documents: (ApplicationDocument & { document: Document })[];
};

export type ApplicationWithCount = Application & {
  company: Company;
  _count: { stages: number; documents: number };
};

export type CompanyWithCount = Company & {
  _count: { applications: number };
};

export type DocumentWithCount = Document & {
  _count: { applications: number };
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  WISHLIST: "Liste de souhaits",
  APPLIED: "Candidature envoyée",
  IN_PROGRESS: "En cours",
  OFFER: "Offre reçue",
  ACCEPTED: "Accepté",
  REJECTED: "Refusé",
  WITHDRAWN: "Retiré",
  GHOSTED: "Ghosté",
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  WISHLIST:    "bg-slate-100   text-slate-700   ring-1 ring-slate-300/70",
  APPLIED:     "bg-blue-100    text-blue-700    ring-1 ring-blue-300/70",
  IN_PROGRESS: "bg-amber-100   text-amber-700   ring-1 ring-amber-300/70",
  OFFER:       "bg-violet-100  text-violet-700  ring-1 ring-violet-300/70",
  ACCEPTED:    "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300/70",
  REJECTED:    "bg-red-100     text-red-700     ring-1 ring-red-300/70",
  WITHDRAWN:   "bg-orange-100  text-orange-700  ring-1 ring-orange-300/70",
  GHOSTED:     "bg-zinc-100    text-zinc-600    ring-1 ring-zinc-300/70",
};

export const STATUS_DOT: Record<ApplicationStatus, string> = {
  WISHLIST:    "bg-slate-400",
  APPLIED:     "bg-blue-500",
  IN_PROGRESS: "bg-amber-500",
  OFFER:       "bg-violet-500",
  ACCEPTED:    "bg-emerald-500",
  REJECTED:    "bg-red-500",
  WITHDRAWN:   "bg-orange-500",
  GHOSTED:     "bg-zinc-400",
};

export const STAGE_TYPE_LABELS: Record<StageType, string> = {
  SCREENING: "Présélection",
  TECHNICAL_TEST: "Test technique",
  INTERVIEW: "Entretien",
  CASE_STUDY: "Étude de cas",
  REFERENCE_CHECK: "Vérification références",
  OFFER_NEGOTIATION: "Négociation offre",
  OTHER: "Autre",
};

export const STAGE_OUTCOME_LABELS: Record<StageOutcome, string> = {
  PENDING: "En attente",
  PASSED: "Réussi",
  FAILED: "Échoué",
  CANCELLED: "Annulé",
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  CV: "CV",
  COVER_LETTER: "Lettre de motivation",
  OTHER: "Autre",
};
