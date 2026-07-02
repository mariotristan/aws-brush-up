---
name: aws-brush-up-design
description: Design spec for a 2-week AWS brush-up training plan published as a GitHub Pages dashboard
metadata:
  type: project
---

# AWS Brush-Up — Design Spec

**Date:** 2026-07-01  
**Author:** Mario Tristan  
**Repo:** https://github.com/mariotristan/aws-brush-up  
**Published at:** https://mariotristan.github.io/aws-brush-up

---

## Context

Mario is a Delivery Account Manager with a DevOps/SDLC background who needs to refresh foundational AWS knowledge to lead credible client conversations. The goal is not deep technical mastery — it is the ability to discuss AWS services, architecture trade-offs, cost, and security posture fluently in delivery and pre-sales contexts.

**Constraints:**
- 1 hour per day
- 2 weeks (14 days)
- Resources must be free and easy to access (YouTube + official AWS docs)

---

## Site Architecture

**Approach:** Single-page HTML with Tailwind CSS (loaded via CDN). No build step. Progress tracked in browser `localStorage`. Deployed to GitHub Pages via a GitHub Actions workflow on every push to `main`.

**Color scheme:** AWS dark navy `#232F3E` + orange accent `#FF9900`

**File structure:**
```
aws-brush-up/
├── index.html              ← entire site (all content inline)
├── js/
│   └── app.js              ← progress tracking via localStorage
└── .github/
    └── workflows/
        └── pages.yml       ← GitHub Actions: deploy to gh-pages on push to main
```

**UI components:**
- Header with site title, author name, and overall progress counter (`X / 14 days`)
- Animated progress bar that fills as days are marked complete
- Week 1 / Week 2 tab switcher
- Day cards (grid layout) each containing:
  - Day number + topic title
  - One-line description of why it matters for client conversations
  - Video link (YouTube or AWS official) with estimated duration
  - Reading link (AWS docs or AWS blog) with estimated time
  - Key takeaways (3 bullet points, visible inline)
  - "Mark complete" button — toggles card to a completed state (green check, muted styling)
- Completed cards persist across page reloads via `localStorage`
- All links open in a new tab (`target="_blank"`)

---

## Training Curriculum

### Week 1 — Core Services & Mental Models

| Day | Topic | Goal |
|-----|-------|------|
| 1 | AWS Global Infrastructure | Explain regions, AZs, edge locations; answer "where is my data?" |
| 2 | IAM — Identity, Roles, Policies | Understand authentication vs authorization; speak to least-privilege |
| 3 | Compute — EC2 vs Lambda vs Containers | Know when clients use each; explain serverless vs managed infra |
| 4 | Storage — S3, EBS, EFS, Glacier | Discuss data tiering, durability, and cost implications |
| 5 | Networking — VPC, Subnets, Security Groups, Route 53 | Discuss connectivity, isolation, hybrid cloud options |
| 6 | Databases — RDS, DynamoDB, Aurora, ElastiCache | Know relational vs NoSQL trade-offs; handle client DB opinions |
| 7 | Shared Responsibility Model + Week 1 Review | Core to all security and compliance conversations |

### Week 2 — Architecture, Cost & Modern Patterns

| Day | Topic | Goal |
|-----|-------|------|
| 8 | Well-Architected Framework (6 pillars) | The lens AWS-savvy clients use to evaluate architecture |
| 9 | Cost & FinOps — Billing, Cost Explorer, Savings Plans | Answer cost questions; discuss optimization levers |
| 10 | Security & Compliance — CloudTrail, GuardDuty, Security Hub | Speak to audit, threat detection, compliance posture |
| 11 | Modern Patterns — Serverless, Event-driven, Microservices | Discuss modernization approach with clients |
| 12 | AI/ML Services — Bedrock, SageMaker, Amazon Q | Engage credibly on the AI topics every client brings up now |
| 13 | Migration & Modernization — 7Rs, Migration Hub | Slalom delivery context: frame migration conversations |
| 14 | How to talk about AWS in client meetings + Final Review | Synthesis: translate knowledge into client-facing language |

### Resource format per day
Each day card includes:
- **Video:** AWS re:Invent talk, AWS official YouTube, or freeCodeCamp AWS content (~20-30 min)
- **Reading:** AWS official documentation page or AWS blog post (~20-30 min)
- **Key takeaways:** 3 bullet points pre-written to capture the client-conversation-ready insight

---

## GitHub Actions Deploy

On every push to `main`, the workflow copies the repo contents to the `gh-pages` branch. GitHub Pages serves from `gh-pages`. No build step — files are served as-is.

```yaml
# .github/workflows/pages.yml
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

---

## Success Criteria

- Site is live at `https://mariotristan.github.io/aws-brush-up` after first push
- All 14 day cards render with working links
- Checking a day off persists after page reload
- Progress bar reflects completed days accurately
- Site is readable on mobile (Tailwind responsive classes)
