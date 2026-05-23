# Tobias Janssen

Backend Engineer · Amsterdam, Netherlands
tobias.janssen@example.com · github.com/tjanssen-nl · linkedin.com/in/tobias-janssen

## Summary

Three years of professional backend engineering experience. Currently employed at a mid-sized B2B SaaS company in Amsterdam. End-to-end ownership of feature development from schema design through production deployment. Seeking a position with greater platform engineering depth and exposure to event-driven systems.

## Experience

### Backend Engineer — Wishbone
*Amsterdam · June 2023 – present*

Wishbone is a B2B SaaS company (approximately 80 employees) providing reporting and dashboard tooling for finance teams.

- Lead developer responsible for the customer-facing reporting API, implemented in Django and Django REST Framework with PostgreSQL backing.
- Designed and maintained PostgreSQL schemas for three product features (custom-report builder, scheduled exports, audit log), including the corresponding migrations and data backfills.
- Reduced P95 latency on the slowest reporting endpoint by approximately 40 percent via query rewrites and targeted indexing.
- Production deployment on AWS infrastructure: RDS for the database, EC2 (managed by an internal platform team) for application servers, S3 for export artifacts.
- Implemented structured JSON logging for the reporting service and the initial CloudWatch dashboard set, which the on-call team uses as the primary operational view.

### Junior Backend Engineer — Quietpine Devices
*Amsterdam · September 2022 – May 2023*

Quietpine Devices is a small IoT startup (approximately 12 employees) producing device-fleet management dashboards.

- Contributed to the device-management dashboard, implemented in Django and PostgreSQL.
- Participated in the migration of deployment infrastructure from Heroku to AWS (RDS and EC2) over a two-month period.
- Authored the initial version of the device-event ingestion endpoint, which was later replaced by a subsequent implementation as throughput requirements increased.

## Skills

**Languages:** Python (3 years)
**Frameworks:** Django, Django REST Framework
**Data:** PostgreSQL (schema design, query tuning, migrations)
**Cloud:** AWS (RDS, EC2, S3, CloudWatch)
**Tooling:** Docker, GitHub Actions, structured logging

## Education

BSc Computer Science — University of Amsterdam, 2022

## Other

- Maintains a CLI tool for running PostgreSQL migrations against local databases in CI (approximately 30 stars on GitHub, Python implementation).
- Volunteer instructor at a local code school, contributing to introductory Python coursework on a monthly basis.
