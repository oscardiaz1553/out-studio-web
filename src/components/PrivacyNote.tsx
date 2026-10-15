const HOME = import.meta.env.BASE_URL;

export default function PrivacyNote({ className = '' }: { className?: string }) {
  return (
    <p className={`text-xs leading-snug opacity-70 ${className}`}>
      Al enviar aceptas el tratamiento de tus datos según nuestro{' '}
      <a
        href={`${HOME}privacidad.html`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        Aviso de Privacidad
      </a>
      .
    </p>
  );
}
