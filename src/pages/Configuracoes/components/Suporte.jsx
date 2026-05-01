import React from 'react';

const Suporte = () => {
  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Suporte e Ajuda</h2>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Fale com a Gente</h3>
          <form className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Assunto</label>
              <select className="form-control">
                <option>Dúvida de Uso</option>
                <option>Reportar Bug</option>
                <option>Sugestão de Melhoria</option>
                <option>Problema com Faturamento</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Mensagem</label>
              <textarea className="form-control" rows="4" placeholder="Descreva como podemos te ajudar..." style={{ resize: 'vertical' }}></textarea>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => alert('Mensagem enviada! Retornaremos em breve.')}>Enviar Mensagem</button>
          </form>
        </div>

        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Perguntas Frequentes (FAQ)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <details style={{ backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', cursor: 'pointer' }}>
              <summary style={{ fontWeight: '500' }}>Como calculo o CMV exato?</summary>
              <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>O CMV é calculado pela soma do custo de cada ML usado no drink dividido pelo preço de venda do drink.</p>
            </details>
            <details style={{ backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', cursor: 'pointer' }}>
              <summary style={{ fontWeight: '500' }}>Posso usar no celular?</summary>
              <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Sim, o PulseBar é totalmente responsivo e funciona bem em celulares e tablets.</p>
            </details>
            <details style={{ backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', cursor: 'pointer' }}>
              <summary style={{ fontWeight: '500' }}>Como gerenciar múltiplas unidades?</summary>
              <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Acesse a aba Multi Unidades, cadastre sua filial e vincule um Gerente Responsável.</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suporte;
