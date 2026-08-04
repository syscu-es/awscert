// Generates AWS-style practice questions (Spanish) from the scraped KB using OpenAI structured
// outputs, one domain per API call. Reads scripts/kb-data/<CODE>.json, writes
// scripts/kb-data/<CODE>.questions.json.
//
// Usage: node --env-file=.env scripts/generate-questions.mjs [CODE ...]

import { readFile, writeFile, readdir } from 'node:fs/promises';

const KB_DIR = new URL('./kb-data/', import.meta.url);
const MODEL = 'gpt-4o-mini';
const QUESTIONS_PER_TASK = 3;

const QUESTION_SCHEMA = {
  type: 'object',
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          taskStatementNumber: { type: 'string' },
          text: { type: 'string' },
          options: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 5 },
          correct: { type: 'array', items: { type: 'integer' }, minItems: 1, maxItems: 2 },
          type: { type: 'string', enum: ['single', 'multiple'] },
          explanation: { type: 'string' },
        },
        required: ['taskStatementNumber', 'text', 'options', 'correct', 'type', 'explanation'],
        additionalProperties: false,
      },
    },
  },
  required: ['questions'],
  additionalProperties: false,
};

async function generateForDomain(cert, domain) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set (export it or add to .env)');

  const taskList = domain.taskStatements
    .map(
      (t) =>
        `Task ${t.number}: ${t.text}\n  Conocimientos/habilidades: ${[...t.knowledge, ...t.skills].join('; ')}`
    )
    .join('\n\n');

  const targetCount = domain.taskStatements.length * QUESTIONS_PER_TASK;

  const prompt = `Eres un generador de preguntas de examen de certificacion AWS. Genera EXACTAMENTE ${targetCount} preguntas de examen estilo AWS Certified, en español, para el dominio "${domain.title}" (${domain.weightPct}% del examen) de la certificación ${cert.name} (${cert.code}, nivel ${cert.level}).

Distribuye ${QUESTIONS_PER_TASK} preguntas por cada task statement listado abajo, usando taskStatementNumber para identificar a cuál pertenece cada pregunta.

Reglas:
- Preguntas "single": 4 opciones, 1 sola correcta.
- Preguntas "multiple" (como maximo 20% del total): 5 opciones, exactamente 2 correctas.
- "correct" son los indices (base 0) de las opciones correctas dentro de "options".
- "explanation": 1-2 frases explicando por que la respuesta es correcta.
- No repitas la misma pregunta con distinta redacción.
- Nivel de dificultad acorde al nivel de la certificación.
- Los distractores (opciones incorrectas) deben ser plausibles, no absurdos.

Task statements:
${taskList}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'exam_questions', schema: QUESTION_SCHEMA, strict: true },
      },
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI ${res.status}: ${body}`);
  }

  const data = await res.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  return parsed.questions;
}

async function main() {
  const filterCodes = process.argv.slice(2);
  const files = (await readdir(KB_DIR)).filter(
    (f) => f.endsWith('.json') && !f.endsWith('.questions.json')
  );

  for (const file of files) {
    const code = file.replace('.json', '');
    if (filterCodes.length && !filterCodes.includes(code)) continue;

    const cert = JSON.parse(await readFile(new URL(file, KB_DIR), 'utf-8'));
    console.log(`[${code}] generating questions for ${cert.domains.length} domain(s)...`);

    const allQuestions = [];
    for (const domain of cert.domains) {
      const questions = await generateForDomain(cert, domain);
      for (const q of questions) {
        allQuestions.push({
          domainNumber: domain.number,
          taskStatementNumber: q.taskStatementNumber,
          text: q.text,
          options: q.options,
          correct: q.correct,
          type: q.type,
          explanation: q.explanation,
          source: 'llm',
        });
      }
      console.log(`  domain ${domain.number} (${domain.title}): ${questions.length} questions`);
    }

    await writeFile(new URL(`${code}.questions.json`, KB_DIR), JSON.stringify(allQuestions, null, 2));
    console.log(`[${code}] wrote ${allQuestions.length} questions total`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
