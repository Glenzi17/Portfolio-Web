import { useEffect, useRef, useState } from 'react';
import { SITE } from '../data/projects.js';
import { magnetize } from '../lib/reveals.js';

/* Formulário de contato. Com SITE.formEndpoint (Formspree etc.) envia por
   fetch; sem endpoint, abre o cliente de e-mail com a mensagem preenchida. */
export default function ContactForm() {
  const formRef = useRef(null);
  const [status, setStatus] = useState('');

  useEffect(() => magnetize(formRef.current), []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.nome || !data.email || !data.mensagem) { setStatus('Preencha nome, e-mail e mensagem.'); return; }
    const endpoint = SITE.formEndpoint || '';
    if (!endpoint) {
      const subject = encodeURIComponent(`Contato pelo portfólio — ${data.nome}`);
      const body = encodeURIComponent(`${data.mensagem}\n\n— ${data.nome}\n${data.email}${data.telefone ? '\n' + data.telefone : ''}`);
      window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
      setStatus('Abrindo seu e-mail…');
      return;
    }
    setStatus('Enviando…');
    try {
      const r = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
      setStatus(r.ok ? 'Mensagem enviada. Obrigado!' : 'Não foi possível enviar. Tente por e-mail.');
      if (r.ok) form.reset();
    } catch {
      setStatus('Não foi possível enviar. Tente por e-mail.');
    }
  };

  return (
    <form className="contact__form" id="contact-form" noValidate data-reveal ref={formRef} onSubmit={onSubmit}>
      <div className="field"><input id="f-nome" name="nome" type="text" placeholder="Nome" autoComplete="name" required /><label htmlFor="f-nome">Nome</label></div>
      <div className="field"><input id="f-email" name="email" type="email" placeholder="E-mail" autoComplete="email" required /><label htmlFor="f-email">E-mail</label></div>
      <div className="field"><input id="f-tel" name="telefone" type="tel" placeholder="Telefone" autoComplete="tel" /><label htmlFor="f-tel">Telefone</label></div>
      <div className="field"><textarea id="f-msg" name="mensagem" placeholder="Mensagem" rows={4} required /><label htmlFor="f-msg">Mensagem</label></div>
      <div className="form__foot">
        <button className="btn btn--lg" type="submit" data-magnetic>Enviar <span className="btn__arrow">→</span></button>
        <span className="form__status small" id="form-status" aria-live="polite">{status}</span>
      </div>
    </form>
  );
}
