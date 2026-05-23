# Felix Bauer

Backend Engineer · Hamburg, Germany
felix.bauer@example.com · github.com/fbauer-hh · linkedin.com/in/felix-bauer-dev

## Summary

Backend engineer with 4 years of experience, all at the same early-stage company. Built a product from MVP to ~5,000 active users alongside a small team. Comfortable owning broad surface area; looking for a role where I can go deeper on specific systems rather than wider on everything.

## Experience

### Backend Engineer — Stenbloom Tech
*Hamburg · October 2021 – present*

Stenbloom is a small startup (~15 employees) building scheduling and resource-management software for trade contractors.

- Joined as the second backend engineer; have been the primary maintainer of the Django monolith since the original founder-engineer left.
- Built the entire customer-facing API (Django + Django REST Framework) and the matching admin dashboard. The product runs the day-to-day operations of about 5,000 active users across 200 customers.
- PostgreSQL — schema design, migrations, wrote the data model that backs the scheduling engine. Most queries are CRUD; a few reporting queries needed indexing work.
- Deployed on GCP (Cloud Run + Cloud SQL + GCS for file uploads). Set up the GitHub Actions CI pipeline.
- Built the integration with the payment provider (Stripe) including the webhook handler. Used GCP Pub/Sub lightly to decouple some of the slower webhook processing from the request path.
- Owned the application logging — stdout to GCP Cloud Logging. No tracing or metrics stack yet; that's been on the roadmap for a while.

## Skills

**Languages:** Python (4y), JavaScript / Vue.js (some frontend work — building the admin dashboard's UI early on)
**Frameworks:** Django, Django REST Framework
**Data:** PostgreSQL (CRUD-heavy; some indexing, some perf work)
**Cloud:** GCP (Cloud Run, Cloud SQL, GCS, Pub/Sub light usage)
**Tooling:** Docker, GitHub Actions, basic Terraform
**Other:** Stripe integration, Sentry for error tracking

## Education

BSc Software Engineering — Hochschule für Angewandte Wissenschaften Hamburg, 2020

## Other

- I'm the only person at Stenbloom who's been on call from day one. Have a lot of opinions about pager hygiene.
