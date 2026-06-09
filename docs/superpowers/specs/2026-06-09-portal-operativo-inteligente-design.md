# Portal Operativo Inteligente M&L — Technical Specification

**Date:** 2026-06-09
**Version:** 1.0
**Status:** Approved for implementation planning
**Scope:** Phase 2 — Internal Operations Only

---

## 1. Executive Summary

The Portal Operativo Inteligente M&L (POI) is a private internal web application that centralizes all operational activity of Consultores M&L Seguros into a single environment. It replaces a fragmented landscape of Google Sheets, email notifications, n8n workflows, and disconnected data sources with a unified Human + AI Operations Platform.

Phase 2 delivers internal operations exclusively. Customer self-service, policyholder authentication, and client-facing document management are explicitly out of scope and reserved for future phases.

The Platform is designed from day one to treat AI agents — Myli, and future Marketing Bot and Assistant Bot — as first-class operational actors alongside human users, not as external integrations.

---

## 2. Project Scope

### In Scope — Phase 2

- Operations Dashboard (KPIs, activity feed, alerts)
- Lead Management (capture, tracking, follow-up)
- Product & Catalog Management (categories, subcategories, products, carriers)
- Policy Management (manual entry, status tracking)
- Myli Administration (conversation history, consent records, metrics, prompt management)
- AI Workspace (prompt library, content generation)
- User and AI Agent management (roles, permissions, agent registration)

### Out of Scope — Phase 2

- Customer self-service portal
- Policyholder login or authentication
- Customer document management
- Public-facing features of any kind
- WhatsApp Business API integration (Phase 3)
- Marketing Bot and Assistant Bot runtime (Phase 3)
- Calendar integration (Phase 3)
- Internal Knowledge Base (Phase 3)

### Relationship to Existing Systems

| System | Relationship in Phase 2 |
|---|---|
| MYL-Seguros-Web (website) | Source of leads via contact form + Myli chat. Website remains independent. |
| n8n VPS | Existing workflow automation. POI consumes n8n webhooks and adds new ones for Portal events. |
| Google Sheets | Read/sync source during transition. POI imports existing data into Supabase. Sheets remain operational for website and Myli while migration stabilizes. |
| Myli (AI Sales Assistant) | Phase 2: POI provides admin UI for Myli (conversation history, prompts, consent records). Phase 3+: Myli writes directly to POI via `system_agent` API. |

---

## 3. System Architecture

### 3.1 Deployment Topology

```
portal.segurosmyl.com      → Vercel (POI frontend + API routes)
www.segurosmyl.com         → Vercel (existing website — unchanged)
n8n.segurosmyl.com         → existing VPS (workflow orchestration)
[project].supabase.co      → Supabase (database, auth, storage, realtime)
```

The POI is a **separate Vercel project** from the website. It shares the `segurosmyl.com` domain via a subdomain (`portal.segurosmyl.com`). No code or deployment dependency on the website project.

### 3.2 Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | Next.js (App Router) | 14+ |
| Language | TypeScript | 5+ |
| UI components | shadcn/ui + Tailwind CSS | latest |
| Authentication | Supabase Auth + Google OAuth 2.0 | — |
| Database | Supabase (PostgreSQL) | — |
| Realtime | Supabase Realtime (WebSocket subscriptions) | — |
| File storage | Supabase Storage | — |
| AI content generation | Anthropic API (Claude Sonnet) | — |
| Workflow automation | n8n (existing VPS) | — |
| Hosting | Vercel | — |
| CI/CD | GitHub → Vercel auto-deploy | — |

### 3.3 Architecture Pattern

- **Next.js App Router** with Server Components for data-fetching and layout
- **API Routes** (`/app/api/`) for server-side operations requiring Supabase service-role key or Anthropic API calls
- **Supabase client** (anon key) in client components for auth and realtime subscriptions
- **Row Level Security (RLS)** in Supabase enforces access control at the database layer — the application layer never queries across role boundaries
- n8n communicates with POI via **signed webhook calls** to `/api/webhooks/n8n/[event]`
- POI communicates with n8n for AI generation tasks via **n8n production webhook URLs**

### 3.4 Security Model

- All routes require authentication — no public pages beyond the login screen
- RLS policies on every table enforce role-based data isolation
- Service-role key is only used in Next.js API routes (server-side) — never exposed to the browser
- Anthropic API key stored in Vercel environment variables — never in client code
- n8n webhook shared secret for inbound webhook verification
- HTTPS enforced at Vercel edge

---

## 4. Role Model

### 4.1 Human Roles

| Role | Description | Module Access |
|---|---|---|
| `admin` | Technology/Admin staff. Full access including user management and system configuration. | All modules |
| `manager` | General Manager. Full operational view. Cannot manage users or system config. | Dashboard, Leads, Catalog, Policies, Myli Admin, AI Workspace |
| `advisor` | Commercial advisors. Own leads and follow-ups; read access to catalog. | Own leads, Catalog (read), Policy summary (own) |

### 4.2 AI Agent Role

| Role | Description |
|---|---|
| `system_agent` | Service account role for all AI agents. Agents authenticate via API keys (not Google OAuth). They can write to Leads, Conversations, Messages, and ConsentEvents via API routes. They cannot access user management, system config, or AI Workspace. |

The `system_agent` role is generic by design. Each registered AI agent (Myli, future Marketing Bot, future Assistant Bot) receives its own API key but shares the same permission boundary. Individual agent behavior is differentiated by the `agent_id` on every write, not by separate roles.

---

## 5. AI Agent Model

### 5.1 Agents as First-Class Actors

AI agents are registered entities in the POI database, not external black boxes. Every agent has:
- A database row in `ai_agents`
- Its own API key for authentication against POI API routes
- An activity log (`agent_activities`) for all writes
- Linked conversation and lead records attributable to the agent

### 5.2 Agent Registration (Phase 2 — Myli only)

```
ai_agents
  id               uuid PK
  name             text NOT NULL          -- "Myli", "Marketing Bot", "Assistant Bot"
  type             text NOT NULL          -- "sales_assistant" | "marketing" | "support"
  status           text NOT NULL          -- "active" | "inactive" | "maintenance"
  description      text
  webhook_url      text                   -- n8n webhook this agent listens on
  api_key_hash     text                   -- hashed API key for inbound auth
  capabilities     jsonb                  -- ["lead_capture", "quote_assist", "human_escalation"]
  config           jsonb                  -- agent-specific config (e.g., default prompt template id)
  created_at       timestamptz DEFAULT now()
  updated_at       timestamptz DEFAULT now()
```

### 5.3 Agent Capabilities (Phase 2 — Myli)

Myli's registered capabilities in Phase 2:
- `lead_capture`: Can create Lead records
- `quote_assist`: Can log quote interactions
- `human_escalation`: Can flag a lead for human follow-up
- `consent_recording`: Writes ImplicitConsentEvent and ExplicitConsentEvent records

Phase 3 agents (Marketing Bot, Assistant Bot) register their own capability sets on deployment.

---

## 6. Data Model

All tables include `created_at timestamptz DEFAULT now()` and `updated_at timestamptz DEFAULT now()` unless noted. Row Level Security is enabled on every table.

### 6.1 Core Entities

```sql
-- Users (managed by Supabase Auth; profile extension)
user_profiles
  id               uuid PK FK auth.users.id
  full_name        text
  role             text NOT NULL  -- 'admin' | 'manager' | 'advisor'
  is_active        boolean DEFAULT true
  created_at, updated_at

-- AI Agents (see §5.2 above)
ai_agents          -- defined in §5.2

-- Contacts (people who interact with M&L)
contacts
  id               uuid PK
  name             text NOT NULL
  phone            text
  email            text
  source           text           -- 'website_form' | 'myli_chat' | 'manual' | 'whatsapp'
  notes            text
  created_at, updated_at

-- Leads
leads
  id               uuid PK
  contact_id       uuid FK contacts.id
  source           text NOT NULL  -- 'website_form' | 'myli_chat' | 'manual'
  product_interest text           -- free text or FK to products in Phase 3
  status           text NOT NULL  -- 'new' | 'contacted' | 'in_progress' | 'quoted' | 'closed_won' | 'closed_lost'
  assigned_to      uuid FK user_profiles.id  -- human advisor
  originating_agent_id  uuid FK ai_agents.id NULLABLE  -- AI agent that created the lead
  session_id       text           -- links to Myli session if sourced from chat
  priority         text DEFAULT 'normal'  -- 'low' | 'normal' | 'high'
  closed_at        timestamptz NULLABLE
  created_at, updated_at

-- Lead activity log
lead_activities
  id               uuid PK
  lead_id          uuid FK leads.id
  type             text NOT NULL  -- 'note' | 'call' | 'email' | 'whatsapp' | 'status_change' | 'ai_action'
  body             text
  created_by_user  uuid FK user_profiles.id NULLABLE
  created_by_agent uuid FK ai_agents.id NULLABLE
  metadata         jsonb
  created_at

-- Carriers
carriers
  id               uuid PK
  name             text NOT NULL UNIQUE
  website_url      text
  logo_filename    text
  is_active        boolean DEFAULT true
  notes            text
  created_at, updated_at

-- Categories
categories
  id               uuid PK
  name             text NOT NULL  -- 'VIDA' | 'AUTOS' | 'CUMPLIMIENTO' | 'GENERALES'
  slug             text NOT NULL UNIQUE
  is_active        boolean DEFAULT true
  display_order    int DEFAULT 0
  created_at, updated_at

-- Subcategories
subcategories
  id               uuid PK
  category_id      uuid FK categories.id
  name             text NOT NULL
  slug             text NOT NULL
  is_active        boolean DEFAULT true
  display_order    int DEFAULT 0
  created_at, updated_at

-- Products
products
  id               uuid PK
  carrier_id       uuid FK carriers.id
  subcategory_id   uuid FK subcategories.id
  product_name     text NOT NULL
  product_type     text
  short_description text
  long_description  text
  benefits         text
  clausulado_url   text
  clausulado_disponible  boolean DEFAULT false
  whatsapp_template text
  logo_filename    text
  is_active        boolean DEFAULT true
  sheets_row_id    text  -- reference to source Sheets row during migration
  created_at, updated_at

-- Policies (manually entered in Phase 2)
policies
  id               uuid PK
  policy_number    text UNIQUE
  carrier_id       uuid FK carriers.id
  product_id       uuid FK products.id NULLABLE
  contact_id       uuid FK contacts.id NULLABLE  -- policyholder contact (future: full customer entity)
  lead_id          uuid FK leads.id NULLABLE      -- originating lead
  status           text NOT NULL  -- 'active' | 'pending' | 'expired' | 'cancelled' | 'renewed'
  issue_date       date
  expiry_date      date
  premium_amount   numeric(12,2)
  premium_currency text DEFAULT 'COP'
  payment_frequency text  -- 'monthly' | 'quarterly' | 'annual' | 'single'
  document_url     text   -- Supabase Storage URL to policy document
  notes            text
  assigned_to      uuid FK user_profiles.id
  created_by       uuid FK user_profiles.id
  created_at, updated_at
```

### 6.2 Myli / Conversation Entities

```sql
-- Myli chat sessions
conversations
  id               uuid PK
  session_id       text NOT NULL UNIQUE  -- 'myli_<timestamp>_<random>' from frontend
  agent_id         uuid FK ai_agents.id  -- which AI agent (Myli in Phase 2)
  lead_id          uuid FK leads.id NULLABLE
  source_page      text    -- window.location.href at chat open
  entry_point      text    -- 'fab' | 'card' | 'modal'
  status           text DEFAULT 'active'  -- 'active' | 'closed' | 'escalated'
  created_at, updated_at

-- Individual messages in a conversation
messages
  id               uuid PK
  conversation_id  uuid FK conversations.id
  role             text NOT NULL  -- 'user' | 'assistant'
  content          text NOT NULL
  metadata         jsonb          -- whatsapp_cta shown, product context, etc.
  created_at

-- Consent events (both implicit and explicit)
consent_events
  id               uuid PK
  session_id       text NOT NULL   -- links to conversations.session_id
  conversation_id  uuid FK conversations.id NULLABLE
  type             text NOT NULL   -- 'implicit' | 'explicit'
  trigger          text NOT NULL   -- 'chat_interaction' | 'lead_capture' | 'quote_request' | 'human_contact_request'
  policy_version   text NOT NULL   -- date string e.g. '2026-06-09'
  policy_url       text NOT NULL   -- Google Drive URL shown to user
  source_url       text            -- window.location.href
  user_agent       text
  ip_address       text            -- captured by n8n from X-Forwarded-For
  created_at
```

### 6.3 AI Operations Entities

```sql
-- AI agent activity log
agent_activities
  id               uuid PK
  agent_id         uuid FK ai_agents.id
  action_type      text NOT NULL  -- 'lead_created' | 'message_sent' | 'consent_recorded' | 'status_updated' | 'escalation_flagged'
  entity_type      text           -- 'lead' | 'conversation' | 'consent_event'
  entity_id        uuid
  input_summary    text           -- brief description of what triggered the action
  output_summary   text           -- brief description of what was done
  metadata         jsonb
  created_at

-- Prompt templates (for Myli and future agents)
prompt_templates
  id               uuid PK
  name             text NOT NULL
  scope            text NOT NULL  -- 'myli' | 'content_generation' | 'marketing_bot' | 'assistant_bot'
  version          int DEFAULT 1
  is_active        boolean DEFAULT true
  body             text NOT NULL
  variables        jsonb          -- list of variable names used in the prompt
  notes            text
  created_by       uuid FK user_profiles.id
  created_at, updated_at

-- Generated content (AI Workspace outputs)
generated_content
  id               uuid PK
  template_id      uuid FK prompt_templates.id NULLABLE
  scope            text           -- 'product_description' | 'email' | 'social_post' | 'whatsapp_template'
  input_context    jsonb
  output_text      text
  model            text           -- 'claude-sonnet-4-6' etc.
  token_count      int
  created_by       uuid FK user_profiles.id
  created_at

-- KPI snapshots (pre-computed metrics for dashboard)
kpi_snapshots
  id               uuid PK
  metric           text NOT NULL  -- 'leads_today' | 'leads_week' | 'conversion_rate' | etc.
  value            numeric
  dimension        text           -- optional breakdown dimension (by advisor, by product, etc.)
  period_start     timestamptz
  period_end       timestamptz
  created_at
```

---

## 7. Module Specifications

### 7.1 Operations Dashboard (`/`)

**Purpose:** Real-time operational overview for managers and advisors.

**Components:**
- KPI cards: Total leads (today / this week / this month), Conversion rate, Open leads by status, Active Myli conversations
- Lead activity feed: Last 20 activities across all leads (realtime via Supabase Realtime)
- Lead status funnel: Visual pipeline from `new` → `closed_won` / `closed_lost`
- AI agent status: Myli online/offline indicator, messages processed today, leads created by Myli
- Advisor performance summary (manager/admin only): leads by advisor, average time-to-contact

**Data sources:** `leads`, `lead_activities`, `conversations`, `ai_agents`, `kpi_snapshots`

**Access:** `admin`, `manager` (full), `advisor` (own leads only)

---

### 7.2 Lead Management (`/leads`)

**Purpose:** Central view and management of all leads regardless of origin.

**List view:**
- Filterable table: by status, source, assigned advisor, date range, product interest
- Columns: contact name, phone, source, product interest, status, assigned to, last activity, created at
- Bulk actions (admin/manager): assign, change status, export CSV

**Lead detail (`/leads/[id]`):**
- Contact info panel
- Current status + status change actions
- Product interest (linked to catalog if matched)
- Activity timeline: all `lead_activities` ordered chronologically, with both human and AI entries visually differentiated
- Myli conversation link (if sourced from chat) → opens conversation thread
- Consent record (implicit + explicit events for this session)
- Follow-up scheduling (date/time + notes)
- Policy link (if a policy was created from this lead)

**Lead creation (manual):**
- Form: contact name, phone, email, source=manual, product interest (free text or catalog search), assigned advisor, initial note

**Access:** `admin`, `manager` (all leads), `advisor` (own leads only — enforced by RLS)

---

### 7.3 Product & Catalog Management (`/catalog`)

**Purpose:** CRUD management of the product catalog, replacing direct Sheets editing.

**Structure:**
```
/catalog                    → Overview + category list
/catalog/categories         → Category CRUD
/catalog/subcategories      → Subcategory CRUD (filtered by category)
/catalog/carriers           → Carrier CRUD
/catalog/products           → Product list with search/filter
/catalog/products/[id]      → Product detail + edit
/catalog/products/new       → Create product
```

**Product form fields:** carrier, subcategory, product_name, product_type, short_description, long_description, benefits (rich text), clausulado_url, clausulado_disponible toggle, whatsapp_template, logo upload (→ Supabase Storage), is_active toggle.

**AI-assisted content generation:** On the product form, a "Generate with AI" button beside `short_description`, `long_description`, and `benefits` fields. Calls the AI Workspace generation endpoint with product context. Requires manager/admin.

**Google Sheets sync (Phase 2 transition):**
- Admin UI to trigger a one-way sync: Sheets → Supabase
- Sync is additive and non-destructive: new Sheets rows are inserted; existing POI records take precedence if `sheets_row_id` matches
- Sync log shown in UI (rows added, skipped, errors)

**Access:** `admin`, `manager` (full CRUD), `advisor` (read-only)

---

### 7.4 Policy Management (`/policies`)

**Purpose:** Track insurance policies originated from M&L brokerage activity.

**List view:** Filter by carrier, product, status, advisor, expiry date range. Exportable.

**Policy detail (`/policies/[id]`):**
- Full policy fields
- Linked lead (origin story)
- Linked contact
- Document viewer / upload (Supabase Storage)
- Renewal tracking: flag approaching expiry (configurable days-before threshold)
- Status change log

**Policy creation:** Manual entry form. Fields: policy number, carrier, product, contact, lead link, status, issue date, expiry date, premium, payment frequency, document upload, notes.

**Expiry alerts (Phase 2):** Computed view on dashboard showing policies expiring within 30/60/90 days. No automated email in Phase 2 — human-triggered from the list.

**Access:** `admin`, `manager` (all), `advisor` (policies linked to their leads)

---

### 7.5 Myli Administration (`/myli`)

**Purpose:** Operational visibility into Myli's activity and configuration.

**Sub-sections:**

`/myli/conversations` — Conversation history
- List: session_id, source_page, entry_point, message count, lead created (yes/no), consent status, created_at
- Conversation detail: full message thread, consent events linked to session, linked lead card

`/myli/consents` — Consent event log
- Table: session_id, type (implicit/explicit), trigger, policy_version, source_url, ip_address, timestamp
- Exportable for legal audit purposes

`/myli/metrics` — Performance metrics
- Messages per day/week/month
- Sessions that generated leads (conversion rate)
- Top entry points (fab / card / modal)
- Top source pages
- CTA triggered count (WhatsApp button clicks)

`/myli/prompts` — Prompt management
- List of `prompt_templates` scoped to `myli`
- Version history (new version = new row, previous marked inactive)
- Active prompt highlighted
- Admin/manager can create new versions; advisor read-only

**Access:** `admin`, `manager` (full), `advisor` (read-only, own conversations only)

---

### 7.6 AI Workspace (`/ai-workspace`)

**Purpose:** Content generation, prompt management, and future AI orchestration.

**Sub-sections:**

`/ai-workspace/generate` — Content generation
- Select content type: product description, email template, WhatsApp message, social post
- Provide context (product, audience, tone)
- Generate via Anthropic API (Claude Sonnet)
- Output displayed with copy button and "Save to library" action
- Generated content stored in `generated_content`

`/ai-workspace/prompts` — Full prompt library (all scopes)
- Same UI as `/myli/prompts` but shows all scopes: `myli`, `content_generation`, future `marketing_bot`, `assistant_bot`

`/ai-workspace/agents` — AI Agent registry (admin only)
- List registered AI agents: Myli + future agents
- Status toggle (active / maintenance)
- Capability list
- Last activity timestamp
- API key rotation (admin only — shows masked key, allows regeneration)

**Access:** `admin`, `manager` (generate + prompts), `advisor` (generate only). Agent registry: `admin` only.

---

## 8. API Design

### 8.1 Internal API Routes (Next.js `/app/api/`)

```
POST  /api/webhooks/n8n/myli-conversation    Receive Myli session data from n8n
POST  /api/webhooks/n8n/myli-lead            Receive lead created by Myli from n8n
POST  /api/webhooks/n8n/myli-consent         Receive consent event from n8n
POST  /api/ai/generate                       Proxy to Anthropic API (server-side)
POST  /api/catalog/sync/sheets               Trigger Google Sheets → Supabase sync
GET   /api/kpis/snapshot                     Return precomputed KPI values
```

All webhook endpoints verify the `X-N8N-Signature` header against a shared secret stored in Vercel environment variables.

### 8.2 Supabase RLS Policy Summary

| Table | `advisor` can read | `advisor` can write |
|---|---|---|
| `leads` | WHERE `assigned_to = auth.uid()` | Own leads only |
| `lead_activities` | Via own leads | Own leads |
| `conversations` | Via own leads | No |
| `messages` | Via own conversations | No |
| `consent_events` | Via own conversations | No |
| `products` | All active | No |
| `carriers` | All active | No |
| `policies` | WHERE `assigned_to = auth.uid()` | Own |
| `prompt_templates` | All active (myli scope) | No |
| `ai_agents` | No | No |
| `agent_activities` | No | No |

`manager` and `admin` can read and write all rows. `system_agent` can only insert into `leads`, `conversations`, `messages`, `consent_events`, `agent_activities`.

---

## 9. Integration Architecture

### 9.1 Website → POI (Phase 2)

In Phase 2, the website does not call POI directly. The flow is:
```
Website contact form → Google Apps Script → Google Sheets (CONTACT_LEADS)
                                           → n8n webhook → POI /api/webhooks/n8n/myli-lead
```

A new n8n workflow watches the Sheets CONTACT_LEADS tab and forwards new rows to POI. This preserves the existing website infrastructure unchanged.

### 9.2 Myli → POI (Phase 2)

Myli (n8n workflow) sends conversation data to POI via webhooks at:
- Session close or 30-minute inactivity timeout → POST conversation + messages to POI
- Lead capture event → POST lead to POI immediately
- Consent event → POST consent event to POI immediately

POI stores the data. The website `js/mili-chat.js` is NOT modified to call POI directly — all POI writes go through n8n.

### 9.3 POI → Myli (Phase 2)

When an admin/manager updates a Myli prompt template in POI and marks it active, POI notifies n8n via webhook so n8n can load the updated prompt into the workflow.

### 9.4 Google Sheets → POI Sync (Phase 2 Transition)

On-demand sync triggered from `/catalog/products`. Uses Google Sheets API via a Next.js API route with a service account. Sync is one-way (Sheets → Supabase) during Phase 2. POI becomes the source of truth once all advisors are onboarded and confirm data quality.

---

## 10. Myli Privacy — Hybrid Consent Model

The privacy model approved for implementation balances legal compliance with lead conversion.

### 10.1 Consent Tiers

**Tier 1 — Implicit consent (informative notice)**
- Trigger: User continues interacting after Myli welcome message
- Mechanism: Welcome message includes a plain-language privacy notice and clickable link to the privacy policy document
- Consent recorded: When user sends the first message after seeing the notice
- Stored as: `consent_events.type = 'implicit'`, `trigger = 'chat_interaction'`

**Tier 2 — Explicit consent**
- Trigger: User action that initiates personal data collection or high-intent commercial action
- Actions requiring explicit consent: requesting a quote, requesting advisor contact, requesting an appointment, submitting name/phone/email for lead capture
- Mechanism: Inline consent step within the chat flow — a brief notice with a confirm button before the action proceeds
- Stored as: `consent_events.type = 'explicit'`, `trigger = 'lead_capture' | 'quote_request' | 'human_contact_request'`

### 10.2 Implementation in mili-chat.js

- `openMili()` requires no modal gate — chat opens immediately
- Welcome message appended with: *"Al continuar aceptas nuestra [política de privacidad]."* (link opens Google Drive policy in new tab)
- `implicitConsentRecorded` flag in session state; set to `true` on first user message
- Before any lead-capture action (WhatsApp CTA click → name/phone request, quote flow):
  - Check `explicitConsentRecorded` flag
  - If not set: show inline consent prompt — checkbox + "Confirmar y continuar"
  - On confirm: set flag, POST consent event to n8n, proceed
- localStorage caches both consent flags per `sessionId` to survive page refresh

### 10.3 Policy Version Management

The policy version string (e.g., `"2026-06-09"`) is hardcoded in `mili-chat.js`. When the privacy policy document is updated, this string must be incremented in a new commit. Consent records reference the version at the time of acceptance, creating a permanent audit trail even as the policy evolves.

---

## 11. Non-Functional Requirements

### Performance
- Dashboard initial load: ≤ 2 seconds (SSR with Supabase server client)
- Lead list with 1,000 rows: paginated (50 per page), ≤ 500ms query time
- Realtime lead activity feed: ≤ 1 second latency via Supabase Realtime

### Security
- All environment variables (Supabase keys, Anthropic key, n8n secret) stored in Vercel environment — never in source code
- No secrets in `git` history
- HTTPS only — enforced at Vercel edge
- Session tokens managed entirely by Supabase Auth (JWTs, refresh tokens)
- Webhook verification on all n8n → POI routes

### Availability
- Hosted on Vercel + Supabase free/pro tiers — both provide 99.9% SLA at paid tier
- No custom infrastructure to maintain
- n8n VPS uptime is the only self-managed dependency

### Compliance
- All personal data stored in Supabase is subject to Supabase's data processing addendum
- POI stores consent records with sufficient fields to respond to Colombian Ley 1581 Habeas Data rights requests
- Policy version field on every consent event supports audit of historical policy versions

---

## 12. Phase 3 Expansion Path

Phase 3 modules are not designed in this document but the Phase 2 architecture anticipates them:

| Phase 3 Module | What Phase 2 provides |
|---|---|
| Marketing Bot | `ai_agents` table ready for registration. `prompt_templates` scoped to `marketing_bot`. `agent_activities` log structure is agent-agnostic. |
| Assistant Bot | Same as Marketing Bot. |
| WhatsApp Integration | `lead_activities.type` already includes `'whatsapp'`. Contacts have `phone` field. Lead source already supports `'whatsapp'`. |
| Calendar Integration | `lead_activities` can record `'appointment'` type. Scheduling fields can be added to leads. |
| Internal Knowledge Base | `prompt_templates` and `generated_content` tables are the foundation. |
| Customer Self-Service | Contacts table separates personal identity from auth identity — a future `customer_auth` table can be added without restructuring core entities. |

---

## 13. Open Decisions (Require Client Input Before Implementation)

| # | Decision | Options | Impact |
|---|---|---|---|
| 1 | Subdomain | `portal.segurosmyl.com` vs `app.segurosmyl.com` | DNS config |
| 2 | Google OAuth Client ID | Must be created in client's Google Cloud Console | Auth |
| 3 | Supabase project ownership | Developer creates + transfers vs client creates directly | Infrastructure |
| 4 | Initial data migration | Full Sheets import at launch vs manual entry going forward | Catalog scope |
| 5 | Myli → POI activation timing | Phase 2 launch vs after POI stabilizes | n8n work scope |
| 6 | Advisor onboarding | How many advisors in Phase 2 launch? | RLS testing scope |

---

*Spec written: 2026-06-09. Author: Cesar Eraso + Claude Code.*
*Approved direction: Human + AI Operations Platform. Phase 2 internal only.*
*Status: Ready for implementation planning via writing-plans skill.*
