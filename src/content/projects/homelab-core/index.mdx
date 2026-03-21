---
slug: homelab-core
name: Homelab Core
description: A Kubernetes-based homelab infrastructure stack using Helm charts and ArgoCD for GitOps-driven home server management.
repo: https://github.com/morten-olsen/homelab-core
stack:
  - Kubernetes
  - Helm
  - ArgoCD
  - Terraform
  - Istio
  - Prometheus
  - Grafana
  - cert-manager
status: active
---

Homelab Core is the infrastructure backbone for my home server setup. It uses Kubernetes with Helm charts orchestrated by ArgoCD, following a GitOps workflow where the cluster state is defined entirely in code.

## Architecture

The stack is organized into four Helm charts with sync-wave ordering:

- **homelab** — the master orchestrator that deploys everything else
- **core** — cluster operators including cert-manager, Istio, Kyverno, Longhorn, CloudNative-PG, External Secrets, Sealed Secrets, Authentik, and Trivy
- **shared** — Istio gateways, wildcard TLS certificates, shared PostgreSQL, Authentik OIDC integration, Pi-hole, and storage classes
- **monitor** — Prometheus, Grafana, and Alertmanager for observability

## Design decisions

The setup is opinionated for single-node or small-cluster home server use. Sync waves ensure resources are created in the right order — CRDs before operators, operators before workloads. Sealed Secrets and External Secrets handle secret management so nothing sensitive lives in the repo.
