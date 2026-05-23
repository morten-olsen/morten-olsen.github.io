"""Canonical resume schema and rendering for the Phase 4 defense pipeline.

`CanonicalResume` is the structured intermediate every candidate is reduced
to before scoring. By construction it has a fixed section order and a
fixed formatting style — so two candidates whose source resumes differ
only in section order or markup will produce identical canonical markdown.

`render_canonical` writes a CanonicalResume out as a deterministic markdown
document that the scoring SUT can consume through its existing pipeline.
"""

from __future__ import annotations

from pydantic import BaseModel, Field


class WorkExperience(BaseModel):
    company: str
    role: str
    dates: str
    description: list[str] = Field(
        default_factory=list,
        description="Bullets or short sentences describing the role. "
        "Each entry is one accomplishment or responsibility.",
    )


class CanonicalResume(BaseModel):
    """The structured intermediate every candidate is reduced to before scoring.

    Field order, naming, and types are stable. The vision-extraction stage
    populates this from the rendered PDF; downstream stages re-render it
    deterministically.
    """

    name: str
    contact: str = Field(
        description="Single-line contact summary: location, email, links, etc."
    )
    summary: str = Field(default="", description="The candidate's self-description / objective.")
    work_experience: list[WorkExperience] = Field(default_factory=list)
    skills: list[str] = Field(
        default_factory=list,
        description="Flat list of skill strings. Group labels (e.g. 'Languages:') "
        "may be prepended to the relevant skill string.",
    )
    education: list[str] = Field(
        default_factory=list,
        description="Each entry one degree, e.g. 'BSc Computer Science — University of Amsterdam, 2022'.",
    )
    other: list[str] = Field(
        default_factory=list,
        description="Other notes the candidate included: side projects, "
        "open-source contributions, volunteering, talks.",
    )


def render_canonical(resume: CanonicalResume) -> str:
    """Render a CanonicalResume into deterministic markdown.

    Section order is fixed (Summary, Experience, Skills, Education, Other).
    Formatting is fixed (bullets for descriptions; one-line skills list).
    Same resume content always produces the same markdown.
    """
    out: list[str] = [
        f"# {resume.name}",
        "",
        resume.contact,
        "",
    ]

    if resume.summary:
        out += [
            "## Summary",
            "",
            resume.summary,
            "",
        ]

    if resume.work_experience:
        out.append("## Experience")
        out.append("")
        for entry in resume.work_experience:
            out.append(f"### {entry.role} — {entry.company}")
            out.append(f"*{entry.dates}*")
            out.append("")
            for bullet in entry.description:
                out.append(f"- {bullet}")
            out.append("")

    if resume.skills:
        out += [
            "## Skills",
            "",
            *(f"- {skill}" for skill in resume.skills),
            "",
        ]

    if resume.education:
        out += [
            "## Education",
            "",
            *(f"- {edu}" for edu in resume.education),
            "",
        ]

    if resume.other:
        out += [
            "## Other",
            "",
            *(f"- {item}" for item in resume.other),
            "",
        ]

    return "\n".join(out).rstrip() + "\n"
