import type { BeepStatus } from "@/lib/api";

export const STATUS_DOT: Record<BeepStatus, string> = {
  closed: "status-dot",
  open: "status-dot status-dot--gray",
  declined: "status-dot status-dot--red",
  acknowledged: "status-dot status-dot--gray",
};

export const STATUS_PILL: Record<BeepStatus, string> = {
  closed: "bg-primary-container text-on-primary-container",
  open: "bg-surface-container text-on-surface-variant border border-outline-variant",
  declined: "bg-error-container text-on-error-container",
  acknowledged: "bg-surface-container-low text-on-surface-variant border border-outline-variant",
};

export const STATUS_LABEL: Record<BeepStatus, string> = {
  closed: "REPLIED",
  open: "QUEUED",
  declined: "DECLINED",
  acknowledged: "ACKED",
};
