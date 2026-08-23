delete from public.media_items where barber_id is not null;
delete from public.barbers;
insert into public.barbers (slug, name, role_title, bio, specialties, photo_url, whatsapp, instagram, sort_order, is_active) values
('yuri','Yuri','Barbeiro','Precisão, técnica e atenção aos detalhes para entregar um corte que combine com o seu estilo.','{}','','','',1,true),
('ithalo','Ithalo','Barbeiro','Olhar apurado para acabamentos limpos e cortes atuais, sempre respeitando a personalidade de cada cliente.','{}','','','',2,true),
('yago','Yago','Barbeiro','Criatividade e domínio de estilo para transformar referências em cortes marcantes e bem executados.','{}','','','',3,true),
('carlos','Carlos','Barbeiro','Experiência e cuidado em cada etapa, com foco em conforto, confiança e um resultado impecável.','{}','','','',4,true);