// Scrapes the AWS Certification exam guides catalog + every individual exam guide
// (content domains, task statements, in/out-of-scope services) into scripts/kb-data/<CODE>.json.
//
// Usage: node --env-file=.env scripts/scrape-kb.mjs [CODE ...]
//   node --env-file=.env scripts/scrape-kb.mjs            -> scrape all certs
//   node --env-file=.env scripts/scrape-kb.mjs CLF-C02    -> scrape a subset

import { writeFile, mkdir } from 'node:fs/promises';
import { fetchText, resolveUrl, BASE } from './lib/fetch-md.mjs';

const CATALOG_URL = `${BASE}/examguides/aws-certification-exam-guides.md`;
const OUT_DIR = new URL('./kb-data/', import.meta.url);

const LEVEL_HEADINGS = {
  'Foundational Level Certifications': 'foundational',
  'Associate Level Certifications': 'associate',
  'Professional Level Certifications': 'professional',
  'Specialty Certifications': 'specialty',
};

function parseCatalog(md) {
  const lines = md.split('\n');
  const certs = [];
  let level = null;

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch && LEVEL_HEADINGS[headingMatch[1].trim()]) {
      level = LEVEL_HEADINGS[headingMatch[1].trim()];
      continue;
    }

    const certMatch = line.match(/^\[(.+?) \(([\w-]+)\)\]\(\.\.\/([\w-]+)\.html\)/);
    if (certMatch && level) {
      const [, name, code, slug] = certMatch;
      certs.push({ name, code, slug, level });
    }
  }

  return certs;
}

// Different exam guide template revisions place service-reference links either under a
// dedicated "## Service References" heading or mixed into "## Content outline" — so scan
// the whole document for .md links instead of anchoring to one heading.
function findServiceLink(md, titlePattern) {
  const linkRe = /\+ \[(.+?)\]\((.+?\.md)\)/g;
  let m;
  while ((m = linkRe.exec(md))) {
    if (titlePattern.test(m[1])) return { title: m[1], href: m[2] };
  }
  return null;
}

function parseDomainLinks(mainMd) {
  const domains = [];
  const re = /Content Domain (\d+): (.+?) \((\d+)% of scored content\)\]\((.+?)\)/g;
  let m;
  while ((m = re.exec(mainMd))) {
    domains.push({
      number: Number(m[1]),
      title: m[2].trim(),
      weightPct: Number(m[3]),
      href: m[4],
    });
  }
  return domains;
}

// Exam guide template revisions vary: heading is "Task Statement N.N" or "Task N.N" or "Task N";
// body is either "Knowledge of:"/"Skills in:" sections, an "Objectives:" flat list, or bare
// "+ Skill N.N.N: ..." bullets with no label at all. Handle all of them.
function parseTaskStatements(domainMd) {
  const headingRe = /\n#{2,3} Task(?: Statement)? (\d+(?:\.\d+)?): (.+?)\n/g;
  const matches = [...domainMd.matchAll(headingRe)];

  return matches.map((m, i) => {
    const start = m.index + m[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : domainMd.length;
    const block = domainMd.slice(start, end);

    const knowledgeMatch = block.match(/Knowledge of:\n([\s\S]*?)(?=\nSkills in:|\n#{2,3} |$)/);
    const knowledge = knowledgeMatch
      ? knowledgeMatch[1]
          .split('\n')
          .filter((l) => l.startsWith('+ '))
          .map((l) => l.slice(2).trim())
      : [];

    const remainder = knowledgeMatch ? block.replace(knowledgeMatch[0], '') : block;
    const skills = remainder
      .split('\n')
      .filter((l) => l.startsWith('+ '))
      .map((l) => l.slice(2).replace(/^Skill \d+(?:\.\d+)*:\s*/, '').trim());

    return {
      number: m[1],
      text: m[2].trim(),
      knowledge,
      skills,
    };
  });
}

function parseServiceCategories(serviceMd) {
  const categories = {};
  const sectionRe = /\n## (.+?)\n<a name="[^"]*"><\/a>\n([\s\S]*?)(?=\n## |$)/g;
  let m;
  while ((m = sectionRe.exec('\n' + serviceMd))) {
    const [, category, body] = m;
    if (category === 'Topics') continue;
    const services = body
      .split('\n')
      .filter((l) => l.startsWith('+ '))
      .map((l) => l.slice(2).trim());
    if (services.length) categories[category] = services;
  }
  return categories;
}

async function scrapeCert({ name, code, slug, level }) {
  const certBase = `${BASE}/${slug}/`;
  const mainUrl = resolveUrl(certBase, `${slug}.md`);
  console.log(`[${code}] fetching ${mainUrl}`);
  const mainMd = await fetchText(mainUrl);

  const domainLinks = parseDomainLinks(mainMd);
  const inScopeLink = findServiceLink(mainMd, /^in-scope/i);
  const outScopeLink = findServiceLink(mainMd, /^out-of-scope/i);

  const domains = [];
  for (const d of domainLinks) {
    const domainUrl = resolveUrl(certBase, d.href);
    const domainMd = await fetchText(domainUrl);
    domains.push({
      number: d.number,
      title: d.title,
      weightPct: d.weightPct,
      taskStatements: parseTaskStatements(domainMd),
    });
  }

  let inScopeServices = {};
  if (inScopeLink) {
    const md = await fetchText(resolveUrl(certBase, inScopeLink.href));
    inScopeServices = parseServiceCategories(md);
  }

  let outOfScopeServices = {};
  if (outScopeLink) {
    const md = await fetchText(resolveUrl(certBase, outScopeLink.href));
    outOfScopeServices = parseServiceCategories(md);
  }

  return {
    code,
    slug,
    name,
    level,
    examGuideUrl: mainUrl,
    scrapedAt: new Date().toISOString(),
    domains,
    inScopeServices,
    outOfScopeServices,
  };
}

async function main() {
  const filterCodes = process.argv.slice(2);
  const catalogMd = await fetchText(CATALOG_URL);
  let certs = parseCatalog(catalogMd);

  if (filterCodes.length) {
    certs = certs.filter((c) => filterCodes.includes(c.code));
  }

  if (certs.length === 0) {
    throw new Error('No certifications matched — check catalog parsing or the CODE filter.');
  }

  console.log(`Found ${certs.length} certification(s) to scrape.`);
  await mkdir(OUT_DIR, { recursive: true });

  for (const cert of certs) {
    const kb = await scrapeCert(cert);
    const taskCount = kb.domains.reduce((sum, d) => sum + d.taskStatements.length, 0);
    console.log(
      `[${cert.code}] ${kb.domains.length} domains, ${taskCount} task statements, ` +
        `${Object.keys(kb.inScopeServices).length} in-scope service categories`
    );
    await writeFile(
      new URL(`${cert.code}.json`, OUT_DIR),
      JSON.stringify(kb, null, 2)
    );
  }

  console.log(`Done. Wrote KB for ${certs.length} certification(s) to scripts/kb-data/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
