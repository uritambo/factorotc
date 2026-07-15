// Traducció de notícies al català amb l'API de Claude (Anthropic).
// Opcional: si no hi ha ANTHROPIC_API_KEY, les notícies s'importen en l'idioma original.

import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';

const TranslatedNews = z.object({
  title: z.string(),
  summary: z.string(),
});

export function isTranslationConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

/**
 * Tradueix titular i resum al català. Retorna null si la traducció no està
 * configurada o falla — en aquest cas es guarda el text original.
 */
export async function translateNewsToCatalan(input: {
  title: string;
  summary: string;
}): Promise<{ title: string; summary: string } | null> {
  if (!isTranslationConfigured()) return null;

  try {
    const model = process.env.ANTHROPIC_TRANSLATION_MODEL ?? 'claude-opus-4-8';
    const response = await getClient().messages.parse({
      model,
      max_tokens: 2048,
      system:
        'Ets un traductor financer professional. Tradueix el titular i el resum de la notícia al català, amb terminologia financera correcta i natural. No afegeixis informació nova ni opinions.',
      messages: [
        {
          role: 'user',
          content: `Titular: ${input.title}\n\nResum: ${input.summary}`,
        },
      ],
      output_config: {
        format: zodOutputFormat(TranslatedNews),
      },
    });
    return response.parsed_output ?? null;
  } catch (error) {
    console.error('[translate] error traduint notícia:', error);
    return null;
  }
}
