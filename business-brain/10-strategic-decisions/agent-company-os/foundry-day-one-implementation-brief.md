# Foundry × NovaHair — Day-one implementation brief

Prepared 9 September 2026. This file is an implementation proposal, not evidence that any runtime, automation or production system has been changed.

## Mission

Deliver one bounded, restart-safe autonomous shift inside the EXISTING Foundry runtime. When Harel stops interacting, an authorized work order should progress from trigger through verified local artifact without another prompt. Do not build a new orchestration application.

## Authorization boundary

Start with a read-only audit of the active local installation. Do not interpret receipt of this document as permission to deploy, publish, spend, send communications or change live business systems. After the owner authorizes implementation, work on an isolated branch/workspace and test with fixtures. Separately obtain approval before enabling a persistent real-data schedule.

Forbidden without separate explicit approval: Meta writes of any kind; Shopify writes; PostHog or site instrumentation changes; emails or messages to customers/suppliers; payments, refunds, procurement, discounts, new paid API use, media-generation spend, new subscriptions, or public deployment. Do not reuse old permission grants for a new scope.

## 1. Audit before implementation

1. Locate the actual Foundry checkout, branch, running process, server port, Node/Codex versions and data store. Compare with `harelos/foundry-app`, but do not assume its main branch is deployed. Check for existing OX/Foundry bridge work. Preserve existing interfaces and mobile clients; do not redesign them.
2. Identify real Codex authentication mode without revealing credentials. Prefer the supported Codex runtime using the owner's existing ChatGPT/Codex login. Do not extract tokens into a generic API proxy or share credentials. No automatic API-key fallback, credit purchase or account switching.
3. Verify model availability and effort options from the installed authenticated runtime. Do not assume exact model IDs or that online documentation matches the installed version.
4. Verify native session/thread persistence and actual resume behavior. A local label or saved transcript is not proof of a resumable Codex thread.
5. Inspect durable task storage, dispatch, loop caps, stop controls, concurrency, usage records, scheduled wakeups and restart reconciliation. Reuse what works.
6. Inspect the security boundary: credentials available to the process, authentication for remote access, process permissions, secrets in logs/client payloads and untrusted tool content. Never expose an unauthenticated local control port. Do not change unrelated host settings silently.
7. Produce `audit.md`: observed capabilities, evidence, missing pieces, proposed minimal patch, unknowns and owner decisions.

Known repository observations to confirm against the active installation:
- The inspected `foundry-app/main/server.js` Codex completion path writes zero token/cost fields to its history. UNKNOWN must not be interpreted as free work.
- The inspected load routine disables active loops after restart. Preserve this safe default; recover authorized work via a durable scheduler rather than blindly resuming loops.
- The inspected runtime launches `codex exec`; verify whether local upgrades already use native persistent threads.

## 2. Minimal team and work ownership

Five role profiles, not five continuously running processes:
- Growth Lead: acquisition evidence and one controlled creative-test pipeline.
- Revenue Lead: CRO, purchase reconciliation, lifecycle drafts and catalogue-wide SEO backlog.
- Operations Lead: support/fulfillment exceptions and contribution-data integrity.
- Shared Maker: produces the requested local artifact or isolated patch.
- Shared Verifier: evaluates frozen acceptance criteria using artifact/test evidence.

Leads are working managers. Simple jobs do not need separate delegation. No extra AI CEO, no recursive hiring, no autonomous tool installation. A deterministic scheduler—not an LLM—owns queue admission and routing.

## 3. One durable state machine

`QUEUED -> RUNNING -> VERIFYING -> COMPLETE | REPAIR | BLOCKED`

Production-ready work can be `READY_FOR_APPROVAL`; that is NOT `DEPLOYED`. Deployment is outside this pilot. COMPLETE means the stated local/draft deliverable passed its contract, not that the business achieved a revenue lift.

Persist at least:
- task ID; event/deduplication key; root task ID; owner; status;
- approved objective, input references and source timestamps;
- immutable acceptance version and allowed tool scope;
- model/auth mode; native thread ID when available;
- attempts, consultations, escalations, token/usage observations and unknowns;
- root time/tool/usage caps; start, deadline, lease and heartbeat;
- artifact path/hash; verifier evidence; next action/wake; blockage reason.

Use the existing durable store when suitable. If inadequate, propose a small transactional addition rather than a distributed rewrite. Use UTC for stored timestamps and `Asia/Jerusalem` for business schedules and day boundaries.

## 4. Admission and cost controls

Pilot defaults, adjustable only by the owner:
- Two concurrent jobs globally at most. Use one while calibrating per-task quota consumption.
- One initial attempt plus one repair; one consultation; one model escalation per root work order.
- Child tasks, reviews and retries share the root budget. They cannot reset it.
- Triage ceiling: 5 minutes / 10 tool calls. Routine artifact: 20 minutes / 30 calls. Explicitly scoped complex implementation: 45 minutes / 60 calls. These are ceilings, not required spend.
- No automatic Astra/top-tier escalation; no fast mode by default.
- Extra API/media spend approved for the pilot: zero.

Implement quota admission from real telemetry. The official App Server documents `account/rateLimits/read`, `account/rateLimits/updated`, `thread/tokenUsage/updated` and `model/list`; confirm version support first. Do not hard-code provider window durations or fabricate dollar costs from subscription token totals.

Proposed policy: reserve capacity for Harel's own coding; stop nonurgent admission when any applicable quota window has less than 20% remaining, when the pilot's daily allocation is exhausted, or when quota telemetry is unavailable/stale. Pace weekly capacity to its actual reset. Thresholds require owner approval before activation.

Separate three ledgers: subscription quota/usage, actually billed API money, and external business spend. Show unknown data explicitly. Do not promise an exact per-agent quota split when other concurrent usage obscures it.

Use a supervisor-enforced wall-clock timeout. A completed turn with no artifact change or evidence should not cause unlimited repeated turns. An agent cannot raise its own limits or modify the acceptance tests/policy.

## 5. First work order

ID: `GROWTH-001`
Goal: Prepare one Receipt concept pack for NovaHair, locally, with no ad launch.

Inputs: owner-approved original product asset; current verified offer; documented claim boundaries; landing destination; brand examples. Use read-only retrieval only when authorized; otherwise use clearly labeled fixtures. Do not invent missing assets, proof or business data.

Output:
- One coherent concept with three short hook options, not three separate campaigns.
- Local mobile preview using approved assets; no paid generation.
- Copy, destination and proposed UTM plan.
- Test hypothesis, metric definitions and a proposed review point, not an automatic stop-loss.
- Evidence manifest and independent acceptance result.

Critical acceptance:
- Exact approved product fidelity; readable Hebrew and RTL where relevant.
- Current offer checked against authoritative data; currency explicit.
- No fabricated testimonials/results or receipt presented as authentic without evidence.
- No unsupported duration-of-supply, safety or performance promise.
- Preview opens at 390px without overflow; destination/UTM structure checked.
- Artifact does not modify any Meta, Shopify, email or production system.
- Missing critical evidence returns BLOCKED rather than creative guessing.

If the required assets are unavailable, use a redacted fulfillment-exception fixture to validate the autonomous loop. Label it as fixture-based system verification, not a completed live business deliverable.

## 6. Verification and recovery

Freeze checks outside the maker's editable scope. Run deterministic checks first, then one bounded independent model review where judgment is necessary. The verifier sees the artifact, checklist and evidence; it does not inherit the maker's self-congratulatory conversation.

An external write timing out means UNKNOWN until read-back reconciliation. Even though writes are prohibited in the pilot, test this behavior with a fake target. Never blindly retry a money or customer-facing side effect.

On restart: reconcile task leases, account state, approvals and previous effects. Resume only explicitly permitted work with a valid remaining budget. Do not restore unrestricted continuous loops. Keep an independent service heartbeat so a dead agent cannot falsely report health.

## 7. Required end-to-end demonstrations

After local implementation approval, demonstrate and record:
1. The Foundry UI/browser tab can close while the service finishes the queued local job.
2. A deliberate restart recovers the work order once and retains artifacts/evidence.
3. Duplicate events create one logical work order.
4. Simulated quota exhaustion and missing telemetry park work without paid fallback or retry storms.
5. One failed critical check triggers at most one repair, then BLOCKED.
6. Untrusted source instructions cannot expand permissions or reveal secrets.
7. Pending owner approval cannot execute an action; independent safe work can continue.
8. No production credential/setting change or live write occurs.

Then perform a two-hour absence test on an authorized useful local work order, with no intervention. The host must remain powered and awake with the service running; closing the browser is not the same as suspending the computer.

## 8. Deliverables and honest completion

Return actual changed files, commands executed, job/thread IDs, artifacts, timestamps, usage readings, test results and limitations. Distinguish mocked tests from real-data tests and requested changes from verified deployed changes.

No completion claim based only on code generation, a passing build, a screenshot, or a worker saying “done.” If a gate is missing, report exactly what is blocked and stop that branch of work.

A 72-hour calibration and full seven-day sustainability pilot are the next steps ONLY after owner approval and a successful vertical slice. No new tool purchases, new departments or repeated UI redesign.

## Primary references

- https://developers.openai.com/codex/app-server/
- https://developers.openai.com/codex/auth/
- https://developers.openai.com/codex/pricing/
- https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- https://www.anthropic.com/research/project-vend-2
- https://github.com/harelos/foundry-app
