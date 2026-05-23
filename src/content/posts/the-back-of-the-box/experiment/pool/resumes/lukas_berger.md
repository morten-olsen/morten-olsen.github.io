# Lukas Berger

Backend Engineer · Berlin, Germany
lukas.berger@example.com · github.com/lberger-dev · linkedin.com/in/lukas-berger-eng

## Summary

Backend engineer with 4 years of production experience, currently at a growth-stage SaaS company. Comfortable across the Python + FastAPI + PostgreSQL + AWS stack, with hands-on experience running an event-driven pipeline in production. Interested in roles where reliability and on-call quality are taken seriously.

## Experience

### Backend Engineer — Lumenpath
*Berlin · April 2023 – present*

Lumenpath provides customer-facing webhook and integration infrastructure for B2B SaaS companies (~150 employees, Series B).

- Own the webhook delivery service: a FastAPI application backed by PostgreSQL and AWS Kinesis. Handles ~2 million customer events per day with at-least-once delivery semantics.
- Led the migration from a synchronous REST-polling integration pattern to an event-driven delivery model. Wrote the design doc, drove the rollout across three customer cohorts, and handled the deprecation of the old endpoints.
- PostgreSQL: built and maintained the schemas for the delivery store; tuned the slowest customer-facing query (cut P95 from 1.8s to 220ms).
- Set up the observability stack for the service: structured JSON logs, Prometheus metrics, Grafana dashboards. Wrote the runbook the on-call team uses.

### Junior Backend Engineer → Backend Engineer — Frostbridge Capital
*Berlin · September 2021 – March 2023*

Fintech startup (~50 employees) building B2B payment reconciliation tools.

- Started on a Flask monolith; led the migration of three internal services to FastAPI as the team grew.
- PostgreSQL — schema work, basic indexing, wrote the first version of the team's migration tooling.
- AWS basics: EC2, RDS, ElasticBeanstalk, S3. Set up the CI pipeline on GitHub Actions.
- Built the first internal admin dashboard end-to-end (FastAPI backend + minimal React frontend).

## Skills

**Languages:** Python (4y), TypeScript (working knowledge from the admin dashboard)
**Frameworks:** FastAPI, Flask
**Data:** PostgreSQL (schema design, query tuning, migrations)
**Messaging:** AWS Kinesis (2y in production)
**Cloud:** AWS (EC2, RDS, ECS, ElastiCache, S3, IAM)
**Observability:** Prometheus, Grafana, structured logging (JSON), basic OpenTelemetry
**Tooling:** Docker, GitHub Actions, basic Terraform

## Education

BSc Computer Science — Technische Universität Berlin, 2021

## Other

- Conference talk at PyCon DE 2024: "Webhook Delivery Is Harder Than You Think" (35 min, recorded).
- Read a lot. Recent good books: *Designing Data-Intensive Applications*, *Database Internals*.
