// Textos legales del sitio. Se escriben como HTML porque se muestran con el
// mismo estilo de lectura del blog (prose-out). Si cambia algo de cómo se
// recogen o usan los datos (por ejemplo, si se agrega analítica o cookies de
// seguimiento), hay que actualizar el aviso de privacidad y la fecha.
import { EMAIL, PHONE_DISPLAY } from './site';

export interface LegalDoc {
  slug: 'privacidad' | 'terminos';
  title: string;
  /** Una línea para el encabezado. */
  lead: string;
  updated: string;
  html: string;
}

const CONTACT = `<a href="mailto:${EMAIL}">${EMAIL}</a> o por WhatsApp al ${PHONE_DISPLAY}`;

export const PRIVACY: LegalDoc = {
  slug: 'privacidad',
  title: 'Aviso de Privacidad y Política de Tratamiento de Datos',
  lead: 'Qué datos recogemos, para qué los usamos y cómo puedes ejercer tus derechos.',
  updated: 'octubre de 2026',
  html: `
<p>En Out Studio cuidamos tus datos personales y los tratamos de acuerdo con la Ley 1581 de 2012 y el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015), que regulan la protección de datos personales en Colombia. Este documento es a la vez nuestro aviso de privacidad y nuestra política de tratamiento.</p>

<h2>Quién es el responsable</h2>
<p><strong>Out Studio</strong> es el responsable del tratamiento de los datos que recogemos a través de este sitio, <a href="https://outstudio.online">outstudio.online</a>. Somos un estudio de diseño UX/UI y desarrollo web en Colombia.</p>
<ul>
  <li><strong>Correo:</strong> <a href="mailto:${EMAIL}">${EMAIL}</a></li>
  <li><strong>WhatsApp y teléfono:</strong> ${PHONE_DISPLAY}</li>
</ul>

<h2>Qué datos recogemos y cuándo</h2>
<ul>
  <li><strong>Cuando pides una cotización</strong> (formulario o chat con Mango): tu nombre y tu correo, y de forma opcional tu teléfono o WhatsApp, el nombre de tu empresa o marca y el nombre de quien te recomendó. También las respuestas que nos das sobre tu proyecto: tipo de servicio, presupuesto aproximado, plazos, cómo nos conociste y lo que decidas contarnos.</li>
  <li><strong>Cuando nos escribes por el formulario de contacto:</strong> tu nombre, tu correo y tu mensaje.</li>
  <li><strong>Cuando nos escribes por WhatsApp o por correo:</strong> lo que nos envíes.</li>
  <li><strong>Datos técnicos mínimos:</strong> como cualquier sitio web, el proveedor que lo aloja registra datos técnicos de la conexión, como la dirección IP y el navegador.</li>
</ul>
<p>No te pedimos datos sensibles (por ejemplo, de salud, origen étnico o convicciones) ni datos de menores de edad. Te pedimos que tampoco los incluyas en tus mensajes.</p>

<h2>Para qué usamos tus datos</h2>
<ul>
  <li>Responder tu solicitud y contactarte por el medio que nos indicaste.</li>
  <li>Preparar, enviarte y hacer seguimiento a tu cotización.</li>
  <li>Aplicar el descuento por referido, si llegaste recomendado por alguien.</li>
  <li>Si contratas un proyecto: gestionar el trabajo, la facturación y el soporte.</li>
  <li>Conocer cómo nos encuentran las personas, para mejorar nuestro servicio.</li>
</ul>
<p>No vendemos tus datos ni los cedemos a terceros para publicidad. No te enviaremos publicidad masiva sin tu autorización.</p>

<h2>Tu autorización</h2>
<p>Al enviar un formulario, escribirnos por el chat o contactarnos por cualquiera de nuestros canales, nos autorizas, de manera previa, expresa e informada, a tratar tus datos para las finalidades anteriores. Puedes revocar esta autorización cuando quieras, como se explica más abajo.</p>

<h2>Con quién los compartimos</h2>
<p>Para operar el sitio usamos proveedores que actúan como encargados del tratamiento y solo tratan los datos para prestarnos su servicio:</p>
<ul>
  <li><strong>Web3Forms:</strong> recibe lo que envías por los formularios y nos lo reenvía por correo.</li>
  <li><strong>Resend y Cloudflare:</strong> envío de correos, incluida tu cotización.</li>
  <li><strong>GitHub (GitHub Pages):</strong> aloja el sitio web.</li>
  <li><strong>WhatsApp:</strong> si nos escribes por ahí, aplican también sus propias condiciones.</li>
</ul>
<p>Algunos de estos proveedores tienen sus servidores fuera de Colombia, por ejemplo en Estados Unidos. Al darnos tus datos, autorizas esa transmisión y transferencia, que hacemos únicamente para prestarte el servicio. También podemos compartir información cuando una autoridad competente nos lo exija conforme a la ley.</p>

<h2>Tus derechos</h2>
<p>Como titular de tus datos tienes derecho a:</p>
<ul>
  <li>Conocer, actualizar y rectificar tus datos.</li>
  <li>Pedir prueba de la autorización que nos diste.</li>
  <li>Ser informado sobre el uso que hemos dado a tus datos.</li>
  <li>Revocar la autorización y pedir que eliminemos tus datos, cuando no haya un deber legal o contractual de conservarlos.</li>
  <li>Acceder de forma gratuita a tus datos personales.</li>
  <li>Presentar quejas ante la Superintendencia de Industria y Comercio (<a href="https://www.sic.gov.co" rel="noreferrer">sic.gov.co</a>) por infracciones a la ley, una vez agotado el trámite con nosotros.</li>
</ul>

<h2>Cómo ejercer tus derechos</h2>
<p>Escríbenos a ${CONTACT}, indicando tu nombre, cómo contactarte y qué quieres hacer (consultar, corregir, eliminar o revocar). Para proteger tus datos, podemos pedirte que confirmes tu identidad.</p>
<ul>
  <li><strong>Consultas:</strong> las respondemos en máximo 10 días hábiles. Si necesitamos más tiempo, te avisamos y será máximo de 5 días hábiles adicionales.</li>
  <li><strong>Reclamos</strong> (corregir, eliminar o revocar): los atendemos en máximo 15 días hábiles, prorrogables por 8 días hábiles más, avisándote los motivos.</li>
</ul>

<h2>Cuánto tiempo los guardamos</h2>
<p>Guardamos tus datos mientras sean necesarios para las finalidades descritas y para cumplir obligaciones legales, contables o contractuales. Si una solicitud de cotización no se convierte en un proyecto, los eliminamos cuando ya no los necesitemos o cuando nos lo pidas.</p>

<h2>Cookies y almacenamiento del navegador</h2>
<p>Este sitio no usa cookies de publicidad ni de seguimiento. Usa el almacenamiento del navegador solo para recordar cosas básicas, como que ya viste la animación de entrada o que cerraste el mensaje de Mango. Si más adelante agregamos herramientas de analítica, actualizaremos este aviso.</p>

<h2>Seguridad</h2>
<p>Usamos medidas razonables para proteger tus datos, como conexión cifrada (HTTPS) y acceso restringido a la información. Ningún sistema es completamente infalible; por eso te pedimos no incluir datos sensibles en tus mensajes.</p>

<h2>Menores de edad</h2>
<p>Este sitio no está dirigido a menores de 18 años y no recogemos datos de menores de manera intencional. Si crees que lo hicimos, avísanos y los eliminamos.</p>

<h2>Cambios en este aviso</h2>
<p>Podemos actualizar este documento para reflejar cambios en el servicio o en la ley. Publicaremos la versión vigente en esta página, con su fecha de actualización.</p>

<h2>Contacto</h2>
<p>Para cualquier duda sobre tus datos, escríbenos a ${CONTACT}.</p>
`,
};

export const TERMS: LegalDoc = {
  slug: 'terminos',
  title: 'Términos de Uso',
  lead: 'Las reglas básicas para usar este sitio y cómo funcionan nuestras cotizaciones.',
  updated: 'octubre de 2026',
  html: `
<p>Estos términos regulan el uso del sitio <a href="https://outstudio.online">outstudio.online</a>, de Out Studio. Al usarlo, aceptas lo que dice aquí. Si no estás de acuerdo, te pedimos que no lo uses.</p>

<h2>Qué es este sitio</h2>
<p>Es la presentación de Out Studio, un estudio de diseño UX/UI y desarrollo web en Colombia. Aquí encuentras información de nuestros servicios, proyectos y artículos, y puedes pedir una cotización por el formulario o por el chat con Mango. La información del sitio es de carácter informativo y no constituye por sí sola una oferta vinculante.</p>

<h2>Cotizaciones</h2>
<ul>
  <li>Una cotización es un <strong>valor inicial</strong> calculado con la información que nos das. Puede ajustarse cuando definamos el detalle del proyecto en una reunión uno a uno.</li>
  <li>Cada cotización indica el tiempo durante el cual es válida.</li>
  <li>Una cotización solo nos obliga, y te obliga, cuando la aceptas por escrito, por ejemplo por correo o WhatsApp.</li>
  <li>Los descuentos y planes que mencionamos, como el descuento por referido o Out Emprende, tienen condiciones y se confirman en la propuesta. En Out Emprende, por ejemplo, confirmamos si tu proyecto aplica en la primera conversación.</li>
</ul>

<h2>Cómo se contratan los proyectos</h2>
<p>Cada proyecto se rige por la propuesta que aceptes: allí quedan el alcance, el valor, la forma de pago y los tiempos. Lo que no esté en la propuesta se cotiza aparte. Los costos de terceros, como dominio, hosting, plataformas, aplicaciones y comisiones de pasarelas de pago, corren por tu cuenta, salvo que la propuesta diga otra cosa.</p>

<h2>Uso adecuado del sitio</h2>
<p>Te pedimos usar el sitio de buena fe. No está permitido:</p>
<ul>
  <li>Dar información falsa o suplantar a otra persona en los formularios.</li>
  <li>Intentar vulnerar la seguridad del sitio o interferir con su funcionamiento.</li>
  <li>Usar el sitio para enviar spam, publicidad no solicitada o contenido ilícito.</li>
  <li>Copiar o extraer masivamente el contenido del sitio sin permiso.</li>
</ul>

<h2>Propiedad intelectual</h2>
<p>Los textos, diseños, ilustraciones, el personaje Mango, el logo y la marca Out, y el código del sitio son de Out Studio o se usan con licencia. No puedes copiarlos, modificarlos ni usarlos sin nuestro permiso por escrito.</p>
<p>Los proyectos que mostramos pertenecen a sus dueños y se presentan como referencia de nuestro trabajo. Los derechos sobre los entregables de un proyecto se rigen por la propuesta acordada con cada cliente.</p>

<h2>Enlaces a otros sitios</h2>
<p>El sitio puede enlazar a páginas de clientes, redes sociales y otros terceros. No controlamos esos sitios ni respondemos por su contenido o sus políticas.</p>

<h2>Contenido del blog y disponibilidad</h2>
<p>Los artículos del blog son orientativos: no son asesoría legal, contable ni técnica para tu caso, y no garantizan resultados. Hacemos lo razonable para que el sitio esté disponible y actualizado, pero no garantizamos que funcione sin interrupciones ni errores.</p>

<h2>Límite de responsabilidad</h2>
<p>En la medida en que la ley lo permita, Out Studio no responde por daños indirectos que resulten del uso del sitio o de la información que contiene. Esto no limita los derechos que la ley, incluido el Estatuto del Consumidor (Ley 1480 de 2011), te reconoce.</p>

<h2>Tus datos personales</h2>
<p>El tratamiento de tus datos se rige por nuestro <a href="/privacidad.html">Aviso de Privacidad y Política de Tratamiento de Datos</a>.</p>

<h2>Cambios en estos términos</h2>
<p>Podemos modificar estos términos. La versión vigente es la publicada en esta página, con su fecha de actualización.</p>

<h2>Ley aplicable</h2>
<p>Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia se someterá a los jueces competentes de Colombia.</p>

<h2>Contacto</h2>
<p>Si tienes dudas sobre estos términos, escríbenos a <a href="mailto:${EMAIL}">${EMAIL}</a> o por WhatsApp al ${PHONE_DISPLAY}.</p>
`,
};

export const LEGAL: Record<LegalDoc['slug'], LegalDoc> = { privacidad: PRIVACY, terminos: TERMS };
