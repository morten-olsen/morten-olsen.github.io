import { data } from "~/data/data";

type Rgb = [number, number, number];

const A4 = { width: 595.28, height: 841.89 };
const margin = 36;
const spine = 34;
const ink: Rgb = [0.06, 0.06, 0.06];
const grey: Rgb = [0.34, 0.34, 0.34];
const white: Rgb = [1, 1, 1];

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
    this.vertical(`MORTEN OLSEN / CV / ${new Date().getFullYear()}`, margin + 13, margin + 116, 7.2, 'F4', ink);
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

  public text = (value: unknown, x: number, y: number, options: { size?: number; font?: string; color?: Rgb; leading?: number; tracking?: number } = {}): void => {
    const { size = 10, font = 'F1', color = ink, leading = size * 1.25, tracking = 0 } = options;
    this.rgb(color);
    const trackingOp = tracking ? `${tracking} Tc ` : '';
    this.#ops.push(`BT /${font} ${size} Tf ${leading} TL ${trackingOp}${x} ${y} Td (${escapePdf(clean(value))}) Tj ET`);
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
    const max = Math.max(10, Math.floor(width / (size * 0.58)));
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
    this.rect(x, y - 8, 20, 16, ink, null);
    this.text(number.padStart(2, '0'), x + 4.2, y - 3, { size: 7.4, font: 'F4', color: white, tracking: 0.2 });
    this.text(title.toUpperCase(), x + 28, y - 1, { size: 15, font: 'F2', color: ink, tracking: 0.3 });
    this.line(x + 28, y - 7, x + width, y - 7, 1, ink);
  }

  public bytes = (): Uint8Array => {
    const objects = [
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold >>',
    ];
    const pagesObject = 5;
    const contentStart = 6;
    const pageStart = contentStart + this.#pages.length;
    const pageRefs: string[] = [];

    this.#pages.forEach((ops, index) => {
      const stream = ops.join('\n');
      objects[contentStart + index - 1] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
      pageRefs.push(`${pageStart + index} 0 R`);
    });
    this.#pages.forEach((_, index) => {
      objects[pageStart + index - 1] = `<< /Type /Page /Parent ${pagesObject} 0 R /MediaBox [0 0 ${A4.width} ${A4.height}] /Resources << /Font << /F1 1 0 R /F2 2 0 R /F3 3 0 R /F4 4 0 R >> >> /Contents ${contentStart + index} 0 R >>`;
    });
    objects[pagesObject - 1] = `<< /Type /Pages /Kids [${pageRefs.join(' ')}] /Count ${this.#pages.length} >>`;
    objects.push(`<< /Type /Catalog /Pages ${pagesObject} 0 R >>`);

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
  const rightX = 410;
  const rightW = A4.width - margin - rightX;
  const mainW = rightX - x - 24;

  doc.rect(x, 779, 172, 13, ink, null);
  doc.text('PRINT EDITION / COPENHAGEN', x + 6, 783.5, { size: 7.2, font: 'F4', color: white, tracking: 0.7 });
  doc.text('CV', A4.width - margin - 58, 754, { size: 42, font: 'F4', color: ink, tracking: -3 });
  doc.text(basics.name ?? 'Morten Olsen', x, 724, { size: 52, font: 'F2', color: ink, tracking: -1.5 });
  doc.text(basics.label ?? 'Senior Software Engineer', x, 694, { size: 9.5, font: 'F4', color: ink, tracking: 1.4 });

  doc.line(x, 675, A4.width - margin, 675, 4, ink);
  doc.y = 645;
  doc.paragraph(
    basics.summary || 'Software engineer based in Copenhagen with 15+ years of experience across frontend, mobile, backend, infrastructure, and AI product teams.',
    x,
    A4.width - x - margin,
    { size: 13.8, font: 'F2', leading: 17.4, gap: 22 },
  );

  const contactX = 430;
  const contactW = A4.width - margin - contactX;
  doc.rect(contactX, 700, contactW, 84, ink, null);
  let cy = 766;
  for (const item of [basics.url, basics.email, ...profiles.map((profile) => profile.url)].filter(Boolean).slice(0, 5)) {
    doc.text(contactLabel(item), contactX + 9, cy, { size: 6.2, font: 'F4', color: white, tracking: 0.1 });
    cy -= 13;
  }

  const columnsTop = doc.y;

  let sy = columnsTop;
  doc.section('2', 'Skills', rightX, sy, rightW);
  sy -= 28;
  for (const skill of skills) {
    const lines = doc.wrap((skill.keywords ?? []).join(' / '), rightW - 4, 6.8).slice(0, 6);
    const itemH = 24 + lines.length * 8.5;
    if (sy - itemH < margin) break;
    doc.text(skill.name ?? '', rightX, sy - 5, { size: 9.2, font: 'F2', color: ink });
    let ly = sy - 20;
    for (const line of lines) {
      doc.text(line, rightX, ly, { size: 6.6, font: 'F1', color: grey });
      ly -= 8.5;
    }
    doc.line(rightX, sy - itemH + 8, rightX + rightW, sy - itemH + 8, 0.45, grey);
    sy -= itemH + 12;
  }

  sy -= 12;
  doc.section('3', 'Profile', rightX, sy, rightW);
  sy -= 28;
  for (const line of doc.wrap(
    'I specialize in architecture and system design across product and platform boundaries. The surface area may be frontend, backend, infrastructure, or the seams between them; the work is the same: clear boundaries, operable services, resilient product flows, and choices teams can keep evolving after the first version ships.',
    rightW,
    7.4,
  ).slice(0, 13)) {
    doc.text(line, rightX, sy, { size: 7.2, font: 'F1', color: grey });
    sy -= 10;
  }

  doc.y = columnsTop;
  doc.section('1', 'Experience', x, doc.y, mainW);
  doc.y -= 26;
  for (const job of jobs) {
    const stack = (job.highlights ?? []).join(' / ');
    const summary = job.summary ?? '';
    const summaryLines = summary ? doc.wrap(summary, mainW - 84, 8.1) : [];
    const stackLines = stack ? doc.wrap(stack, mainW - 84, 6.2).slice(0, 3) : [];
    const height = 38 + summaryLines.length * 10 + stackLines.length * 8;
    doc.ensure(height);
    const top = doc.y;

    doc.text(date(job.startDate), x, top, { size: 6.8, font: 'F4', color: grey, tracking: 0.15 });
    doc.text(date(job.endDate), x, top - 11, { size: 6.8, font: 'F4', color: grey, tracking: 0.15 });
    doc.line(x + 62, top + 3, x + 62, top - height + 8, 0.8, ink);
    doc.text(job.name ?? '', x + 74, top, { size: 12, font: 'F2', color: ink });
    doc.text(job.position ?? '', x + 74, top - 13, { size: 7.2, font: 'F4', color: ink, tracking: 0.2 });
    let y = top - 27;
    for (const line of summaryLines) {
      doc.text(line, x + 74, y, { size: 8.1, font: 'F1', color: grey });
      y -= 10;
    }
    for (const line of stackLines) {
      doc.text(line, x + 74, y, { size: 6.2, font: 'F1', color: ink });
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
