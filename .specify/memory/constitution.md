<!--
Sync Impact Report
- Version change: N/A -> 1.0.0
- Modified principles: Defined new set (Clean Code Discipline; Consistent User Experience; Performance & Efficiency)
- Added sections: Core Principles, Cross-Cutting Standards, Development Workflow, Governance
- Removed sections: None
- Templates requiring updates: .specify/templates/plan-template.md ✅, .specify/templates/spec-template.md ✅, .specify/templates/tasks-template.md ✅
- Follow-up TODOs: None
-->

# Shopee Vendor Constitution

## Core Principles

### I. Clean Code Discipline
Code must remain legible, maintainable, and test-backed. Every change requires
linting, formatting, and focused tests that demonstrate intent and guard
regressions. Avoid incidental complexity: prefer small, composable modules,
remove dead code promptly, and justify new dependencies with documented
benefits.

### II. Consistent User Experience
User-facing flows must align with the shared design system and copy standards:
reuse approved components/tokens, cover all states (loading, empty, error, and
success), and document interaction patterns. Accessibility is non-negotiable:
meet WCAG 2.1 AA, support keyboard and screen readers, and provide clear focus
handling. UX acceptance criteria must be written alongside functional
requirements.

### III. Performance & Efficiency
Define performance budgets before implementation and validate them with
measurements. Defaults: backend endpoints target p95 <300ms under expected
load, interactive UI responses target <100ms for micro-interactions and <2s to
first meaningful render on baseline devices. Instrument code with metrics or
profiling where relevant, and treat regressions as blockers unless explicitly
justified.

## Cross-Cutting Standards

- Definition of Done includes: passing linters/formatters, unit coverage for new
  logic, UX acceptance checks, and performance budget verification.
- Observability: emit actionable logs/metrics for new features sufficient to
  confirm UX and performance expectations; avoid noisy logs without ownership.
- Security and privacy: no secrets in source control; validate input and escape
  output for user-facing surfaces; document data retention or storage decisions.
- Documentation: record decisions and trade-offs in feature plans/specs; note
  any waivers granted for UX or performance budgets.

## Development Workflow

- Planning: every feature plan must declare UX acceptance cases and a measurable
  performance budget with the load assumptions used.
- Implementation: favor incremental delivery; keep PRs scoped to a single
  concern and include tests plus screenshots or recordings for UX changes.
- Review: reviewers enforce principle compliance; deviations require written
  waivers with expiry and follow-up tasks.
- Verification: performance checks run in environments that approximate expected
  load/device profiles; UX and accessibility validations are part of review.

## Governance

- Applicability: this constitution supersedes other process docs when conflicts
  arise; exceptions require a recorded waiver with owner and expiry date.
- Amendments: propose via PR referencing rationale and downstream impacts;
  requires approval from repo maintainers; document version bump and effective
  date.
- Versioning: semantic versioning—major for breaking/removing principles,
  minor for added or materially expanded guidance, patch for clarifications.
- Compliance: feature plans/specs/tasks must show alignment with principles;
  periodic audits ensure waivers are cleared or renewed with justification.

**Version**: 1.0.0 | **Ratified**: 2025-12-06 | **Last Amended**: 2025-12-06
