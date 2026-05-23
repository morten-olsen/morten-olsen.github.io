# Tobias Janssen

Backend Engineer · Amsterdam, Netherlands
tobias.janssen@example.com · github.com/tjanssen-nl · linkedin.com/in/tobias-janssen

## Summary

Hi — I'm a backend engineer with three years of production experience, currently building at a mid-sized B2B SaaS company. I love owning features end-to-end, from sketching out the schema to seeing it ship and serve real customers. I'm looking for my next chapter at a team with a stronger platform engineering culture, where I can dig deeper into event-driven systems.

## Experience

### Backend Engineer — Wishbone
*Amsterdam · June 2023 – present*

I joined Wishbone — a mid-sized B2B SaaS company with about 80 people, building reporting and dashboard tooling for finance teams — two years ago.

- I'm the lead developer on our customer-facing reporting API. I built it in Django + Django REST Framework on PostgreSQL, and I really enjoy the depth that stack gives me to do interesting things at the data layer.
- I designed and maintained the PostgreSQL schemas for three of our biggest features — the custom-report builder, scheduled exports, and the audit log. I wrote all the migrations and handled the data backfills myself, which taught me a lot about the operational side of databases.
- I improved P95 latency on our slowest reporting endpoint by ~40% through query rewrites and a few targeted indexes — one of the most satisfying performance wins I've had.
- I deploy on AWS: RDS for the database, EC2 (managed by a platform team I work closely with) for the application servers, and S3 for export artifacts.
- I set up structured JSON logging for the reporting service and built our first CloudWatch dashboards from scratch. They're now the primary view our on-call team uses, which I'm proud of.

### Junior Backend Engineer — Quietpine Devices
*Amsterdam · September 2022 – May 2023*

My first job out of university was at Quietpine — a small IoT startup (about 12 people) building device-fleet management dashboards. A great place to learn.

- I worked on the device-management dashboard (Django + PostgreSQL), which was my introduction to building real production software.
- I helped migrate our deployment from Heroku to AWS (RDS + EC2) over a couple of months — it was a stretch project but I learned a ton.
- I wrote the first version of the device-event ingestion endpoint. It was synchronous, and someone else ended up rebuilding it as the volume grew — still proud of getting it out the door.

## Skills

**Languages:** Python (3 years)
**Frameworks:** Django, Django REST Framework
**Data:** PostgreSQL (schema design, query tuning, migrations)
**Cloud:** AWS (RDS, EC2, S3, CloudWatch)
**Tooling:** Docker, GitHub Actions, structured logging

## Education

BSc Computer Science — University of Amsterdam, 2022

## Other

- I maintain a small CLI tool for running Postgres migrations against local databases in CI — about 30 stars on GitHub. Python, of course.
- I volunteer once a month as a mentor for a beginners-Python course at a local code school. It keeps me honest about explaining things clearly.
