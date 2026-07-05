import { FormEvent, useState } from 'react';
import AccentButton from '../components/AccentButton';
import FadeIn from '../components/FadeIn';

const EMAIL = 'oscar.diaz@out-studio.net';
const PHONE_DISPLAY = '+57 300 565 8674';
const PHONE_TEL = '+573005658674';

// TODO: crear una access key gratis en https://web3forms.com con el correo
// oscar.diaz@out-studio.net y pegarla aquí para que el formulario envíe
// directo al inbox. Mientras esté vacía, el formulario abre el cliente de
// correo del visitante como respaldo.
const WEB3FORMS_ACCESS_KEY = '';

const INPUT_CLASSES =
  'w-full bg-black border border-[#606060]/50 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-[#4B8CC8] transition-colors duration-200';

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
      className="bg-[#000000] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-start">
        <div>
          <FadeIn delay={0} y={40}>
            <h2
              className="text-white font-black leading-none tracking-tight mb-6 sm:mb-8"
              style={{ fontSize: 'clamp(3rem, 8vw, 110px)' }}
            >
              Contacto
            </h2>
          </FadeIn>

          <FadeIn delay={0.15} y={20}>
            <p className="text-white/60 font-medium leading-relaxed mb-10 max-w-md">
              Cuéntanos qué necesitas y te respondemos con una propuesta clara.
            </p>
          </FadeIn>

          <FadeIn delay={0.25} y={20} className="flex flex-col gap-4">
            <a
              href={`mailto:${EMAIL}`}
              className="text-white font-semibold text-lg sm:text-xl hover:text-[#4B8CC8] transition-colors duration-200"
            >
              {EMAIL}
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="text-white font-semibold text-lg sm:text-xl hover:text-[#4B8CC8] transition-colors duration-200"
            >
              {PHONE_DISPLAY}
            </a>
          </FadeIn>
        </div>

        <FadeIn delay={0.2} y={30}>
          {status === 'success' ? (
            <div className="rounded-3xl border border-[#4B8CC8]/40 bg-white/5 px-8 py-14 flex flex-col items-start gap-3">
              <span
                aria-hidden
                className="w-3.5 h-3.5 rounded-full bg-[#4B8CC8]"
              />
              <p className="text-white font-semibold text-xl">
                Mensaje enviado.
              </p>
              <p className="text-white/60 leading-relaxed">
                Gracias por escribirnos. Te respondemos pronto a tu correo.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-white/60 font-medium text-sm">
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
                <span className="text-white/60 font-medium text-sm">
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
                <span className="text-white/60 font-medium text-sm">
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
                <p
                  className="text-[#E6C8AD] text-sm leading-relaxed"
                  role="alert"
                >
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
