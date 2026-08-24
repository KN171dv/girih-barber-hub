ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS highlight boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS highlight_label text NOT NULL DEFAULT '';

INSERT INTO public.services (name, description, duration_minutes, price_cents, sort_order, is_active, highlight, highlight_label)
SELECT v.name, v.description, v.duration_minutes, v.price_cents, v.sort_order, true, v.highlight, v.highlight_label
FROM (VALUES
  ('Corte Masculino', 'Corte personalizado de acordo com seu estilo.', 30, 3500, 1, false, ''),
  ('Barba', 'Modelagem e acabamento da barba.', 20, 2500, 2, false, ''),
  ('Corte + Barba', 'A combinação completa para renovar o visual.', 50, 5500, 3, true, 'COMPLETO'),
  ('Sobrancelha', 'Acabamento e alinhamento.', 15, 1500, 4, false, ''),
  ('Acabamento', 'Finalização e detalhes do corte.', 10, 1000, 5, false, '')
) AS v(name, description, duration_minutes, price_cents, sort_order, highlight, highlight_label)
WHERE NOT EXISTS (SELECT 1 FROM public.services s WHERE lower(s.name) = lower(v.name));