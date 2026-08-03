// Função serverless (Vercel) — recebe o formulário da LP e registra a conversão
// no RD Station Marketing via API de Conversão (API Key).
//
// Variáveis de ambiente (configure no Vercel → Settings → Environment Variables):
//   RD_API_KEY                 (obrigatória) API Key do RD Station
//   RD_CONVERSION_IDENTIFIER   (opcional) identificador da conversão. Padrão: lp-diagnostico-contabilidade

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Método não permitido" });
    return;
  }

  const apiKey = process.env.RD_API_KEY;
  if (!apiKey) {
    res.status(500).json({ ok: false, error: "RD_API_KEY não configurada no servidor" });
    return;
  }

  const identifier = process.env.RD_CONVERSION_IDENTIFIER || "lp-diagnostico-contabilidade";

  // corpo (Vercel já faz o parse de JSON em req.body)
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body || {};

  const str = (v) => (typeof v === "string" ? v.trim() : "");
  const email = str(body.email);
  if (!email) {
    res.status(400).json({ ok: false, error: "E-mail é obrigatório" });
    return;
  }

  const tags = ["diagnostico-projeto", "nicho-contabilidade"];

  const payload = {
    conversion_identifier: identifier,
    email: email,
    available_for_mailing: true,
    tags: tags,
  };
  const name = str(body.nome);            if (name) payload.name = name;
  const office = str(body.escritorio);    if (office) payload.company_name = office;
  const jobTitle = str(body.cargo);       if (jobTitle) payload.job_title = jobTitle;
  const phone = str(body.telefone);       if (phone) payload.mobile_phone = phone;

  // Base legal (LGPD) quando o contato autorizou o contato
  if (body.lgpd) {
    payload.legal_bases = [
      { category: "communications", type: "consent", status: "granted" },
    ];
  }

  try {
    const rdRes = await fetch(
      "https://api.rd.services/platform/conversions?api_key=" + encodeURIComponent(apiKey),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_type: "CONVERSION", event_family: "CDP", payload: payload }),
      }
    );
    const text = await rdRes.text();
    if (!rdRes.ok) {
      console.error("RD Station erro", rdRes.status, text);
      res.status(502).json({
        ok: false,
        error: "Falha ao registrar a conversão no RD Station",
        status: rdRes.status,
        detail: text.slice(0, 600),
      });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Erro de conexão com o RD Station", err);
    res.status(500).json({ ok: false, error: "Erro de conexão com o RD Station" });
  }
};
