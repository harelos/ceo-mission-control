export type Priority = 'P0' | 'P1' | 'P2' | 'P3';

export type Task = {
  id: string;
  title: string;
  priority: Priority;
  owner: string;
  status: string;
  dueDate: string;
  dependencies: string;
  nextAction: string;
  notes: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

const today = '2026-08-27';

const makeTask = (
  id: string,
  title: string,
  priority: Priority,
  owner: string,
  status: string,
  dependencies: string,
  nextAction: string,
): Task => ({
  id,
  title,
  priority,
  owner,
  status,
  dueDate: priority === 'P0' ? '2026-08-27' : priority === 'P1' ? '2026-08-29' : priority === 'P2' ? '2026-08-31' : '2026-09-15',
  dependencies,
  nextAction,
  notes: '',
  completed: false,
  createdAt: today,
  updatedAt: today,
});

export const initialTasks: Task[] = [
  makeTask('01', 'Install Chargeflow with guarded controls', 'P0', 'CEO · Payments/Risk Agent', 'Decision ready; not installed', 'Verified live policies, shipping facts, refund controls', 'Approve Chargeflow pilot. Begin with Insights + Alerts, audit the first five cases, and keep Prevent and unrestricted auto-refunds off.'),
  makeTask('02', 'Audit and repair the A/B testing system', 'P0', 'Analytics/CRO Agent · Developer Agent', 'Master backlog found; implementation unverified', 'GA4 event integrity, live-offer reconciliation, stable assignment and exposure layer', 'Verify experiment assignment, meaningful exposure, commerce events and persistent attribution before structural tests.'),
  makeTask('03', 'Implement the new legal terms and policies', 'P0', 'CEO · Legal/Compliance Agent', 'Hebrew V2 and unlinked preview exist', 'Processing time, customs, return operations, formula warnings, regulatory route, accessibility claims', 'Approve and publish one verified policy at a time; do not bulk-replace all live policies.'),
  makeTask('04', 'Let AI implement the new store design', 'P1', 'Developer Agent · CRO Agent', 'Open; no verified implementation source', 'P0 tracking, mobile QA, staging and isolated-test plan', 'Build one staged above-the-fold variant. Do not launch a multi-variable redesign.'),
  makeTask('05', 'Add new products for store tests', 'P1', 'Product/Sourcing Agent · Fulfillment Ops', 'Open', 'Supplier sample, INCI/label, landed COGS, real images, CJ sync and SLA', 'Select one complementary product and create a draft SKU only after every gate passes.'),
  makeTask('06', 'Launch segmented KIT email campaigns', 'P0', 'Retention/Email Agent · CEO', 'Plan found; ready for review; do not send', 'Fresh counts, consent, suppression, 1/2/3 bundle logic and Hair Gloss ownership', 'Refresh the audience, build Historical NovaHair Buyer Reactivation V1 with a holdout, and preview only.'),
  makeTask('07', 'Pay outstanding orders', 'P0', 'CEO · Finance/Ops', 'Owner-reported open', 'Accurate outstanding-order list and available cash', 'Pay valid due orders and record paid, held and exception states.'),
  makeTask('08', 'Repair CJ ↔ Shopify order sync', 'P0', 'Fulfillment Ops · Developer Agent', 'Broken; manual workaround active', 'Paid-order reconciliation, SKU mapping, shipping methods, credentials and app health', 'Run one exception queue from paid order to CJ submission to tracking sync; manually fulfill today’s valid orders.'),
  makeTask('09', 'Continue the internal popup system', 'P2', 'Internal Tools Developer · CRO Agent', 'Open; no source-of-truth file', 'Measurement layer, consent rules, page targeting', 'Write a compact spec, then test no-popup versus popup with revenue/session and mobile obstruction as guardrails.'),
  makeTask('10', 'Continue the internal dashboard', 'P2', 'Internal Tools Developer · Analytics Agent', 'Open; no source-of-truth file', 'Metric definitions and reliable Shopify/Meta/GA4 reconciliation', 'Build the minimum control view: spend, actual revenue, variance, new versus returning and fulfillment exceptions.'),
  makeTask('11', 'Continue the internal chatbot', 'P2', 'Internal Tools Developer · Support/Sales Agent', 'Open; no source-of-truth file', 'Support inbox, approved claims, escalation rules and attribution', 'Define safe scope, human handoff and logging before testing chatbot on versus off.'),
  makeTask('12', 'Publish variations of the current winning creative', 'P1', 'Creative Production Agent · Media Buyer', 'Strong production queue found; not published', 'Fresh live offer and packaging-accurate assets', 'Produce Salon Cost and bundle/value families first while keeping landing route and offer constant.'),
  makeTask('13', 'Improve Google Analytics / GA4 tracking', 'P0', 'Analytics Agent · Developer Agent', 'P0 backlog confirmed; integrity unproven', 'Event schema, Israel-only view, internal-traffic exclusion and Meta/Shopify mapping', 'Verify single-fire purchase, ATC and checkout events; instrument advertorial CTA and experiment parameters.'),
  makeTask('14', 'Launch one additional product to paid traffic', 'P1', 'Product Agent · CRO Agent · Media Buyer', 'Open; no approved candidate or page', 'Product gates, tracking integrity, page readiness and budget rules', 'Select one candidate, finalize economics and a page brief, then QA before traffic.'),
  makeTask('15', 'Build a NovaHair upsell funnel', 'P1', 'CRO/Upsell Agent · Product/Sourcing Agent', '3U2D research exists; build not executed', 'Real SKUs, samples, landed cost, CJ sync, shade mapping and claims review', 'Validate Root Rescue and Repair & Shine, calculate contribution per eligible order, then build the smallest OCU sequence.'),
  makeTask('16', 'Build post-purchase and behavioral email flows', 'P1', 'Retention/Email Agent', 'Base flows exist; some logic is stale', '1/2/3 bundles, delivery signal, purchase suppression, Hair Gloss ownership and consent', 'Repair post-purchase, delivered education and abandoned checkout flows; replace legacy 4-pack timing.'),
  makeTask('17', 'Create a daily GA4 and business-analysis agent', 'P2', 'Analytics Agent · Internal Tools Developer', 'Daily Meta/Shopify report exists; automation not found', 'Trusted data, anomaly thresholds and owner-approval boundaries', 'Produce a read-only daily brief for revenue, spend, funnel, attribution, fulfillment and support exceptions.'),
  makeTask('18', 'Start advertising on Google', 'P2', 'Media Buyer · Analytics Agent', 'Open; no active plan found', 'GA4 conversions, product feed, landing readiness, negatives and budget', 'After P0 tracking passes, launch one controlled Search or Shopping validation lane.'),
  makeTask('19', 'Advance NovaHair US supplier replies', 'P0', 'CEO · US Sourcing Agent', 'Outreach pack exists; exact supplier data missing', 'Exact SKU, INCI/SDS/COA, PPD, MoCRA, sample, US SLA and landed COGS', 'Send Zendrop clarification and obtain comparable CJ and Junchun quotes before selecting.'),
  makeTask('20', 'Verify customer-service email delivery', 'P0', 'Support Ops · Developer Agent', 'Owner-reported risk; no diagnostic file', 'Mailbox, forwarding, Shopify settings, DNS and spam logs', 'Run external inbound/outbound tests, verify routing and ownership, and create an exception alert.'),
  makeTask('21', 'Install WhatsApp number and AI automation', 'P2', 'Support Ops · Automation Agent · Legal', 'Open; no current implementation plan', 'Phone ownership, consent, templates, hours, escalation and order lookup', 'Choose a business number and launch support-only triage with human escalation.'),
  makeTask('22', 'Continue the mobile app for running agents', 'P3', 'Product/Engineering Agent', 'Open; no source-of-truth file', 'Stable desktop workflow, security, queue and mobile scope', 'Capture a one-page product brief; defer development until revenue-control P0 work is stable.'),
  makeTask('23', 'Continue app launch-page tests with Gonen', 'P2', 'CEO/Product Owner · Gonen · CRO Agent', 'Open; no Drive project file', 'Current variants, experiment data and video delivery status', 'Ask Gonen for video status and create one shared launch-test brief and scorecard.'),
  makeTask('24', 'Create paid-video variety', 'P1', 'Creative Production Agent · Media Buyer', 'Open; static winners are stronger than current UGC signal', 'Winning messages, real product media, hooks and controlled route', 'Create video versions of Salon Cost and bundle/value winners before exploratory UGC.'),
  makeTask('25', 'Reconcile the live bundle architecture', 'P0', 'Analytics/CRO Agent · Retention Agent', 'Critical conflict: 2/4/6 in backlog versus 1/2/3 live check', 'Fresh live PDP and Shopify variant verification', 'Confirm the live offer and update A/B, email, upsell and creative briefs before execution.'),
  makeTask('26', 'Run Meta in-app mobile and performance QA', 'P0', 'CRO/QA Agent · Developer Agent', 'P0 backlog; completion unverified', 'Facebook/Instagram browser, mobile widths and performance tools', 'Test sales page, advertorial, cart and checkout; reproduce blank space, lazy-load and script issues.'),
  makeTask('27', 'Create chargeback evidence and policy-version logging', 'P0', 'Payments/Risk Agent · Fulfillment Ops · Legal', 'Legal plan exists; logging unverified', 'Policy IDs, order snapshots, assent, tracking, messages and refunds', 'Define the per-order evidence record and audit Chargeflow output against real facts.'),
  makeTask('28', 'Refresh owned-audience data and suppression logic', 'P0', 'Retention/Data Agent', 'Historical ~1,276 audience; current count unknown', 'Fresh customer/order query and consent', 'Return eligible counts, age distribution, bundle history, Hair Gloss ownership and suppression totals.'),
  makeTask('29', 'Build a three-supplier landed-cost scorecard', 'P1', 'US Sourcing Agent · CEO', 'Shortlist and outreach copy exist', 'Three exact quotes, samples and compliance documents', 'Normalize cost, shipping, shades, documents, PPD, bundles, tracking and scale path.'),
  makeTask('30', 'Verify bundle and shade image accuracy', 'P0', 'CRO/QA Agent · Creative Agent', 'P0/P1 backlog; live state unknown', 'Fresh variant mapping and real packaging assets', 'Check every shade and quantity across gallery, cart and checkout; fix errors before aesthetics.'),
  makeTask('31', 'Create new-vs-returning and 30/60/90-day value reporting', 'P1', 'Analytics Agent', 'Needed; not verified live', 'Shopify cohorts, source and contribution inputs', 'Build first bundle to repeat timing, attach and value views; separate new-customer CPA from blended CPA.'),
  makeTask('32', 'Create source-of-truth specs for internal projects', 'P2', 'CEO · Internal Ops Agent', 'Popup, dashboard, chatbot, mobile app and Gonen work lack dedicated docs', 'Owner context and code/project links', 'Create one brief per resumed project with objective, owner, current state, next action and task link.'),
  makeTask('33', 'Order and QA NovaHair US samples', 'P1', 'US Sourcing Agent · Product QA Agent', 'Missing from original list; supplier gate identified', 'Shortlisted exact SKUs, sample payment approval and test addresses', 'Order Black, Dark Brown and Light Brown samples from the top compliant routes; record coverage, packaging, leakage and delivery.'),
  makeTask('34', 'Build the US unit-economics decision model', 'P1', 'Finance/Analytics Agent · US Sourcing Agent', 'Working sensitivity exists; exact costs missing', 'Landed COGS, pick/pack, payment, refunds, gift and support costs', 'Calculate contribution and target CAC for 1/2/3-unit offers using exact supplier quotes.'),
  makeTask('35', 'Run NovaHair production QA before every launch', 'P0', 'QA Agent · Creative Agent · CRO Agent', 'Cross-project operational gap', 'Live product truth, packaging assets, shade map and policies', 'Use one checklist for offer, price, gift, imagery, shade, mobile, cart, checkout, tracking and legal links.'),
  makeTask('36', 'Instrument intent and Clarity QA loops', 'P1', 'Analytics/CRO Agent', 'Clarity recordings exist; systematic loop missing', 'GA4 events, session identifiers and privacy rules', 'Define intent events and a weekly recording sample tied to funnel drop-offs and test variants.'),
  makeTask('37', 'Set support AI guardrails', 'P1', 'Support Agent · Legal/Compliance Agent', 'Needed before chatbot and WhatsApp automation', 'Approved claims, refund rules, shipping truth and escalation matrix', 'Create allowed-answer sources, forbidden claims, escalation triggers and a transcript QA routine.'),
  makeTask('38', 'Complete US claims and compliance review', 'P1', 'US Compliance Agent · CEO', 'Research exists; product-specific facts missing', 'Exact formula, label, manufacturer, MoCRA and Responsible Person', 'Produce a product-specific launch blocker list; do not rely on generic supplier certificates.'),
  makeTask('39', 'Choose post-purchase upsell platform architecture', 'P1', 'CRO/Upsell Agent · Developer Agent', 'Offer research exists; platform path not locked', 'Current Shopify plan, OCU capabilities, SKU readiness and tracking', 'Compare Zipify OCU against the simplest supported path and document the sequence, fees and attribution.'),
  makeTask('40', 'Build a contribution-margin dashboard', 'P1', 'Finance/Analytics Agent · Internal Tools Developer', 'Revenue dashboard requested; profit layer missing', 'Reliable COGS, shipping, payment, refunds and ad spend', 'Report contribution by day, product, bundle, channel and new/returning customer.'),
  makeTask('41', 'Engineer the final US offer after supply proof', 'P1', 'CEO · US Growth Agent · Finance Agent', 'Blocked upstream by supplier gate', 'Samples, compliance, landed cost and shipping SLA', 'Lock real 1/2/3-unit pricing, gift, guarantee and delivery promise before page and ads.'),
];

export const priorityMeta: Record<Priority, { label: string; detail: string; color: string }> = {
  P0: { label: 'Do first', detail: 'Cash, fulfillment, customer access, payment standing, measurement', color: '#ef4444' },
  P1: { label: 'Next revenue sprint', detail: 'High-impact execution after P0 gates', color: '#a855f7' },
  P2: { label: 'Leverage next', detail: 'Useful systems after foundations stabilize', color: '#3b82f6' },
  P3: { label: 'Strategic later', detail: 'Exploratory and longer-horizon work', color: '#71717a' },
};

export function buildAgentPrompt(task: Task) {
  return `You are the ${task.owner} responsible for completing: “${task.title}”.\n\nBusiness context:\nTiger Brands Global is prioritizing revenue, fulfillment reliability, trustworthy measurement, customer protection and payment-account health. The current revenue goal is $5,000 by August 31, 2026.\n\nCurrent state:\n${task.status}\n\nDependencies and constraints:\n${task.dependencies}\n\nYour immediate objective:\n${task.nextAction}\n\nRequired output:\n1. State what you verified from primary sources or live systems.\n2. Separate facts, assumptions, blockers and recommendations.\n3. Produce the smallest safe implementation plan or completed deliverable.\n4. Include exact QA checks and success metrics.\n5. Record files, links, decisions and follow-up actions in the project source of truth.\n\nSafety boundary:\nDo not publish, spend money, contact external parties, change ads, modify the live store, send campaigns or expose secrets unless the CEO explicitly authorizes that action. Unknown data stays UNKNOWN. Preserve existing work and verify every write.`;
}
