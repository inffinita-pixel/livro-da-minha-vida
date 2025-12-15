# Livro da Minha Vida — Web (MVP)

Uma página web simples que recebe um texto (memórias) e devolve um capítulo de livro gerado por IA.
O prompt de ghostwriter fica **no servidor**, invisível para a aluna.

## 1) Requisitos
- Node.js 18+ (recomendado 20)
- Conta na OpenAI (para obter a chave)
- (Opcional) GitHub + Vercel para publicar

## 2) Instalar
```bash
npm install
```

## 3) Configurar a chave da OpenAI
Crie um arquivo `.env.local` na raiz (ao lado do package.json) com:
```bash
OPENAI_API_KEY="SUA_CHAVE_AQUI"
```

> Dica: você pode copiar o `.env.example`.

## 4) Rodar local
```bash
npm run dev
```
Abra:
http://localhost:3000

## 5) Publicar na Vercel (sem complicação)
1. Suba este projeto para o GitHub
2. Na Vercel, clique em **New Project** e selecione o repositório
3. Em **Environment Variables**, adicione:
   - `OPENAI_API_KEY`
4. Deploy

## 6) Onde o prompt fica escondido?
- `app/api/generate/route.ts` (server-side).
O navegador nunca recebe o prompt — apenas o texto final gerado.

## Próximos upgrades (quando você quiser)
- senha por turma
- salvar histórico/versões
- exportar DOCX/PDF
- login Google e banco (Supabase)
