import { useEffect, useState, type FormEvent } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

const menuLeft = [
  { label: "Cerimônia", href: "#cerimonia" },
  { label: "Festa", href: "#festa" },
];

const menuRight = [
  { label: "Presentes", href: "#presentes" },
  { label: "Presença", href: "#presenca" },
];

const weddingDate = new Date("2026-10-03T00:00:00-03:00");

type CountdownTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type Gift = {
  name: string;
  price: string;
  image?: string;
};

type PixAccount = {
  id: string;
  label: string;
  holder: string;
  keyLabel: string;
  key: string;
};

const gifts: Gift[] = [
  {
    name: "Aspirador de pó",
    price: "R$ 180,00",
    image: "/assets/01-item-aspirador.webp",
  },
  {
    name: "Jogo de panela",
    price: "R$ 250,00",
    image: "/assets/12-item-jogo-panela.webp",
  },
  {
    name: "Panela de pressão",
    price: "R$ 150,00",
    image: "/assets/11-item-panela-pressao.webp",
  },
  {
    name: "Tanquinho de lavar roupa",
    price: "R$ 500,00",
    image: "/assets/10-item-tanquinho.webp",
  },
  {
    name: "Lua de mel",
    price: "R$ 150,00",
    image: "/assets/03-item-motel.webp",
  },
  {
    name: "Jantar fora",
    price: "R$ 200,00",
    image: "/assets/16-item-jantar-fora.webp",
  },
  {
    name: "Taxa para não jogar o buquê para sua namorada",
    price: "R$ 100,00",
    image: "/assets/15-item-taxa-nao-jogar-buque.webp",
  },
  {
    name: "Eu serei a próxima noiva: taxa para me passar o buquê",
    price: "R$ 100,00",
    image: "/assets/13-item-proxima-noiva.webp",
  },
  {
    name: "Camisola para apimentar as noites",
    price: "R$ 50,00",
    image: "/assets/02-item-camisola.webp",
  },
  {
    name: "Kit TPM para noiva",
    price: "R$ 30,00",
    image: "/assets/04-item-kit-tpm.webp",
  },
  {
    name: "Lenço para lágrimas de alegria da noiva",
    price: "R$ 50,00",
    image: "/assets/17-item-noiva-chorando.webp",
  },
  {
    name: "Sabugo caso acabe o papel higiênico",
    price: "R$ 50,00",
    image: "/assets/05-item-sabugo.webp",
  },
  {
    name: "Desentupidor para depois que o Bruno usar o banheiro",
    price: "R$ 60,00",
    image: "/assets/06-item-desentupidor.webp",
  },
  {
    name: "Cobertor para a noiva que está sempre coberta de razão",
    price: "R$ 120,00",
    image: "/assets/14-item-coberta-razao.webp",
  },
  {
    name: "Cueca para noite nupcial",
    price: "R$ 100,00",
    image: "/assets/09-item-cueca-sexy.webp",
  },
  {
    name: "Calcinha para noite nupcial",
    price: "R$ 100,00",
    image: "/assets/08-item-calcinha-sexy.webp",
  },
  {
    name: "Boleto",
    price: "R$ 80,00",
    image: "/assets/07-item-boleto.webp",
  },
];

const pixAccounts: PixAccount[] = [
  {
    id: "nubank",
    label: "Nubank",
    holder: "Jamila Barbara Bento",
    keyLabel: "Chave Pix celular",
    key: "35984445486",
  },
  {
    id: "caixa",
    label: "Caixa",
    holder: "Bruno Henrique V. Moraes",
    keyLabel: "Chave Pix CPF",
    key: "14049436680",
  },
];

function getCountdownTime(): CountdownTime {
  const distance = Math.max(0, weddingDate.getTime() - Date.now());

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function WeddingLanding() {
  const [countdownTime, setCountdownTime] = useState<CountdownTime | null>(null);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [selectedPixId, setSelectedPixId] = useState(pixAccounts[0].id);
  const [copiedPix, setCopiedPix] = useState(false);
  const [presenceStatus, setPresenceStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [presenceMessage, setPresenceMessage] = useState("");

  useEffect(() => {
    setCountdownTime(getCountdownTime());

    const timer = window.setInterval(() => {
      setCountdownTime(getCountdownTime());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const countdownItems = [
    { label: "dias", value: countdownTime?.days },
    { label: "horas", value: countdownTime?.hours },
    { label: "minutos", value: countdownTime?.minutes },
    { label: "segundos", value: countdownTime?.seconds },
  ];
  const selectedPixAccount =
    pixAccounts.find((account) => account.id === selectedPixId) ?? pixAccounts[0];

  function openGiftModal(gift: Gift) {
    setSelectedGift(gift);
    setSelectedPixId(pixAccounts[0].id);
    setCopiedPix(false);
  }

  function closeGiftModal() {
    setSelectedGift(null);
    setCopiedPix(false);
  }

  async function copyPixKey() {
    await navigator.clipboard.writeText(selectedPixAccount.key);
    setCopiedPix(true);
  }

  function handlePhoneInput(event: FormEvent<HTMLInputElement>) {
    event.currentTarget.value = formatPhone(event.currentTarget.value);
  }

  async function submitPresence(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPresenceStatus("submitting");
    setPresenceMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const attendance = String(formData.get("attendance") ?? "");
    const isConfirmed = attendance === "sim";
    const rsvpStatus =
      attendance === "sim"
        ? "confirmed"
        : attendance === "pendente"
          ? "pending"
          : "declined";
    const adultCount = Number(formData.get("adultCount") ?? 0);
    const childCount = Number(formData.get("childCount") ?? 0);
    const adultCompanions = Math.max(0, adultCount - 1);
    const companions = isConfirmed
      ? Math.max(0, adultCompanions + childCount)
      : 0;
    const adultNames = String(formData.get("adultNames") ?? "").trim();
    const childNames = String(formData.get("childNames") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const notes = [
      adultNames ? `Adultos:\n${adultNames}` : "",
      childNames ? `Crianças:\n${childNames}` : "",
      message ? `Mensagem:\n${message}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("rsvp_confirmations").insert({
        name: String(formData.get("guestName") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        companions,
        status: rsvpStatus,
        notes: notes || null,
      });

      if (error) {
        throw error;
      }

      form.reset();
      setPresenceStatus("success");
      setPresenceMessage("Confirmação enviada com sucesso. Obrigado pelo carinho!");
    } catch (error) {
      setPresenceStatus("error");
      setPresenceMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar sua confirmação. Tente novamente.",
      );
    }
  }

  return (
    <main className="site-shell">
      <header className="site-header" aria-label="Navegação principal">
        <nav className="nav-inner">
          <div className="nav-group nav-group-left">
            {menuLeft.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>

          <a className="brand-mark" href="#inicio" aria-label="Início">
            J&B
          </a>

          <div className="nav-group nav-group-right">
            {menuRight.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <section className="hero-section" id="inicio" aria-labelledby="hero-title">
        <div className="hero-content">
          <p className="hero-kicker">Jamila & Bruno</p>
          <h1 id="hero-title">Sejam bem-vindos ao nosso site de casamento!</h1>
          <p>
            Criamos este espaço com muito carinho para compartilhar com vocês
            todos os detalhes do nosso grande dia.
          </p>
        </div>
      </section>

      <section className="countdown-section" aria-label="Contagem regressiva">
        <div className="countdown-inner">
          <p className="section-eyebrow">Contagem regressiva</p>
          <div className="countdown-grid">
            {countdownItems.map((item) => (
              <div className="countdown-item" key={item.label}>
                <strong>{String(item.value ?? 0).padStart(2, "0")}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="details-section ceremony-section"
        id="cerimonia"
        aria-labelledby="ceremony-title"
      >
        <div className="section-inner split-layout">
          <div className="section-copy">
            <p className="section-eyebrow">O Grande dia da</p>
            <h2 id="ceremony-title">Cerimônia</h2>
            <dl className="info-list">
              <div>
                <dt>Local</dt>
                <dd>Igreja São Geraldo Magela</dd>
              </div>
              <div>
                <dt>Dia</dt>
                <dd>03/10/2026</dd>
              </div>
              <div>
                <dt>Horário</dt>
                <dd>15h</dd>
              </div>
            </dl>
          </div>

          <figure className="section-media ceremony-media">
            <img
              src="/assets/igreja.webp"
              alt="Fachada da Igreja São Geraldo Magela"
            />
            <img
              src="/assets/igreja-02.webp"
              alt="Interior da Igreja São Geraldo Magela"
            />
          </figure>
        </div>
      </section>

      <section
        className="details-section party-section"
        id="festa"
        aria-labelledby="party-title"
      >
        <div className="section-inner">
          <div className="section-heading">
            <p className="section-eyebrow">Depois do sim</p>
            <h2 id="party-title">Local da Festa</h2>
          </div>

          <div className="party-grid">
            <figure className="section-media">
              <img src="/assets/local.webp" alt="Local da festa" />
            </figure>

            <div className="map-panel" aria-label="Mapa do local da festa">
              <iframe
                title="Mapa do local da festa"
                src="https://www.google.com/maps?q=614%20Estr.%20Parais%C3%B3polis%20Consola%C3%A7%C3%A3o&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="gifts-section"
        id="presentes"
        aria-labelledby="gifts-title"
      >
        <div className="section-inner">
          <div className="section-heading gifts-heading">
            <p className="section-eyebrow">Lista de presentes</p>
            <h2 id="gifts-title">Quer nos presentear?</h2>
            <div className="gifts-intro">
              <p>
                Queridos amigos e familiares, saibam que o maior presente que
                podemos receber é o carinho e a presença de vocês no nosso
                casamento.
              </p>
              <p>
                Se vocês desejam nos abençoar com um presente físico ou
                contribuir com um Pix como forma de presente, ficaremos muito
                felizes!
              </p>
              <p>
                Lembrando que já moramos juntos, por isso já temos a nossa casa
                praticamente completa. Por esse motivo, criamos uma lista
                descontraída para quem quiser contribuir de uma forma leve e
                divertida.
              </p>
            </div>
          </div>

          <div className="gifts-grid">
            {gifts.map((gift) => (
              <article className="gift-card" key={gift.name}>
                <div className="gift-image-wrap">
                  {gift.image ? (
                    <img src={gift.image} alt={gift.name} />
                  ) : (
                    <div className="gift-image-placeholder" aria-hidden="true">
                      J&B
                    </div>
                  )}
                </div>
                <div className="gift-card-content">
                  <h3>{gift.name}</h3>
                  <p>{gift.price}</p>
                  <button type="button" onClick={() => openGiftModal(gift)}>
                    Presentear
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {selectedGift && (
        <div
          className="gift-modal-overlay"
          role="presentation"
          onMouseDown={closeGiftModal}
        >
          <section
            className="gift-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gift-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              onClick={closeGiftModal}
              aria-label="Fechar modal"
            >
              ×
            </button>

            <div className="modal-heading">
              <p className="section-eyebrow">Presente escolhido</p>
              <h2 id="gift-modal-title">{selectedGift.name}</h2>
              <strong>{selectedGift.price}</strong>
            </div>

            <label className="message-field">
              <span>Mensagem opcional</span>
              <textarea
                rows={4}
                placeholder="Escreva uma mensagem carinhosa para os noivos."
              />
            </label>

            <div className="pix-choice" aria-label="Escolha da conta Pix">
              {pixAccounts.map((account) => (
                <label key={account.id}>
                  <input
                    type="radio"
                    name="pix-account"
                    value={account.id}
                    checked={selectedPixId === account.id}
                    onChange={() => {
                      setSelectedPixId(account.id);
                      setCopiedPix(false);
                    }}
                  />
                  <span>{account.label}</span>
                </label>
              ))}
            </div>

            <div className="pix-panel">
              <img src="/assets/pix.webp" alt="Pix" />
              <div className="pix-data">
                <p>
                  <span>Titular</span>
                  <strong>{selectedPixAccount.holder}</strong>
                </p>
                <p>
                  <span>{selectedPixAccount.keyLabel}</span>
                  <strong>{selectedPixAccount.key}</strong>
                </p>
                <button type="button" onClick={copyPixKey}>
                  {copiedPix ? "Chave copiada" : "Copiar chave Pix"}
                </button>
              </div>
            </div>

            <p className="pix-note">
              Para finalizar, copie a chave Pix e realize o pagamento pelo
              aplicativo do seu banco. O site não processa pagamentos nesta
              etapa.
            </p>
          </section>
        </div>
      )}

      <section
        className="presence-section"
        id="presenca"
        aria-labelledby="presence-title"
      >
        <div className="section-inner presence-layout">
          <div className="presence-copy">
            <p className="section-eyebrow">Confirme com carinho</p>
            <h2 id="presence-title">Confirmação de presença</h2>
            <strong>Sua presença é essencial!</strong>
            <p>
              Para nos ajudar a preparar uma celebração perfeita e confortável
              para todos, pedimos a gentileza de confirmar sua presença até o
              dia <b>03/09/26</b>.
            </p>
            <p>
              Caso a presença não seja confirmada até essa data, entenderemos
              que você não poderá comparecer e fecharemos a lista de convidados.
            </p>
            <p>
              Basta preencher os seus dados e os dados dos seus acompanhantes.
              Contamos com você!
            </p>

            <div className="presence-deadline">
              <span>Data limite</span>
              <strong>03/09/26</strong>
            </div>

            <figure className="attention-media">
              <img
                src="/assets/attention.gif"
                alt="Imagem de atenção para confirmação de presença"
              />
            </figure>
          </div>

          <form className="presence-form" onSubmit={submitPresence}>
            <div className="form-section">
              <h3>Dados principais</h3>
              <label>
                <span>Nome completo do convidado responsável</span>
                <input name="guestName" type="text" required />
              </label>
              <label>
                <span>Telefone ou WhatsApp</span>
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  maxLength={15}
                  placeholder="(35) 99999-9999"
                  onInput={handlePhoneInput}
                  required
                />
              </label>
              <fieldset>
                <legend>Confirmação</legend>
                <label>
                  <input
                    name="attendance"
                    type="radio"
                    value="sim"
                    required
                  />
                  <span>Sim, irei ao casamento.</span>
                </label>
                <label>
                  <input name="attendance" type="radio" value="nao" />
                  <span>Não poderei comparecer.</span>
                </label>
                <label>
                  <input name="attendance" type="radio" value="pendente" />
                  <span>Ainda não sei, deixarei pendente.</span>
                </label>
              </fieldset>
            </div>

            <div className="form-section">
              <h3>Acompanhantes adultos</h3>
              <label>
                <span>Quantidade total de adultos, incluindo você</span>
                <input name="adultCount" type="number" min="1" defaultValue="1" />
              </label>
              <label>
                <span>Nomes dos adultos, incluindo você</span>
                <textarea
                  name="adultNames"
                  rows={3}
                  placeholder="Informe um nome por linha, incluindo o seu."
                />
              </label>
            </div>

            <div className="form-section">
              <h3>Crianças</h3>
              <label>
                <span>Quantidade de crianças</span>
                <input name="childCount" type="number" min="0" defaultValue="0" />
              </label>
              <label>
                <span>Nomes das crianças</span>
                <textarea
                  name="childNames"
                  rows={3}
                  placeholder="Informe um nome por linha."
                />
              </label>
            </div>

            <div className="form-section">
              <label>
                <span>Mensagem para os noivos</span>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Campo opcional."
                />
              </label>
            </div>

            <button type="submit" disabled={presenceStatus === "submitting"}>
              {presenceStatus === "submitting"
                ? "Enviando..."
                : "Enviar confirmação"}
            </button>
            {presenceMessage && (
              <p className={`form-feedback form-feedback-${presenceStatus}`}>
                {presenceMessage}
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
