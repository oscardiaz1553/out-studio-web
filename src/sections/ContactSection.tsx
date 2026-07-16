import { FormEvent, useState } from 'react';
import AccentButton from '../components/AccentButton';
import FadeIn from '../components/FadeIn';
import { AZULEJO_BAND } from '../data/botanica';

const EMAIL = 'oscar.diaz@out-studio.net';
const PHONE_DISPLAY = '+57 300 565 8674';
const PHONE_TEL = '+573005658674';

// TODO: crear una access key gratis en https://web3forms.com con el correo
// oscar.diaz@out-studio.net y pegarla aquí para que el formulario envíe
// directo al inbox. Mientras esté vacía, el formulario abre el cliente de
// correo del visitante como respaldo.
const WEB3FORMS_ACCESS_KEY = '';

const INPUT_CLASSES =
  'w-full bg-paper-pure border border-klein-deep/25 rounded-lg px-4 py-3 text-klein-deep placeholder-muted focus:border-klein transition-colors duration-200';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!WEB3FORMS_ACCESS_KEY) {
      const subject = encodeURIComponent(`Nuevo proyecto: ${name}`);
      const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Nuevo proyecto: ${name}`,
          name,
          email,
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section
      id="contacto"
      className="bg-paper border-t border-klein-deep/15 px-6 md:px-10 lg:px-16 py-20 sm:py-24 md:py-32"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-start">
        <div>
          <div className="flex items-baseline gap-4 mb-6 sm:mb-8">
            <span className="text-[11px] tracking-[0.06em] text-carne-tinta">
              04
            </span>
            <h2
              className="font-display font-semibold text-klein tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
            >
              Contacto
            </h2>
          </div>

          <FadeIn delay={0.15} y={20}>
            <p className="text-ink-2 leading-relaxed mb-10 max-w-md">
              Cuéntanos qué necesitas.
            </p>
          </FadeIn>

          <FadeIn delay={0.25} y={20} className="flex flex-col gap-4">
            <a
              href={`mailto:${EMAIL}`}
              className="text-klein font-semibold text-lg sm:text-xl hover:text-carne-tinta transition-colors duration-200"
            >
              {EMAIL}
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="text-klein font-semibold text-lg sm:text-xl hover:text-carne-tinta transition-colors duration-200"
            >
              {PHONE_DISPLAY}
            </a>
          </FadeIn>
        </div>

        <FadeIn delay={0.2} y={30}>
          {status === 'success' ? (
            <div className="rounded-2xl border border-klein/30 bg-paper-pure overflow-hidden flex flex-col items-start">
              {/* Cenefa de azulejo: la recompensa artesanal para quien
                  ya escribió. */}
              <div
                aria-hidden
                className="w-full h-14 border-b border-klein/15"
                style={{
                  backgroundImage: `url(${AZULEJO_BAND})`,
                  backgroundRepeat: 'repeat-x',
                  backgroundSize: 'auto 100%',
                }}
              />
              <div className="px-8 py-12 flex flex-col items-start gap-3">
                <span aria-hidden className="w-3.5 h-3.5 rounded-full bg-carne-deep" />
                <p className="font-display font-semibold text-klein text-xl">
                  Mensaje enviado.
                </p>
                <p className="text-ink-2 leading-relaxed">
                  Gracias por escribirnos. Te respondemos pronto a tu correo.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-[11px] tracking-[0.04em] text-muted">
                  Nombre
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className={INPUT_CLASSES}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[11px] tracking-[0.04em] text-muted">
                  Email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className={INPUT_CLASSES}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[11px] tracking-[0.04em] text-muted">
                  Mensaje
                </span>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Cuéntanos sobre tu proyecto"
                  rows={5}
                  className={`${INPUT_CLASSES} resize-none`}
                />
              </label>
              <AccentButton
                type="submit"
                disabled={status === 'sending'}
                className="mt-2 self-start"
              >
                {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
              </AccentButton>
              {status === 'error' && (
                <p className="text-carne-tinta text-sm leading-relaxed" role="alert">
                  No se pudo enviar el mensaje. Escríbenos directo a{' '}
                  <a href={`mailto:${EMAIL}`} className="underline">
                    {EMAIL}
                  </a>
                  .
                </p>
              )}
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
