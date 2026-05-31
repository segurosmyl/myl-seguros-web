# MILI ARCHITECTURE DECISIONS (ADR)

## ADR-001

Phase 1 orchestration = n8n
Rationale:

* fast delivery
* visual workflows
* low-code maintainability

## ADR-002

Primary LLM = Claude Sonnet
Rationale:

* strong reasoning
* commercial dialogue quality

## ADR-003

Frontend deployment = Vercel
Rationale:

* current stack alignment

## ADR-004

Initial data source = Google Sheets
Rationale:

* matches sold scope
* low friction

## ADR-005

Lead escalation = WhatsApp handoff
Rationale:

* operational simplicity

## ADR-006

No avatar in phase 1
Rationale:

* scope containment

## ADR-007

No voice in phase 1
Rationale:

* complexity reduction

## ADR-008

Phase 2 backend migration
Target:

* Node.js
* Postgres
* Redis

## ADR-009

Security model

* API keys backend only
* validation
* logging
* rate limiting

## ADR-010

Memory strategy
Phase 1:

* session memory
* lead persistence

Phase 2:

* persistent customer memory
