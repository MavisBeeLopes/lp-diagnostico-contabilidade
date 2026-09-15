# LP — Diagnóstico de Projeto (Contabilidade) · Lughy

Landing page estática de captação de leads para a campanha **"Diagnóstico de Projeto"** da Lughy (software house do DB1 Group), no nicho **Contabilidade**. Oferta: análise técnica (viabilidade, recomendação de MVP, riscos, premissas e faixa de investimento) antes de o escritório investir no desenvolvimento de um sistema contábil.

Feita a partir do template Lughy (mesma stack, integração RD Station e GTM), adaptada para a **versão CLARA** do brand guide. Sem framework: apenas HTML, CSS e JavaScript vanilla + Google Fonts (Lexend).

## O que muda em relação ao template

| Item | Template (Consultoria Suk) | Esta LP (Diagnóstico Contabilidade) |
|------|----------------------------|---------------------------------|
| Tema | Escuro (preto + off-white) | **Claro** (branco / `#F7F7F7`) |
| Laranja | `#F9550D` | `#FF5A1F` (destaques/CTA) + `#C2410C` (texto laranja pequeno, para AA) |
| Oferta | Consultoria de IA (30 min) | Diagnóstico técnico de projeto |
| Estrutura | 11 blocos (vídeo Suk, depoimento) | 9 seções do briefing |
| Campos do form | nome, e-mail, empresa, cargo, telefone, time-dev, LGPD | **nome, e-mail, WhatsApp, nome do escritório, cargo, LGPD** |
| CTA | "Garantir vaga" | **"Solicitar diagnóstico"** |
| `RD_CONVERSION_IDENTIFIER` | `lp-consultoria-suk` | **`lp-diagnostico-contabilidade`** |
| Tags no RD | — | **`diagnostico-projeto`, `nicho-contabilidade`** |

## Rodar localmente (preview em localhost)

O projeto traz um servidor estático em **PowerShell** (`.claude/serve.ps1`) — **não depende de Python nem Node**. Basta rodar na raiz do projeto:

```bash
powershell -ExecutionPolicy Bypass -NoProfile -File .claude\serve.ps1 -Port 8000
```

Depois acesse **http://localhost:8000**. Para parar, `Ctrl+C`.

> No Claude Code, o `.claude/launch.json` já aponta para esse servidor — abrir o preview (Browser pane) sobe tudo automaticamente em `http://localhost:8000`. Não há build.
>
> Alternativas: extensão **Live Server** do VS Code, ou `python -m http.server` / `npx serve` se você tiver Python/Node instalados. (Nesta máquina o `python` do PATH é o atalho da Microsoft Store e não serve arquivos — por isso o servidor em PowerShell.)
>
> Obs.: o endpoint `/api/rd-conversao` só funciona no Vercel (função serverless); localmente o envio do formulário retorna 404. Para testar a conversão de ponta a ponta, publique no Vercel com as env vars configuradas.

## Estrutura de arquivos

```
index.html          9 seções (header, hero, dores, solução, oferta, prova social, FAQ, formulário, footer)
styles.css          Variáveis CSS, paleta CLARA Lughy, responsivo mobile-first
script.js           Acordeão do FAQ, validação do form e smooth scroll do CTA
obrigado.html       Thank you page (dispara evento de conversão no GTM)
api/rd-conversao.js Função serverless (Vercel) → RD Station
vercel.json         Cache-control
assets/
  hero-lughy.jpg    Arte oficial do hero (deck comercial Lughy 2026, otimizada p/ web)
  logo-lughy-*.svg  Logos oficiais Lughy (preto usado no tema claro)
  brands/           Logos de grandes marcas do DB1 Group (deck comercial 2026)
  decor/            Assinatura DB1 Group + forma orgânica
```

## Seções (ordem do briefing)

1. **Header** — logo Lughy (preto) + "Software house" + CTA pill laranja.
2. **Hero** — H1 com palavra-chave em laranja + subheadline + CTA + blobs cinza-claro + arte oficial da Lughy (`hero-lughy.jpg`, do deck comercial 2026) à direita.
3. **Dores** — 4 cards com ícone (obrigações acessórias em planilha, conciliação/fechamentos, onboarding de clientes, relatórios e dados espalhados).
4. **Solução** — 3 blocos com ícone circular preto (reduza riscos / conheça os métodos / diagnóstico personalizado).
5. **Oferta** — card de destaque branco com borda superior laranja + lista de entregáveis + CTA.
6. **Prova social** — assinatura DB1 Group + selos (LGPD / sigilo) + marquee com logos de grandes marcas do DB1 Group (iFood, Boticário, XP, EBANX, Lenovo, Acer, Nike, Adidas, Electrolux, GPA, Klabin, BRK, Linx, Fast Shop).
7. **FAQ** — acordeão com as 5 perguntas do briefing (uma aberta por vez).
8. **Formulário final** — nome, e-mail, WhatsApp, nome do escritório, cargo, consentimento LGPD + microcopy de segurança.
9. **Footer** — logo Lughy + assinatura DB1 + ano.

## Identidade visual (versão clara)

- **Fonte única:** Lexend (400 / 500 / 600 / 700 / 800).
- **Paleta:** fundo `#FFFFFF` e `#F7F7F7`; texto `#0A0A0A`; laranja `#FF5A1F` só em destaques, ícones e CTA. **Sem seções com fundo preto.**
- **Blobs orgânicos** em cinza muito suave (`#F0F0F0` → `#E8E8E8`) atrás do hero, em CSS.
- **Hero** com arte oficial da Lughy (`hero-lughy.jpg`) — fundo claro, pessoa e tiles flutuando com acento laranja; leve animação de flutuar em CSS.
- **CTA:** pill laranja sólido com texto **branco**, sempre com o verbo **"Solicitar"**.

### Acessibilidade / contraste (WCAG AA)

O branco sobre `#FF5A1F` só atinge ~3.1:1, insuficiente para texto normal. Por isso:
- **Botões (texto branco)** são renderizados em **bold ≥19px**, qualificando como "texto grande" (limiar AA 3:1 → passa).
- **Textos laranja pequenos** (eyebrow, badge) usam `--laranja-texto` `#C2410C` (~5:1 sobre branco).
- O laranja `#FF5A1F` em texto só aparece em títulos grandes (H1), onde 3:1 é suficiente.

## Breakpoints

- Mobile: base (< 641px)
- Tablet: ≥ 768px (o briefing cita 641–1024px)
- Desktop: ≥ 1025px

## Integração do formulário (RD Station)

O formulário envia os dados para `api/rd-conversao.js` (serverless no Vercel), que registra a conversão no **RD Station Marketing** via API de Conversão. A API Key fica secreta em variável de ambiente.

**Variáveis de ambiente no Vercel** (Settings → Environment Variables):

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `RD_API_KEY` | ✅ | API Key do RD Station (Integrações → API Key) |
| `RD_CONVERSION_IDENTIFIER` | ⬜ | Identificador da conversão (padrão: `lp-diagnostico-contabilidade`) |

Mapeamento enviado ao RD: `name` (nome), `email`, `mobile_phone` (WhatsApp), `company_name` (nome do escritório), `job_title` (cargo), `tags` (`diagnostico-projeto`, `nicho-contabilidade`), `available_for_mailing` e `legal_bases` (consentimento LGPD quando marcado). Após alterar variáveis no Vercel, faça um **Redeploy**.

> **GTM** (`GTM-N384CG7L`) segue instalado nas duas páginas; o evento `conversao_lead` (com `conversao_identificador: "lp-diagnostico-contabilidade"`) dispara só na thank you page, após a conversão real.

## Pendências antes de publicar

- [ ] Adicionar `assets/og-image.jpg` (1200×630) para compartilhamento social.
- [ ] Confirmar autorização/uso dos logos de marcas do DB1 Group como prova social nesta LP pública.
- [ ] Configurar `RD_API_KEY` e `RD_CONVERSION_IDENTIFIER` no Vercel.
- [ ] Novo repositório GitHub + projeto Vercel (ou nova rota) para esta LP.

## Notas de marca

- Grafia: **Lughy** (nunca "LUGHY" ou "lughy" no corpo). Feminina: "a Lughy".
- Textos alinhados à esquerda; nunca justificados.
- Não usar "barato" como argumento; não prometer sucesso garantido nem comparar com concorrentes; não tratar IA como diferencial mágico. Traduzir termos técnicos (MVP = Produto Mínimo Viável).
