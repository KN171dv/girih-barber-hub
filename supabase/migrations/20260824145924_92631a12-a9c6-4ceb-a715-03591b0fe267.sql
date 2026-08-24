CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- ============ CLIENTES ============
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'ativo',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clients admin all" ON public.clients FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_clients_phone ON public.clients (phone);

-- ============ AGENDAMENTOS ============
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  customer_name text NOT NULL DEFAULT '',
  customer_phone text NOT NULL DEFAULT '',
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  barber_id uuid REFERENCES public.barbers(id) ON DELETE SET NULL,
  scheduled_date date NOT NULL DEFAULT CURRENT_DATE,
  start_time time NOT NULL DEFAULT '09:00',
  duration_minutes integer NOT NULL DEFAULT 30,
  price_cents integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pendente',
  source text NOT NULL DEFAULT 'manual',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "appointments admin all" ON public.appointments FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_appointments_updated BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_appointments_date ON public.appointments (scheduled_date, start_time);
CREATE INDEX idx_appointments_barber ON public.appointments (barber_id, scheduled_date);

-- impede sobreposicao de horario para o mesmo barbeiro
CREATE OR REPLACE FUNCTION public.check_appointment_conflict()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  conflicting integer;
BEGIN
  IF NEW.status IN ('cancelado', 'nao_compareceu') OR NEW.barber_id IS NULL THEN
    RETURN NEW;
  END IF;
  SELECT count(*) INTO conflicting
  FROM public.appointments a
  WHERE a.barber_id = NEW.barber_id
    AND a.scheduled_date = NEW.scheduled_date
    AND a.id <> NEW.id
    AND a.status NOT IN ('cancelado', 'nao_compareceu')
    AND (NEW.start_time, NEW.start_time + make_interval(mins => GREATEST(NEW.duration_minutes, 1)))
        OVERLAPS (a.start_time, a.start_time + make_interval(mins => GREATEST(a.duration_minutes, 1)));
  IF conflicting > 0 THEN
    RAISE EXCEPTION 'Este barbeiro já possui um agendamento neste horário.';
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_appointments_conflict BEFORE INSERT OR UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.check_appointment_conflict();

-- ============ USUARIOS DO PAINEL ============
CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  display_name text NOT NULL DEFAULT '',
  access_level text NOT NULL DEFAULT 'owner',
  auth_email text NOT NULL UNIQUE,
  auth_user_id uuid,
  is_active boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.admin_users TO service_role;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_admin_users_updated BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.admin_users (username, password_hash, display_name, auth_email)
VALUES ('adm', extensions.crypt('ADM', extensions.gen_salt('bf', 10)), 'ADM', 'adm@painel.girehbarber.local');

-- verificacao de credenciais: somente o servidor (service_role) pode executar
CREATE OR REPLACE FUNCTION public.verify_admin_login(_username text, _password text)
RETURNS TABLE (id uuid, username text, display_name text, access_level text, auth_email text, auth_user_id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT a.id, a.username, a.display_name, a.access_level, a.auth_email, a.auth_user_id
  FROM public.admin_users a
  WHERE lower(a.username) = lower(_username)
    AND a.is_active
    AND a.password_hash = extensions.crypt(_password, a.password_hash);
$$;
REVOKE ALL ON FUNCTION public.verify_admin_login(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_admin_login(text, text) TO service_role;

CREATE OR REPLACE FUNCTION public.set_admin_password(_id uuid, _username text, _password text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  UPDATE public.admin_users
  SET username = COALESCE(NULLIF(_username, ''), username),
      password_hash = CASE WHEN COALESCE(_password,'') = '' THEN password_hash
                           ELSE extensions.crypt(_password, extensions.gen_salt('bf', 10)) END
  WHERE id = _id;
$$;
REVOKE ALL ON FUNCTION public.set_admin_password(uuid, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_admin_password(uuid, text, text) TO service_role;

-- ============ CONFIGURACOES ============
INSERT INTO public.site_settings (key, value) VALUES
('business_hours', '{"days":[
  {"day":"Segunda","open":true,"start":"09:00","end":"20:00","break_start":"12:00","break_end":"13:00"},
  {"day":"Terça","open":true,"start":"09:00","end":"20:00","break_start":"12:00","break_end":"13:00"},
  {"day":"Quarta","open":true,"start":"09:00","end":"20:00","break_start":"12:00","break_end":"13:00"},
  {"day":"Quinta","open":true,"start":"09:00","end":"20:00","break_start":"12:00","break_end":"13:00"},
  {"day":"Sexta","open":true,"start":"09:00","end":"20:00","break_start":"12:00","break_end":"13:00"},
  {"day":"Sábado","open":true,"start":"09:00","end":"20:00","break_start":"","break_end":""},
  {"day":"Domingo","open":false,"start":"","end":"","break_start":"","break_end":""}
]}'::jsonb),
('booking', '{"slot_minutes":30,"min_notice_hours":2,"allow_cancel":true,"revenue_counts_confirmed":true}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ============ DADOS DE DEMONSTRACAO ============
INSERT INTO public.services (name, description, duration_minutes, price_cents, sort_order, is_active) VALUES
('Corte Masculino', 'Corte demonstrativo — ajuste nome, preço e duração no painel.', 30, 3500, 1, true),
('Corte + Barba', 'Serviço demonstrativo — ajuste nome, preço e duração no painel.', 50, 5500, 2, true),
('Barba', 'Serviço demonstrativo — ajuste nome, preço e duração no painel.', 20, 2500, 3, true);

INSERT INTO public.clients (name, phone, notes) VALUES
('João Silva', '(22) 99999-0001', 'Cliente de demonstração'),
('Pedro Santos', '(22) 99999-0002', 'Cliente de demonstração'),
('Carlos Almeida', '(22) 99999-0003', 'Cliente de demonstração'),
('Rafael Lima', '(22) 99999-0004', 'Cliente de demonstração'),
('Bruno Costa', '(22) 99999-0005', 'Cliente de demonstração'),
('Lucas Moreira', '(22) 99999-0006', 'Cliente de demonstração');

INSERT INTO public.appointments
  (client_id, customer_name, customer_phone, service_id, barber_id, scheduled_date, start_time, duration_minutes, price_cents, status, source, notes)
SELECT c.id, c.name, c.phone, s.id, b.id, d.dt, d.hr::time, s.duration_minutes, s.price_cents, d.st, d.src, 'Agendamento de demonstração'
FROM (VALUES
  ('João Silva','Corte Masculino','yuri', CURRENT_DATE, '09:00','confirmado','site'),
  ('Pedro Santos','Corte + Barba','ithalo', CURRENT_DATE, '10:00','confirmado','whatsapp'),
  ('Carlos Almeida','Barba','yago', CURRENT_DATE, '11:00','pendente','manual'),
  ('Rafael Lima','Corte Masculino','carlos', CURRENT_DATE, '14:00','confirmado','site'),
  ('Bruno Costa','Corte + Barba','yuri', CURRENT_DATE, '15:00','pendente','whatsapp'),
  ('Lucas Moreira','Corte Masculino','ithalo', CURRENT_DATE - 1, '09:30','concluido','site'),
  ('João Silva','Corte + Barba','yuri', CURRENT_DATE - 2, '16:00','concluido','whatsapp'),
  ('Pedro Santos','Barba','yago', CURRENT_DATE - 3, '10:30','concluido','manual'),
  ('Carlos Almeida','Corte Masculino','carlos', CURRENT_DATE - 4, '13:00','cancelado','site'),
  ('Rafael Lima','Corte + Barba','ithalo', CURRENT_DATE - 5, '17:00','concluido','site'),
  ('Bruno Costa','Corte Masculino','yago', CURRENT_DATE + 1, '09:00','confirmado','manual'),
  ('Lucas Moreira','Corte + Barba','carlos', CURRENT_DATE + 2, '11:30','pendente','site')
) AS d(cli, srv, barb, dt, hr, st, src)
JOIN public.clients c ON c.name = d.cli
JOIN public.services s ON s.name = d.srv
JOIN public.barbers b ON b.slug = d.barb;