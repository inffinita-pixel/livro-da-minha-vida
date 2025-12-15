"use client";

import { useMemo, useState } from "react";

type Tone = "emocional" | "objetivo";
type Length = "curto" | "medio" | "longo";
type Voice = "alta" | "media" | "baixa";

export default function Home() {
  const [input, setInput] = useState("");
  const [tone, setTone] = useState<Tone>("emocional");
  const [length, setLength] = useState<Length>("medio");
  const [voice, setVoice] = useState<Voice>("alta");

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const canGenerate = useMemo(() => input.trim().length >= 40, [input]);

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setOutput("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memories_text: input,
          tone,
          length,
          voice_level: voice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Falha ao gerar capítulo.");
      }

      setOutput(data.chapter ?? "");
    } catch (e: any) {
      setError(e?.message ?? "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Livro da Minha Vida
        </h1>
        <p className="mt-2 text-neutral-600">
          Escreva do seu jeito. Eu transformo em texto de livro — com cuidado e fidelidade.
        </p>

        <div className="mt-8 rounded-2xl bg-white shadow-sm border border-neutral-200 p-5">
          <label className="text-sm font-medium text-neutral-800">
            Cole aqui suas memórias / respostas do exercício
          </label>
          <textarea
            className="mt-2 w-full min-h-[240px] rounded-xl border border-neutral-200 p-4 outline-none focus:ring-2 focus:ring-neutral-300"
            placeholder="Escreva livremente… (quanto mais detalhes, melhor)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="text-xs text-neutral-600">Tom</label>
              <select
                className="mt-1 w-full rounded-xl border border-neutral-200 p-2"
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
              >
                <option value="emocional">Emocional</option>
                <option value="objetivo">Objetivo</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-neutral-600">Tamanho</label>
              <select
                className="mt-1 w-full rounded-xl border border-neutral-200 p-2"
                value={length}
                onChange={(e) => setLength(e.target.value as Length)}
              >
                <option value="curto">Curto</option>
                <option value="medio">Médio</option>
                <option value="longo">Longo</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-neutral-600">Preservar voz</label>
              <select
                className="mt-1 w-full rounded-xl border border-neutral-200 p-2"
                value={voice}
                onChange={(e) => setVoice(e.target.value as Voice)}
              >
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>

          <button
            className="mt-5 w-full rounded-xl bg-neutral-900 text-white py-3 font-medium disabled:opacity-40"
            disabled={!canGenerate || loading}
            onClick={onGenerate}
          >
            {loading ? "Gerando capítulo…" : "Transformar em capítulo"}
          </button>

          {!canGenerate && (
            <p className="mt-3 text-xs text-neutral-500">
              Dica: escreva pelo menos algumas frases (mín. ~40 caracteres) para gerar.
            </p>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {output && (
            <div className="mt-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Seu capítulo</h2>
                <button
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                  onClick={() => navigator.clipboard.writeText(output)}
                >
                  Copiar
                </button>
              </div>
              <div className="mt-3 whitespace-pre-wrap rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-[15px] leading-7">
                {output}
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 text-xs text-neutral-500">
          Observação: o texto é gerado com IA. Não inventamos fatos — se faltar contexto, perguntas podem aparecer ao final.
        </p>
      </div>
    </main>
  );
}
