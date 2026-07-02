# AWS Brush-Up GitHub Pages Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a polished GitHub Pages dashboard for a 14-day AWS training plan with per-day progress tracking persisted in localStorage.

**Architecture:** Single `index.html` with Tailwind CSS via CDN, a small `js/app.js` for progress logic, and a GitHub Actions workflow that auto-deploys the repo to GitHub Pages on every push to `main`.

**Tech Stack:** HTML5, Tailwind CSS (CDN), vanilla JavaScript (ES6), GitHub Actions (`peaceiris/actions-gh-pages@v4`)

## Global Constraints

- No build step — files must be served as static assets with no compilation required
- All external links open in `target="_blank" rel="noopener noreferrer"`
- Color palette: background dark navy `#232F3E`, accent orange `#FF9900`, text white `#FFFFFF`
- Progress state stored under localStorage key `aws-brush-up-progress` as a JSON array of completed day numbers
- All 14 days must render; Week 1 = days 1–7, Week 2 = days 8–14
- GitHub repo: `mariotristan/aws-brush-up`; Pages URL: `https://mariotristan.github.io/aws-brush-up`

---

### Task 1: Project scaffold and GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/pages.yml`
- Create: `.gitignore`

**Interfaces:**
- Produces: working auto-deploy to `gh-pages` branch on every push to `main`

- [ ] **Step 1: Create `.gitignore`**

Create `/Users/mariotristan/code/personal/aws-brush-up/.gitignore` with this content:

```
.DS_Store
*.log
node_modules/
```

- [ ] **Step 2: Create the GitHub Actions workflow**

Create `/Users/mariotristan/code/personal/aws-brush-up/.github/workflows/pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
          exclude_assets: '.github,docs'
```

- [ ] **Step 3: Connect local repo to GitHub remote**

```bash
cd /Users/mariotristan/code/personal/aws-brush-up
git remote add origin https://github.com/mariotristan/aws-brush-up.git
```

- [ ] **Step 4: Commit scaffold files**

```bash
git add .gitignore .github/
git commit -m "feat: add GitHub Actions deploy workflow"
```

- [ ] **Step 5: Push to GitHub**

```bash
git push -u origin main
```

Expected: GitHub Actions run triggers; after ~1 min a `gh-pages` branch appears in the repo. Go to repo Settings → Pages → set Source to `gh-pages` branch, `/ (root)`.

---

### Task 2: Progress tracking module (`js/app.js`)

**Files:**
- Create: `js/app.js`

**Interfaces:**
- Produces:
  - `AppProgress.getCompleted()` → `number[]` (array of completed day numbers, e.g. `[1, 3, 5]`)
  - `AppProgress.toggle(day: number)` → `void` (adds or removes day from completed set, fires `'progress-changed'` CustomEvent on `document`)
  - `AppProgress.isCompleted(day: number)` → `boolean`
  - `AppProgress.completedCount()` → `number`

- [ ] **Step 1: Create `js/app.js`**

Create `/Users/mariotristan/code/personal/aws-brush-up/js/app.js`:

```js
const STORAGE_KEY = 'aws-brush-up-progress';

const AppProgress = {
  getCompleted() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  },

  isCompleted(day) {
    return this.getCompleted().includes(day);
  },

  completedCount() {
    return this.getCompleted().length;
  },

  toggle(day) {
    const completed = this.getCompleted();
    const idx = completed.indexOf(day);
    if (idx === -1) {
      completed.push(day);
    } else {
      completed.splice(idx, 1);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    document.dispatchEvent(new CustomEvent('progress-changed'));
  },
};
```

- [ ] **Step 2: Verify in browser console (manual)**

Open any HTML file with `<script src="js/app.js"></script>` in a browser, open DevTools console, and run:

```js
AppProgress.toggle(1);         // should store [1]
AppProgress.isCompleted(1);    // true
AppProgress.completedCount();  // 1
AppProgress.toggle(1);         // should remove, store []
AppProgress.isCompleted(1);    // false
```

- [ ] **Step 3: Commit**

```bash
git add js/app.js
git commit -m "feat: add localStorage progress tracking module"
```

---

### Task 3: Main `index.html` — shell, header, progress bar, and tab switcher

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: `AppProgress` from `js/app.js`
- Produces: rendered page shell; `updateProgress()` global function that reads `AppProgress.completedCount()` and updates the progress bar and counter

- [ ] **Step 1: Create `index.html` with shell, header, and progress bar**

Create `/Users/mariotristan/code/personal/aws-brush-up/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AWS Brush-Up — Mario Tristan</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            aws: { navy: '#232F3E', orange: '#FF9900', dark: '#1a2332' }
          }
        }
      }
    }
  </script>
  <style>
    body { background-color: #232F3E; }
    .card-done { opacity: 0.6; }
    .tab-active { border-bottom: 3px solid #FF9900; color: #FF9900; }
  </style>
</head>
<body class="text-white min-h-screen font-sans">

  <!-- Header -->
  <header class="bg-aws-dark border-b border-white/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">
        <span class="text-aws-orange">AWS</span> Brush-Up
      </h1>
      <p class="text-white/60 text-sm">Mario Tristan · 2-Week Training Plan</p>
    </div>
    <div class="text-right">
      <p class="text-sm text-white/60 mb-1"><span id="count">0</span> / 14 days completed</p>
      <div class="w-48 bg-white/10 rounded-full h-3">
        <div id="progress-bar" class="bg-aws-orange h-3 rounded-full transition-all duration-500" style="width: 0%"></div>
      </div>
    </div>
  </header>

  <!-- Tab switcher -->
  <nav class="bg-aws-dark border-b border-white/10 px-6 flex gap-8">
    <button id="tab-week1" onclick="showWeek(1)"
      class="py-4 text-sm font-semibold uppercase tracking-wider tab-active transition-colors">
      Week 1 — Core Services
    </button>
    <button id="tab-week2" onclick="showWeek(2)"
      class="py-4 text-sm font-semibold uppercase tracking-wider text-white/50 hover:text-white transition-colors">
      Week 2 — Architecture &amp; Patterns
    </button>
  </nav>

  <!-- Day card grids -->
  <main class="max-w-6xl mx-auto px-4 py-8">
    <div id="week1" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"></div>
    <div id="week2" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 hidden"></div>
  </main>

  <script src="js/app.js"></script>
  <script src="js/days.js"></script>
  <script>
    function showWeek(n) {
      document.getElementById('week1').classList.toggle('hidden', n !== 1);
      document.getElementById('week2').classList.toggle('hidden', n !== 2);
      document.getElementById('tab-week1').classList.toggle('tab-active', n === 1);
      document.getElementById('tab-week1').classList.toggle('text-white/50', n !== 1);
      document.getElementById('tab-week2').classList.toggle('tab-active', n === 2);
      document.getElementById('tab-week2').classList.toggle('text-white/50', n !== 2);
    }

    function updateProgress() {
      const n = AppProgress.completedCount();
      document.getElementById('count').textContent = n;
      document.getElementById('progress-bar').style.width = `${(n / 14) * 100}%`;
    }

    document.addEventListener('progress-changed', updateProgress);
    updateProgress();
  </script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify**

Open `index.html` directly in a browser (file://). You should see:
- Dark navy background
- Header with "AWS Brush-Up" and orange accent
- Progress bar at 0%
- Two tabs (Week 1 active)
- Empty card grids (days.js doesn't exist yet — that's fine)

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add page shell with header, progress bar, and tab switcher"
```

---

### Task 4: Day data and card rendering (`js/days.js`)

**Files:**
- Create: `js/days.js`

**Interfaces:**
- Consumes: `AppProgress` from `js/app.js`; DOM containers `#week1` and `#week2` from `index.html`; `updateProgress()` from `index.html`
- Produces: 14 rendered day cards injected into `#week1` / `#week2`; each card has a "Mark complete" button wired to `AppProgress.toggle(day)`

- [ ] **Step 1: Create `js/days.js` with all 14 days data and card renderer**

Create `/Users/mariotristan/code/personal/aws-brush-up/js/days.js`:

```js
const DAYS = [
  // Week 1
  {
    day: 1, week: 1,
    title: 'AWS Global Infrastructure',
    why: 'Answer "where is my data?" and explain regions, AZs, and edge locations.',
    video: { label: 'AWS Global Infrastructure Overview (25 min)', url: 'https://www.youtube.com/watch?v=RPis5mbM8c8' },
    reading: { label: 'AWS Regions & Availability Zones (AWS Docs)', url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/global-infrastructure.html' },
    takeaways: [
      'Regions are independent geographic areas; AZs are isolated data centers within a region.',
      'Clients choose regions based on latency, compliance, and service availability.',
      'Edge locations (CloudFront) bring content closer to end users globally.',
    ],
  },
  {
    day: 2, week: 1,
    title: 'IAM — Identity & Access',
    why: 'Foundation of every security conversation: who can do what, and how is it controlled.',
    video: { label: 'AWS IAM Core Concepts (30 min)', url: 'https://www.youtube.com/watch?v=ExjW3HCFG1U' },
    reading: { label: 'IAM Best Practices (AWS Docs)', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html' },
    takeaways: [
      'IAM controls authentication (who you are) and authorization (what you can do).',
      'Least-privilege principle: grant only the permissions needed, nothing more.',
      'Roles are preferred over users for service-to-service access — no long-lived credentials.',
    ],
  },
  {
    day: 3, week: 1,
    title: 'Compute — EC2, Lambda, Containers',
    why: 'Clients always debate VMs vs serverless vs containers — know the trade-offs.',
    video: { label: 'AWS Compute Services Explained (28 min)', url: 'https://www.youtube.com/watch?v=iHX-jtKIVNA' },
    reading: { label: 'Choosing the Right Compute Option (AWS Blog)', url: 'https://aws.amazon.com/blogs/compute/choosing-between-aws-compute-options/' },
    takeaways: [
      'EC2: full control, you manage OS and scaling. Best when you need specific hardware or long-running workloads.',
      'Lambda: run code without servers, pay per execution. Best for event-driven, short-lived tasks.',
      'ECS/EKS: container orchestration. Best when teams are already container-native.',
    ],
  },
  {
    day: 4, week: 1,
    title: 'Storage — S3, EBS, EFS, Glacier',
    why: 'Data residency, durability, and cost tiering questions come up in every engagement.',
    video: { label: 'AWS Storage Services Overview (25 min)', url: 'https://www.youtube.com/watch?v=6vNC_BCqFmY' },
    reading: { label: 'S3 Storage Classes (AWS Docs)', url: 'https://aws.amazon.com/s3/storage-classes/' },
    takeaways: [
      'S3: object storage, 11 nines durability, globally accessible. The default for unstructured data.',
      'EBS: block storage attached to EC2, like a virtual hard drive.',
      'Glacier: archive storage, retrieval takes minutes to hours — lowest cost for cold data.',
    ],
  },
  {
    day: 5, week: 1,
    title: 'Networking — VPC, Subnets, Security Groups',
    why: 'Needed for hybrid cloud, connectivity, and isolation conversations.',
    video: { label: 'AWS VPC Fundamentals (30 min)', url: 'https://www.youtube.com/watch?v=bGDMeD6kOz0' },
    reading: { label: 'VPC Getting Started (AWS Docs)', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-getting-started.html' },
    takeaways: [
      'A VPC is your private network within AWS — you control IP ranges, subnets, and routing.',
      'Public subnets have internet access; private subnets do not (use NAT Gateway for egress).',
      'Security Groups are stateful firewalls at the instance level; NACLs operate at the subnet level.',
    ],
  },
  {
    day: 6, week: 1,
    title: 'Databases — RDS, DynamoDB, Aurora',
    why: 'Know relational vs NoSQL trade-offs; clients have strong DB opinions.',
    video: { label: 'AWS Database Services Overview (25 min)', url: 'https://www.youtube.com/watch?v=a9__D53WsUs' },
    reading: { label: 'Choosing the Right Database (AWS Docs)', url: 'https://aws.amazon.com/products/databases/' },
    takeaways: [
      'RDS: managed relational DB (MySQL, Postgres, SQL Server). You pick the engine, AWS manages patches and backups.',
      'DynamoDB: fully managed NoSQL, single-digit millisecond latency at any scale.',
      'Aurora: AWS-native relational DB, up to 5x faster than standard MySQL, serverless option available.',
    ],
  },
  {
    day: 7, week: 1,
    title: 'Shared Responsibility Model',
    why: 'Core to every security, compliance, and audit conversation with clients.',
    video: { label: 'AWS Shared Responsibility Model (20 min)', url: 'https://www.youtube.com/watch?v=U632-ND7dKQ' },
    reading: { label: 'Shared Responsibility Model (AWS)', url: 'https://aws.amazon.com/compliance/shared-responsibility-model/' },
    takeaways: [
      'AWS is responsible "of" the cloud: hardware, facilities, global network.',
      'Customers are responsible "in" the cloud: data, IAM, OS patching, app security.',
      'The line shifts depending on the service — Lambda shifts more to AWS than EC2.',
    ],
  },
  // Week 2
  {
    day: 8, week: 2,
    title: 'Well-Architected Framework',
    why: 'The lens AWS-savvy clients use to evaluate and communicate architecture quality.',
    video: { label: 'AWS Well-Architected Framework (30 min)', url: 'https://www.youtube.com/watch?v=MfxF-FYEFjY' },
    reading: { label: 'Well-Architected Framework Whitepaper (AWS)', url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html' },
    takeaways: [
      '6 pillars: Operational Excellence, Security, Reliability, Performance, Cost Optimization, Sustainability.',
      'The Well-Architected Tool lets clients formally review their workloads against the pillars.',
      'Knowing the pillars helps you frame delivery risks in language clients and AWS teams recognize.',
    ],
  },
  {
    day: 9, week: 2,
    title: 'Cost & FinOps',
    why: 'Delivery leads get asked about cloud cost constantly — know the levers.',
    video: { label: 'AWS Cost Optimization Strategies (25 min)', url: 'https://www.youtube.com/watch?v=XHq0v_QDXOQ' },
    reading: { label: 'AWS Cost Management (AWS Docs)', url: 'https://docs.aws.amazon.com/cost-management/latest/userguide/what-is-costmanagement.html' },
    takeaways: [
      'On-Demand vs Reserved vs Savings Plans vs Spot: know the spectrum from flexible-expensive to committed-cheap.',
      'Cost Explorer and Budgets help teams visualize and alert on spend.',
      'Tagging strategy is foundational to FinOps — without tags, cost attribution is impossible.',
    ],
  },
  {
    day: 10, week: 2,
    title: 'Security & Compliance',
    why: 'Speak to threat detection, audit trails, and compliance posture in client conversations.',
    video: { label: 'AWS Security Services Overview (28 min)', url: 'https://www.youtube.com/watch?v=N4DdqAkeqD4' },
    reading: { label: 'AWS Security Best Practices (AWS Whitepaper)', url: 'https://docs.aws.amazon.com/whitepapers/latest/introduction-aws-security/security-of-the-aws-infrastructure.html' },
    takeaways: [
      'CloudTrail: every API call logged — who did what, when, from where. Essential for audits.',
      'GuardDuty: intelligent threat detection using ML — finds unusual account behavior automatically.',
      'AWS Artifact provides compliance reports (SOC 2, ISO, PCI) that clients can download for audits.',
    ],
  },
  {
    day: 11, week: 2,
    title: 'Modern Patterns — Serverless & Microservices',
    why: 'Frame modernization conversations: monolith vs microservices, event-driven architectures.',
    video: { label: 'Serverless Architecture on AWS (25 min)', url: 'https://www.youtube.com/watch?v=EBSdyoO3goc' },
    reading: { label: 'Serverless on AWS (AWS Docs)', url: 'https://aws.amazon.com/serverless/' },
    takeaways: [
      'Serverless = no server management, auto-scaling, pay-per-use. Lambda + API Gateway + DynamoDB is the classic stack.',
      'Event-driven architectures use SNS/SQS/EventBridge to decouple services and improve resilience.',
      'Microservices trade operational simplicity for independent deployability and team autonomy.',
    ],
  },
  {
    day: 12, week: 2,
    title: 'AI & ML Services — Bedrock, SageMaker, Q',
    why: 'Every client conversation touches AI right now — engage credibly on AWS AI services.',
    video: { label: 'AWS Generative AI Services Overview (25 min)', url: 'https://www.youtube.com/watch?v=C-9m7aq8L0s' },
    reading: { label: 'Amazon Bedrock Overview (AWS)', url: 'https://aws.amazon.com/bedrock/' },
    takeaways: [
      'Amazon Bedrock: access foundation models (Claude, Llama, Titan) via API with no ML expertise needed.',
      'SageMaker: full ML platform for teams building and training custom models.',
      'Amazon Q: AI assistant embedded in AWS services and IDEs — positioned as "AI for the enterprise."',
    ],
  },
  {
    day: 13, week: 2,
    title: 'Migration & Modernization — The 7 Rs',
    why: 'Slalom delivery context: most clients are mid-migration. Know the framework.',
    video: { label: 'AWS Migration Strategies — The 7 Rs (20 min)', url: 'https://www.youtube.com/watch?v=id-PY0GBHXA' },
    reading: { label: '7 Rs Migration Strategies (AWS Docs)', url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-retiring-applications/apg-gloss.html' },
    takeaways: [
      '7 Rs: Retire, Retain, Rehost (lift & shift), Relocate, Replatform, Repurchase, Refactor.',
      'Most migrations start with Rehost (speed) and evolve to Replatform/Refactor (value).',
      'Migration Hub and Database Migration Service are AWS\'s main tooling for tracking and executing migrations.',
    ],
  },
  {
    day: 14, week: 2,
    title: 'Talking AWS in Client Meetings',
    why: 'The synthesis day — turn two weeks of knowledge into client-ready language.',
    video: { label: 'How to Talk Cloud with Business Stakeholders (20 min)', url: 'https://www.youtube.com/watch?v=a9__D53WsUs' },
    reading: { label: 'AWS Executive Insights (AWS Blog)', url: 'https://aws.amazon.com/executive-insights/' },
    takeaways: [
      'Lead with business outcomes, not service names: "resilient" not "multi-AZ", "cost-optimized" not "Savings Plans".',
      'Use the Well-Architected pillars as a vocabulary shared between you, the client, and AWS teams.',
      'When in doubt, ask "what outcome are you optimizing for?" — it reframes any technical debate.',
    ],
  },
];

function renderCard(data) {
  const done = AppProgress.isCompleted(data.day);
  return `
    <div id="card-${data.day}" class="rounded-xl border ${done ? 'border-green-500/40 card-done' : 'border-white/10'} bg-white/5 p-5 flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-widest text-aws-orange">Day ${data.day}</span>
        ${done ? '<span class="text-green-400 text-lg">✓</span>' : ''}
      </div>
      <h2 class="text-base font-bold leading-snug">${data.title}</h2>
      <p class="text-xs text-white/60 leading-relaxed">${data.why}</p>

      <div class="flex flex-col gap-2 mt-1">
        <a href="${data.video.url}" target="_blank" rel="noopener noreferrer"
          class="flex items-center gap-2 text-xs text-white/80 hover:text-aws-orange transition-colors">
          <span>📹</span><span class="underline underline-offset-2">${data.video.label}</span>
        </a>
        <a href="${data.reading.url}" target="_blank" rel="noopener noreferrer"
          class="flex items-center gap-2 text-xs text-white/80 hover:text-aws-orange transition-colors">
          <span>📄</span><span class="underline underline-offset-2">${data.reading.label}</span>
        </a>
      </div>

      <div class="mt-1 border-t border-white/10 pt-3">
        <p class="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Key Takeaways</p>
        <ul class="flex flex-col gap-1">
          ${data.takeaways.map(t => `<li class="text-xs text-white/70 flex gap-2"><span class="text-aws-orange shrink-0">›</span><span>${t}</span></li>`).join('')}
        </ul>
      </div>

      <button
        onclick="toggleDay(${data.day})"
        class="mt-auto rounded-lg px-3 py-2 text-xs font-semibold transition-colors
          ${done ? 'bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400' : 'bg-aws-orange/20 text-aws-orange hover:bg-aws-orange hover:text-black'}">
        ${done ? 'Mark incomplete' : 'Mark complete'}
      </button>
    </div>
  `;
}

function toggleDay(day) {
  AppProgress.toggle(day);
  const data = DAYS.find(d => d.day === day);
  const container = document.getElementById(`card-${day}`);
  container.outerHTML = renderCard(data);
  // re-attach event (outerHTML swap loses reference, but onclick is inline so it re-evaluates)
}

function renderAllDays() {
  const week1 = document.getElementById('week1');
  const week2 = document.getElementById('week2');
  week1.innerHTML = DAYS.filter(d => d.week === 1).map(renderCard).join('');
  week2.innerHTML = DAYS.filter(d => d.week === 2).map(renderCard).join('');
}

renderAllDays();
```

- [ ] **Step 2: Open `index.html` in browser and verify**

- Both week tabs show 7 day cards each
- Cards display title, why-it-matters text, video link, reading link, and 3 takeaways
- Clicking "Mark complete" toggles the card to green with a checkmark
- Refreshing the page preserves completed state
- Progress bar and counter update when days are marked

- [ ] **Step 3: Commit**

```bash
git add js/days.js
git commit -m "feat: add 14-day curriculum data and card renderer"
```

---

### Task 5: Push, verify deploy, and enable GitHub Pages

**Files:** no new files

- [ ] **Step 1: Push all commits to GitHub**

```bash
git push origin main
```

- [ ] **Step 2: Watch GitHub Actions run**

Go to `https://github.com/mariotristan/aws-brush-up/actions` — you should see a workflow run called "Deploy to GitHub Pages" in progress or completed.

- [ ] **Step 3: Enable GitHub Pages (one-time)**

Go to `https://github.com/mariotristan/aws-brush-up/settings/pages`:
- Source: **Deploy from a branch**
- Branch: `gh-pages` / `/ (root)`
- Click **Save**

- [ ] **Step 4: Verify live site**

Wait ~60 seconds, then open `https://mariotristan.github.io/aws-brush-up`.

Expected:
- Site loads with dark navy background and orange AWS branding
- All 14 days render across two weeks
- Links work (open in new tab)
- Marking a day complete persists on reload
- Progress bar fills correctly

- [ ] **Step 5: Final commit (update README)**

Create `/Users/mariotristan/code/personal/aws-brush-up/README.md`:

```markdown
# AWS Brush-Up

A 2-week AWS training plan for delivery leaders. Published at https://mariotristan.github.io/aws-brush-up
```

```bash
git add README.md
git commit -m "docs: add README with live site link"
git push origin main
```
