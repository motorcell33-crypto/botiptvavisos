export default {
  // Executa automaticamente de 1h em 1h via Cron da Cloudflare
  async scheduled(controller, env, ctx) {
    // O ctx.waitUntil avisa a Cloudflare para não derrubar o Worker enquanto os delays rodam
    ctx.waitUntil(executarEnvioBanners(env));
  },

  // Resposta simples caso acesse o link pelo navegador
  async fetch(request, env, ctx) {
    return new Response("Bot de Banners automático ativo e protegido contra 429!");
  }
};

async function executarEnvioBanners(env) {
  const grupos = [
    "-1002639652972", // Assistir Flamengo 2
    "-1001597337339", // Jogos do Flamengo 1
    "-1001825003132", // Super Midia HP 3
    "-1001860646849", // Super Mídia HP 4
    "-1001615563422", // Super Mídia HP 5
    "-1001946792700", // Super Mídia HP 6
    "-1001986844811", // Super Mídia HP 7
    "-1001960532297", // Super Mídia HP 8
    "-1001870101218"  // Canais de TV, Filmes e Séries
  ];

  const grupoUrl = "https://t.me/iptvsupermidia";

  // Descobre a hora atual (Formato UTC padrão da Cloudflare)
  const horaAtual = new Date().getUTCHours();
  
  // Alterna: Hora par envia Banner 1, Hora ímpar envia Banner 2
  const enviarBanner1 = (horaAtual % 2 === 0);

  if (enviarBanner1) {
    const textoBanner1 =
      "🚨 <b>ATENÇÃO PESSOAL</b> 🚨\n\n" +
      "O grupo de transmissão será encerrado em breve ❌\n" +
      "Mas calma… agora temos algo <b>MUITO MELHOR</b> 🔥\n\n" +
      "📺 Nosso novo grupo IPTV já está disponível com:\n\n" +
      "✅ <b>TODOS os canais</b>\n" +
      "✅ <b>Filmes atualizados</b>\n" +
      "✅ <b>Séries completas</b>\n" +
      "✅ <b>Jogos ao vivo</b>\n" +
      "✅ <b>Muito mais conteúdo em um só lugar</b>\n\n" +
      "💸 E o melhor: sai <b>MUITO mais barato</b> do que ficar comprando jogo por jogo!\n\n" +
      "Você paga uma única vez e tem acesso completo 🔥\n\n" +
      "👉 <b>NÃO FIQUE DE FORA!</b>\n" +
      "📲 Quem tiver interesse, entre em nosso grupo pelo botão abaixo. 👇";

    for (const chatId of grupos) {
      await enviarMensagemTelegram(env.TELEGRAM_TOKEN, {
        chat_id: chatId,
        text: textoBanner1,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "📲 Entrar no grupo IPTV", url: grupoUrl }]]
        }
      });
      
      // ESPERA 2 SEGUNDOS (2000ms) antes de enviar para o próximo grupo. 
      // Isso evita o erro "Too Many Requests".
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

  } else {
    const foto = "https://i.ibb.co/WWMjLync/file-10.jpg";
    const textoBanner2 =
      "🔥 <b>PROMOÇÃO IMPERDÍVEL</b> 🔥\n\n" +
      "📺 Tenha acesso a canais, filmes e séries por um preço que cabe no seu bolso!\n\n" +
      "💰 <b>Plano mensal:</b> R$30\n\n" +
      "🎯 <b>PROMOÇÃO ESPECIAL:</b>\n" +
      "Assinando <b>3 meses ou mais</b>, você paga apenas\n" +
      "👉 <b>R$25 por mês!</b>\n\n" +
      "🚀 <b>PROGRAMA DE INDICAÇÃO:</b>\n" +
      "Indicou um amigo e ele assinou?\n" +
      "🎁 Você ganha <b>1 MÊS GRÁTIS!</b>\n\n" +
      "Quanto mais indicar, mais meses grátis você ganha!\n\n" +
      "📲 Entre em contato agora e aproveite!";

    for (const chatId of grupos) {
      await enviarFotoTelegram(env.TELEGRAM_TOKEN, {
        chat_id: chatId,
        photo: foto,
        caption: textoBanner2,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "📲 Quero aproveitar", url: grupoUrl }]]
        }
      });
      
      // ESPERA 2 SEGUNDOS (2000ms) antes de enviar para o próximo grupo.
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

async function enviarMensagemTelegram(token: string, payload) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

async function enviarFotoTelegram(token: string, payload) {
  await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
