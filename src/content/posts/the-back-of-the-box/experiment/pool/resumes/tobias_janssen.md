# Tobias Janssen

Backend Engineer · Amsterdam, Netherlands
tobias.janssen@example.com · github.com/tjanssen-nl · linkedin.com/in/tobias-janssen

## Summary

Backend engineer with 3 years of production experience, currently at a mid-sized B2B SaaS company. Comfortable owning features end-to-end, from schema design through deployment. Looking for a role with a stronger platform engineering culture and more exposure to event-driven systems.

## Experience

### Backend Engineer — Wishbone
*Amsterdam · June 2023 – present*

Wishbone is a mid-sized B2B SaaS company (~80 employees) building reporting and dashboard tooling for finance teams.

- Lead developer on the customer-facing reporting API. Built in Django + Django REST Framework, backed by PostgreSQL.
- Designed and maintained PostgreSQL schemas for three major features (custom-report builder, scheduled exports, audit log). Wrote the migrations, handled the data backfills.
- Improved P95 latency on the slowest reporting endpoint by ~40% through query rewrites and a few targeted indexes.
- Deployed on AWS — RDS for the database, EC2 (managed by an internal platform team) for the application servers, S3 for export artifacts.
- Set up structured JSON logging for the reporting service and the first set of CloudWatch dashboards for it. The on-call team uses these dashboards as the primary view.

### Junior Backend Engineer — Quietpine Devices
*Amsterdam · September 2022 – May 2023*

Small IoT startup (~12 employees) building device-fleet management dashboards.

- Worked on the device-management dashboard (Django + PostgreSQL).
- Helped migrate the deployment from Heroku to AWS (RDS + EC2) over two months.
- Wrote the first version of the device-event ingestion endpoint (synchronous; later rebuilt by someone else as the volume grew).

## Skills

**Languages:** Python (3y)
**Frameworks:** Django, Django REST Framework
**Data:** PostgreSQL (schema design, query tuning, migrations)
**Cloud:** AWS (RDS, EC2, S3, CloudWatch)
**Tooling:** Docker, basic GitHub Actions, structured logging

## Education

BSc Computer Science — University of Amsterdam, 2022

## Other

- Side project: a small CLI tool for running Postgres migrations against local databases in CI (~30 stars, written in Python).
- Volunteer mentor for a beginners-Python course at a local code school (one evening per month).
