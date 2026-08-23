
UPDATE public.site_settings SET value = value || jsonb_build_object(
  'address', 'Alameda Campomar, 49 — Cidade Praiana',
  'city', 'Rio das Ostras',
  'state', 'RJ',
  'latitude', '-22.5573108',
  'longitude', '-41.9796738',
  'map_embed_url', 'https://www.google.com/maps?q=-22.5573108,-41.9796738&z=18&hl=pt-BR&output=embed',
  'directions_url', 'https://www.google.com/maps/dir/?api=1&destination=-22.5573108,-41.9796738',
  'panorama_360_url', 'https://www.google.com/maps?q=&layer=c&cbll=-22.5573108,-41.9796738&hl=pt-BR&output=svembed'
) WHERE key = 'location';

UPDATE public.site_settings SET value = value || jsonb_build_object(
  'items', jsonb_build_array(
    jsonb_build_object('day','Segunda a sexta','hours','09h às 20h'),
    jsonb_build_object('day','Sábado','hours','09h às 20h'),
    jsonb_build_object('day','Domingo','hours','Fechado')
  ),
  'note', 'Horário informativo — confira e ajuste com a equipe antes de divulgar.'
) WHERE key = 'hours';

UPDATE public.site_settings SET value = value || jsonb_build_object(
  'tagline', 'Barbearia em Rio das Ostras: conforto, cuidado e ambiente pensado para o seu tempo.',
  'about_title', 'Um ambiente feito para você relaxar',
  'about_text', 'Na Girih Barbearia você encontra um espaço climatizado, com som ambiente e um lounge confortável para aguardar o atendimento, com bebidas à disposição. Cada detalhe foi pensado para que o corte e a barba sejam um momento tranquilo do seu dia, em Rio das Ostras.'
) WHERE key = 'brand';

INSERT INTO public.site_settings (key, value) VALUES
('experience', jsonb_build_object(
  'title','A experiência Girih',
  'subtitle','Mais do que um corte: um intervalo confortável no seu dia.',
  'items', jsonb_build_array(
    jsonb_build_object('icon','snowflake','title','Ambiente climatizado','text','Espaço fresco e agradável em qualquer época do ano.'),
    jsonb_build_object('icon','music','title','Som ambiente','text','Trilha na medida certa para deixar a visita mais leve.'),
    jsonb_build_object('icon','sofa','title','Lounge de espera','text','Poltronas confortáveis para aguardar o seu horário com tranquilidade.'),
    jsonb_build_object('icon','coffee','title','Bebidas','text','Bebidas disponíveis para acompanhar o atendimento.')
  )
)),
('faq', jsonb_build_object(
  'items', jsonb_build_array(
    jsonb_build_object('question','Como faço para agendar um horário?','answer','O agendamento é feito pelo WhatsApp. Use os botões de agendamento do site para falar com a barbearia ou diretamente com o barbeiro de sua preferência.'),
    jsonb_build_object('question','Posso escolher com qual barbeiro quero ser atendido?','answer','Sim. Na página Nossos Barbeiros você conhece cada profissional e pode iniciar a conversa já indicando o nome dele e o serviço desejado.'),
    jsonb_build_object('question','Preciso agendar ou posso ir sem horário marcado?','answer','O agendamento é recomendado para garantir o melhor horário para você. Consulte a disponibilidade pelo WhatsApp.'),
    jsonb_build_object('question','Como funcionam os planos e assinaturas?','answer','Cada plano reúne serviços e créditos mensais com regras próprias, descritas no cartão do plano. Após escolher, a equipe confirma os detalhes com você.'),
    jsonb_build_object('question','Quais são as formas de pagamento?','answer','As formas de pagamento aceitas são informadas no atendimento. O pagamento online das assinaturas será habilitado em breve.'),
    jsonb_build_object('question','Onde fica a barbearia?','answer','Estamos na Alameda Campomar, 49, bairro Cidade Praiana, em Rio das Ostras (RJ). Use o botão Como chegar para traçar a rota.')
  )
))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
