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
    video: { label: 'How to Talk Cloud with Non-Technical Stakeholders (18 min)', url: 'https://www.youtube.com/watch?v=M988_fsOSWo' },
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
