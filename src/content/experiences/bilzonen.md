---
company:
  name: BilZonen
position:
  name: Web Developer
startDate: 2010-06-01
endDate: 2012-02-28
summary: Early professional developer role on bilzonen.dk, moving from hobby development into long-lived product work across .NET, Umbraco, data integrations, mobile web, and deployment tooling.
slug: bilzonen-1
stack:
- .NET
- UmbracoCMS
---

BilZonen was where programming started becoming professional practice for me. I had written code before, including a short period at a small agency, but this was the first place where I felt the difference between finishing a project and living with a product.

BilZonen was the smaller alternative to BilBasen in the Danish used-car market, and the team was small enough that the product felt close to everyone. I worked part-time on the Umbraco-based .NET platform, picking up work from a shared FogBugz board across maintenance, search, data integrations, a jQuery Mobile site, catalogue work, and dealer-facing features.

The most consuming project was a provider migration for BilZonen's car-data catalogue. The old implementation was tangled deeply into the site, and understanding the replacement meant mapping a large relational database into an almost table-like frontend. I remember printing the relationship diagram in a tiny font and still ending up with around 30 pages taped together on the wall.

That project also gave me one of my first real lessons in maintainability. Umbraco 4's XSLT-based development involved a lot of boilerplate, so young and optimistic, I built a custom templating approach based on a heroic amount of string concatenation. It worked, and it was fast and stable, but it did not make the system easier to maintain. I had to live with that decision afterward, and so did my colleagues.

I also helped improve how we shipped software. When I started, deployments were done by overwriting files on the production server over FTP, which had already caused outages when the wrong files were replaced. I got a budget for a computer, turned it into a TeamCity build server, and helped move the team toward an actual CI/CD pipeline.

Looking back, BilZonen gave me an early awareness of the cost of cumbersome tooling and missing seams in a system. Bad tooling wastes time, weak deployment practices make mistakes too easy, and a messy implementation is much easier to replace if the right interface exists around it.
