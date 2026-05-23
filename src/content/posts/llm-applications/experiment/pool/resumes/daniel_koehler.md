# Daniel Köhler

Senior Backend Engineer · Munich, Germany
daniel.koehler@example.com · github.com/dkoehler-eng · linkedin.com/in/daniel-koehler-de

## Summary

Backend engineer with 5 years of production experience building platform services for B2B SaaS. Comfortable owning a service end-to-end, from design discussion through on-call. Strongest on Python + FastAPI, PostgreSQL at scale, and event-driven systems on AWS. Care about reliability and observability — they're not afterthoughts.

## Experience

### Senior Backend Engineer — Orelogic
*Munich · January 2022 – present*

Orelogic builds workflow tooling for mid-market operations teams (~200 employees, post-Series B). I joined the platform team and have stayed there.

- Own the core internal API used by 50+ engineers across product teams. Migrated it from Flask to FastAPI over six months without a customer-visible incident.
- Designed and rolled out partitioned PostgreSQL tables for the events store, now holding ~3 billion rows. Wrote the migration playbook the rest of engineering follows for similar work.
- Built and operate the multi-tenant Kafka pipeline (currently ~100k events/sec at peak), including the consumer-side framework that other teams build on.
- Defined SLOs for six critical services and the alerting hierarchy that backs them. Reduced false-positive pages by ~70% in the first quarter after rollout.
- OpenTelemetry tracing + Datadog metrics + structured logs (JSON). Wrote the team's internal handbook on how to instrument a new service.
- Mentored two junior engineers through their first year; led platform-team code review.

### Backend Engineer — Kettlebrook Analytics
*Berlin · September 2019 – December 2021*

Early-stage analytics startup (~10 people when I joined, ~25 when I left).

- Built the analytics ingestion pipeline (RabbitMQ → Python workers → PostgreSQL). Owned it through three orders of magnitude of throughput growth.
- Designed the multi-tenant data model and wrote the first generation of customer-facing query endpoints in Django REST Framework.
- Set up the CI/CD pipeline on GitHub Actions and the AWS infrastructure (ECS, RDS, Lambda). Wrote the first version of the Terraform.

## Skills

**Languages:** Python (5y), some Go (1y on side projects)
**Frameworks:** FastAPI, Django, Django REST Framework, Flask
**Data:** PostgreSQL (schema design, partitioning, query tuning, logical replication), Redis
**Messaging:** Kafka (3y in production), RabbitMQ
**Cloud:** AWS (ECS, RDS, Lambda, CloudWatch, S3, IAM), Terraform
**Observability:** OpenTelemetry, Datadog, Prometheus, structured logging
**Tooling:** Docker, GitHub Actions, Linux administration

## Open Source

- Two merged PRs to `opentelemetry-python-contrib` (instrumentation for an async PostgreSQL driver).
- Maintain a small library for testing FastAPI applications against a real Postgres in CI (~400 stars).

## Education

MSc Computer Science — Technische Universität München, 2019
