# MILI PHASE 1 — WEB AI ASSISTANT

## Project Objective

Implement Phase 1 of Mili as an intelligent AI-powered web assistant for the existing production insurance website.

This phase focuses exclusively on improving customer guidance, product discovery, lead qualification, and appointment capture directly on the website.

This is NOT an omnichannel deployment.

---

# Phase 1 Scope

## Included

- Intelligent web chat assistant
- Floating Action Button (FAB) access
- Expandable chat modal / drawer UI
- Context-aware conversations based on current page
- Product guidance and recommendation assistance
- FAQ assistance
- Lead qualification
- Appointment request capture
- Human advisor escalation via web CTA (optional)
- Claude-powered conversational intelligence
- n8n orchestration workflows
- Google Sheets as initial product knowledge source
- secure backend API integration

---

# Explicitly Excluded

## Channel exclusions

- WhatsApp conversational AI
- omnichannel orchestration
- email automation
- SMS assistant

## Experience exclusions

- avatar
- voice interaction
- speech-to-text
- text-to-speech
- computer vision
- camera interaction
- animated character assistant

## Backend exclusions

- CRM integration (Phase 2)
- advanced analytics dashboards
- persistent customer memory
- vector database / RAG stack (unless architecture recommends future placeholder)

---

# User Experience Goals

Mili should help visitors:

- understand insurance products
- compare options
- discover relevant policies
- clarify terminology
- request contact from an advisor
- request appointment scheduling
- accelerate decision making

Tone:

- warm
- professional
- trustworthy
- fast
- consultative
- sales-assistive, not aggressive

---

# Access Points

Mili may be triggered from:

- floating assistant button
- navbar CTA (optional)
- contextual product CTA
- comparison page CTA
- contact page CTA

---

# Expected Web Capabilities

## Product Discovery

Examples:

- "Necesito un seguro para mi carro"
- "¿Qué cubre un seguro de hogar?"
- "¿Qué diferencia hay entre salud y medicina prepagada?"

---

## Qualification

Examples:

- insurance type needed
- individual vs business
- urgency
- budget orientation
- contact preference

---

## Appointment Capture

Capture:

- name
- phone
- email
- insurance interest
- preferred schedule

---

## Human Escalation

Optional CTA:

"Hablar con un asesor"

This is manual escalation only.

No conversational WhatsApp AI in Phase 1.

---

# Technical Architecture Constraints

Frontend:
- existing production Vercel website

AI:
- Claude Sonnet

Orchestration:
- n8n mandatory

Initial knowledge source:
- Google Sheets

API:
- secure server-side proxy only

No direct Claude API exposure in frontend.

---

# Functional API Targets

Expected endpoints (conceptual):

POST /api/mili/chat
POST /api/mili/book
POST /api/mili/lead

Final implementation may adapt based on architecture analysis.

---

# Success Criteria

Phase 1 is successful when:

- Mili is accessible from web
- conversations are context aware
- product guidance works reliably
- leads can be captured
- appointments can be requested
- frontend remains production stable
- mobile experience remains intact
- no regression to existing website behavior

---

# Phase 2 Reserved

Reserved for future:

- WhatsApp AI assistant
- omnichannel orchestration
- CRM integrations
- persistent customer memory
- analytics dashboards
- avatar experience
- voice interaction
- computer vision
- advanced recommendation intelligence