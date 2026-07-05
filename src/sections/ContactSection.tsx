import { FormEvent, useState } from 'react';
import EmberButton from '../components/EmberButton';
import FadeIn from '../components/FadeIn';

const EMAIL = 'oscar.diaz@out-studio.net';
const PHONE_DISPLAY = '+57 300 565 8674';
const PHONE_TEL = '+573005658674';

const INPUT_CLASSES =
  'w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#888888] focus:outline-none focus:border-[#FF5733] transition-colors duration-200';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Nuevo proyecto — ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="contacto"
      className="bg-[#0A0A0A] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
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
            <p className="text-[#888888] font-medium leading-relaxed mb-10 max-w-md">
              Cuéntanos qué necesitas y te respondemos con una propuesta clara.
            </p>
          </FadeIn>

          <FadeIn delay={0.25} y={20} className="flex flex-col gap-4">
            <a
              href={`mailto:${EMAIL}`}
              className="text-white font-semibold text-lg sm:text-xl hover:text-[#FF5733] transition-colors duration-200"
            >
              {EMAIL}
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="text-white font-semibold text-lg sm:text-xl hover:text-[#FF5733] transition-colors duration-200"
            >
              {PHONE_DISPLAY}
            </a>
          </FadeIn>
        </div>

        <FadeIn delay={0.2} y={30}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-[#888888] font-medium text-sm">Nombre</span>
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
              <span className="text-[#888888] font-medium text-sm">Email</span>
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
              <span className="text-[#888888] font-medium text-sm">Mensaje</span>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Cuéntanos sobre tu proyecto"
                rows={5}
                className={`${INPUT_CLASSES} resize-none`}
              />
            </label>
            <EmberButton type="submit" className="mt-2 self-start">
              Enviar mensaje
            </EmberButton>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}
