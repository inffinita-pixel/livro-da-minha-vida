import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
Você é um ghostwriter especializado em autobiografias, histórias de vida e livros de legado familiar.

Seu papel é transformar relatos reais em narrativa literária clara, humana e afetiva, sem inventar fatos.

Regras fundamentais:
- Nunca crie eventos, pessoas ou situações que não estejam explicitamente descritas.
- Não romantize excessivamente tragédias. Trate perdas com respeito e delicadeza.
- Preserve a voz da autora: simples, verdadeira, íntima.
- Se faltar contexto, faça perguntas no final do texto em vez de preencher lacunas.
- Não mencione IA, ChatGPT ou qualquer tecnologia no texto final.

Estilo do texto:
- Narrativa fluida, com começo-meio-fim.
- Linguagem acessível, calorosa e elegante.
- Metáforas leves são permitidas, desde que fiéis ao conteúdo.

Estrutura esperada do capítulo:
1. Título sensível e significativo
2. Abertura contextual
3. Desenvolvimento
4. Fecho com reflexão (quando aplicável)
`.trim();

function mapPrefs(tone: string, length: string, voice: string) {
  const toneTxt =
    tone === "objetivo" ? "mais objetivo, claro e direto" : "emocional, humano e sensível";
  const lengthTxt =
    length === "curto" ? "curta" : length === "longo" ? "longa" : "média";
  const voiceTxt =
    voice === "baixa"
      ? "preservar pouco a voz original (reescrever mais)"
      : voice === "media"
      ? "preservar moderadamente a voz original"
      : "preservar ao máximo a voz original (manter frases e escolhas de palavras quando possível)";
  return { toneTxt, lengthTxt, voiceTxt };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const memories_text = String(body.memories_text ?? "").trim();
    const tone = String(body.tone ?? "emocional");
    const length = String(body.length ?? "medio");
    const voice_level = String(body.voice_level ?? "alta");

    if (memories_text.length < 40) {
      return Response.json({ error: "Texto muito curto. Escreva um pouco mais." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: "OPENAI_API_KEY não configurada no servidor." }, { status: 500 });
    }

    const { toneTxt, lengthTxt, voiceTxt } = mapPrefs(tone, length, voice_level);

    const userPrompt = `
A seguir estão relatos reais escritos pela autora sobre sua própria vida.

Transforme esses relatos em um capítulo de livro autobiográfico, seguindo as regras do prompt de sistema.

Preferências:
- Tom: ${toneTxt}
- Extensão: ${lengthTxt}
- Voz: ${voiceTxt}

Relatos:
${memories_text}
`.trim();

    const resp = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    const chapter = (resp.output_text ?? "").trim();

    return Response.json({ chapter });
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? "Erro ao gerar capítulo." },
      { status: 500 }
    );
  }
}
