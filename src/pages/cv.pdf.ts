import { data } from "~/data/data";

type Rgb = [number, number, number];

const A4 = { width: 595.28, height: 841.89 };
const margin = 36;
const spine = 34;
const ink: Rgb = [0.06, 0.06, 0.06];
const grey: Rgb = [0.34, 0.34, 0.34];

const escapePdf = (value: unknown): string => String(value ?? '')
  .replaceAll('\\', '\\\\')
  .replaceAll('(', '\\(')
  .replaceAll(')', '\\)');

const clean = (value: unknown): string => String(value ?? '')
  .replaceAll('·', '/')
  .replaceAll('—', '-')
  .replaceAll('–', '-')
  .replace(/[\u2018\u2019]/g, "'")
  .replace(/[\u201c\u201d]/g, '"')
  .replace(/\s+/g, ' ')
  .trim();

const date = (value?: string): string => value
  ? new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(value))
  : 'Present';

const contactLabel = (value: unknown): string => String(value)
  .replace(/^https?:\/\//, '')
  .replace(/^www\./, '')
  .replace(/\/$/, '');

const toBytes = (value: string): Uint8Array => {
  const bytes = new Uint8Array(value.length);
  for (let index = 0; index < value.length; index += 1) {
    bytes[index] = value.charCodeAt(index) & 0xff;
  }
  return bytes;
};

class Pdf {
  #pages: string[][] = [];
  #ops: string[] = [];
  #y = A4.height - margin;

  public constructor() {
    this.#page();
  }

  #page = (): void => {
    this.#ops = [];
    this.#pages.push(this.#ops);
    this.#y = A4.height - margin;
    this.line(margin + spine, margin, margin + spine, A4.height - margin, 0.8, ink);
    this.vertical(`MORTEN OLSEN / CV / ${new Date().getFullYear()}`, margin + 13, margin + 116, 8, 'F2', ink);
  }

  public get y(): number {
    return this.#y;
  }

  public set y(value: number) {
    this.#y = value;
  }

  public ensure = (height: number): void => {
    if (this.#y - height < margin) this.#page();
  }

  public rgb = ([r, g, b]: Rgb, stroke = false): void => {
    this.#ops.push(`${r} ${g} ${b} ${stroke ? 'RG' : 'rg'}`);
  }

  public text = (value: unknown, x: number, y: number, options: { size?: number; font?: string; color?: Rgb; leading?: number } = {}): void => {
    const { size = 10, font = 'F1', color = ink, leading = size * 1.25 } = options;
    this.rgb(color);
    this.#ops.push(`BT /${font} ${size} Tf ${leading} TL ${x} ${y} Td (${escapePdf(clean(value))}) Tj ET`);
  }

  public vertical = (value: unknown, x: number, y: number, size = 8, font = 'F1', color: Rgb = ink): void => {
    this.rgb(color);
    this.#ops.push(`BT /${font} ${size} Tf 0 1 -1 0 ${x} ${y} Tm (${escapePdf(clean(value))}) Tj ET`);
  }

  public line = (x1: number, y1: number, x2: number, y2: number, width = 1, color: Rgb = ink): void => {
    this.rgb(color, true);
    this.#ops.push(`${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
  }

  public rect = (x: number, y: number, width: number, height: number, fill: Rgb | null = null, stroke: Rgb | null = ink): void => {
    if (fill) {
      this.rgb(fill);
      this.#ops.push(`${x} ${y} ${width} ${height} re f`);
    }
    if (stroke) {
      this.rgb(stroke, true);
      this.#ops.push(`0.8 w ${x} ${y} ${width} ${height} re S`);
    }
  }

  public wrap = (value: unknown, width: number, size = 10): string[] => {
    const words = clean(value).split(' ').filter(Boolean);
    const max = Math.max(10, Math.floor(width / (size * 0.49)));
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (next.length > max && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  public paragraph = (value: unknown, x: number, width: number, options: { size?: number; color?: Rgb; font?: string; leading?: number; gap?: number; maxLines?: number } = {}): void => {
    const { size = 9, color = ink, font = 'F1', leading = size * 1.35, gap = 0, maxLines = Infinity } = options;
    const lines = this.wrap(value, width, size).slice(0, maxLines);
    this.ensure(lines.length * leading + gap);
    for (const line of lines) {
      this.text(line, x, this.#y, { size, font, color, leading });
      this.#y -= leading;
    }
    this.#y -= gap;
  }

  public section = (number: string, title: string, x: number, y: number, width: number): void => {
    this.text(number.padStart(2, '0'), x, y, { size: 8, font: 'F2', color: grey });
    this.text(title.toUpperCase(), x + 28, y - 1, { size: 16, font: 'F2', color: ink });
    this.line(x + 28, y - 7, x + width, y - 7, 1, ink);
  }

  public bytes = (): Uint8Array => {
    const objects = [
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    ];
    const contentStart = 4;
    const pageStart = contentStart + this.#pages.length;
    const pageRefs: string[] = [];

    this.#pages.forEach((ops, index) => {
      const stream = ops.join('\n');
      objects[contentStart + index - 1] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
      pageRefs.push(`${pageStart + index} 0 R`);
    });
    this.#pages.forEach((_, index) => {
      objects[pageStart + index - 1] = `<< /Type /Page /Parent 3 0 R /MediaBox [0 0 ${A4.width} ${A4.height}] /Resources << /Font << /F1 1 0 R /F2 2 0 R >> >> /Contents ${contentStart + index} 0 R >>`;
    });
    objects[2] = `<< /Type /Pages /Kids [${pageRefs.join(' ')}] /Count ${this.#pages.length} >>`;
    objects.push('<< /Type /Catalog /Pages 3 0 R >>');

    let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
    const offsets = [0];
    objects.forEach((object, index) => {
      offsets.push(pdf.length);
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xref = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let index = 1; index <= objects.length; index += 1) pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${objects.length} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    return toBytes(pdf);
  }
}

const createCvPdf = async (): Promise<Uint8Array> => {
  const resume = await data.profile.getResumeJson();
  const basics = resume.basics ?? {};
  const jobs = resume.work ?? [];
  const skills = resume.skills ?? [];
  const profiles = basics.profiles ?? [];
  const doc = new Pdf();
  const x = margin + spine + 20;
  const rightX = 424;
  const mainW = rightX - x - 22;

  doc.text('PRINT EDITION / COPENHAGEN', x, 785, { size: 8, font: 'F2', color: grey });
  doc.line(x, 778, x + 154, 778, 0.8, ink);
  doc.text(basics.name ?? 'Morten Olsen', x, 724, { size: 50, font: 'F2', color: ink });
  doc.text(basics.label ?? 'Senior Software Engineer', x, 695, { size: 12, font: 'F2', color: ink });

  doc.line(x, 675, A4.width - margin, 675, 4, ink);
  doc.y = 645;
  doc.paragraph(
    basics.summary || 'Software engineer based in Copenhagen with 15+ years of experience across frontend, mobile, backend, infrastructure, and AI product teams.',
    x,
    A4.width - x - margin,
    { size: 15, font: 'F2', leading: 18.5, gap: 18, maxLines: 4 },
  );

  doc.rect(rightX, 700, A4.width - margin - rightX, 84, null, ink);
  let cy = 766;
  for (const item of [basics.url, basics.email, ...profiles.map((profile) => profile.url)].filter(Boolean).slice(0, 5)) {
    doc.text(contactLabel(item), rightX + 9, cy, { size: 6.6, font: 'F2', color: ink });
    cy -= 13;
  }

  const columnsTop = doc.y;

  let sy = columnsTop;
  doc.section('2', 'Skills', rightX, sy, A4.width - margin - rightX);
  sy -= 28;
  for (const skill of skills) {
    const lines = doc.wrap((skill.keywords ?? []).join(' / '), A4.width - margin - rightX - 14, 7.1).slice(0, 5);
    const boxH = 28 + lines.length * 8;
    if (sy - boxH < margin) break;
    doc.rect(rightX, sy - boxH + 10, A4.width - margin - rightX, boxH, null, ink);
    doc.text(skill.name ?? '', rightX + 9, sy - 5, { size: 9.2, font: 'F2', color: ink });
    let ly = sy - 19;
    for (const line of lines) {
      doc.text(line, rightX + 9, ly, { size: 7.1, color: grey });
      ly -= 8;
    }
    sy -= boxH + 8;
  }

  sy -= 12;
  doc.section('3', 'Profile', rightX, sy, A4.width - margin - rightX);
  sy -= 28;
  for (const line of doc.wrap(
    'I specialize in architecture and system design across product and platform boundaries. The surface area may be frontend, backend, infrastructure, or the seams between them; the work is the same: clear boundaries, operable services, resilient product flows, and choices teams can keep evolving after the first version ships.',
    A4.width - margin - rightX,
    7.5,
  ).slice(0, 13)) {
    doc.text(line, rightX, sy, { size: 7.5, color: grey });
    sy -= 10;
  }

  doc.y = columnsTop;
  doc.section('1', 'Experience', x, doc.y, mainW);
  doc.y -= 26;
  for (const job of jobs) {
    const stack = (job.highlights ?? []).join(' / ');
    const summary = job.summary ?? '';
    const summaryLines = summary ? doc.wrap(summary, mainW - 88, 8.2) : [];
    const stackLines = stack ? doc.wrap(stack, mainW - 88, 6.6).slice(0, 2) : [];
    const height = 38 + summaryLines.length * 10 + stackLines.length * 8;
    doc.ensure(height);
    const top = doc.y;

    doc.text(date(job.startDate), x, top, { size: 7, font: 'F2', color: grey });
    doc.text(date(job.endDate), x, top - 11, { size: 7, font: 'F2', color: grey });
    doc.line(x + 66, top + 3, x + 66, top - height + 8, 0.8, ink);
    doc.text(job.name ?? '', x + 80, top, { size: 12, font: 'F2', color: ink });
    doc.text(job.position ?? '', x + 80, top - 13, { size: 8.6, font: 'F2', color: ink });
    let y = top - 26;
    for (const line of summaryLines) {
      doc.text(line, x + 80, y, { size: 8.2, color: grey });
      y -= 10;
    }
    for (const line of stackLines) {
      doc.text(line, x + 80, y, { size: 6.6, font: 'F2', color: ink });
      y -= 8;
    }
    doc.y = y - 8;
  }

  return doc.bytes();
};

export async function GET(): Promise<Response> {
  const pdf = await createCvPdf();
  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="morten-olsen-cv.pdf"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
