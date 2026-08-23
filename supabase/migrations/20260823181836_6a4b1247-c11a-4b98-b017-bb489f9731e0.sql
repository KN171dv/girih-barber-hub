
INSERT INTO public.site_settings (key, value) VALUES
('brand', jsonb_build_object(
  'name','Gireh Barber Shop',
  'tagline','Barbearia em Rio das Ostras — RJ',
  'logo_url','',
  'hero_title','SEU ESTILO. SUA IDENTIDADE.',
  'hero_subtitle','Mais do que um corte. Uma experiência feita para quem valoriza estilo, presença e cuidado.',
  'hero_media_url','/__l5e/assets-v1/f5716d88-2e85-41de-8470-d7e809ca9e0c/image-7.png',
  'about_title','A Barbearia',
  'about_text','Na Gireh Barber, cada detalhe importa. Do ambiente ao acabamento final, nossa proposta é proporcionar uma experiência completa para quem busca cuidar do visual com estilo, personalidade e qualidade.'
))
ON CONFLICT (key) DO UPDATE SET value = public.site_settings.value || EXCLUDED.value;

INSERT INTO public.site_settings (key, value) VALUES
('contact', jsonb_build_object(
  'whatsapp','5522998367510',
  'phone','(22) 99836-7510',
  'instagram','https://www.instagram.com/girehbarber/'
))
ON CONFLICT (key) DO UPDATE SET value = public.site_settings.value || EXCLUDED.value;

INSERT INTO public.site_settings (key, value) VALUES
('location', jsonb_build_object(
  'address','Alameda Campomar, 49 — Jardim Campomar',
  'city','Rio das Ostras',
  'state','RJ',
  'zip','28890-281',
  'latitude','-22.5573108',
  'longitude','-41.9796738',
  'map_embed_url','https://www.google.com/maps?q=-22.5573108,-41.9796738&z=18&output=embed',
  'directions_url','https://www.google.com/maps/dir/?api=1&destination=-22.5573108,-41.9796738'
))
ON CONFLICT (key) DO UPDATE SET value = public.site_settings.value || EXCLUDED.value;

INSERT INTO public.site_settings (key, value) VALUES
('experience', jsonb_build_object(
  'title','A EXPERIÊNCIA GIREH',
  'subtitle','Um espaço pensado para você desacelerar, cuidar da aparência e sair daqui com a sensação de estar no seu melhor.',
  'items', jsonb_build_array(
    jsonb_build_object('icon','sparkles','title','ESTILO','text','Cortes pensados para valorizar seus traços e o visual que combina com você.'),
    jsonb_build_object('icon','sofa','title','AMBIENTE','text','Um espaço confortável e climatizado, feito para você aguardar e relaxar.'),
    jsonb_build_object('icon','music','title','EXPERIÊNCIA','text','Atendimento com calma, atenção e som ambiente do começo ao fim.'),
    jsonb_build_object('icon','snowflake','title','ACABAMENTO','text','Cuidado nos detalhes finais, que fazem toda a diferença no resultado.')
  )
))
ON CONFLICT (key) DO UPDATE SET value = public.site_settings.value || EXCLUDED.value;

DELETE FROM public.media_items WHERE collection = 'galeria';
INSERT INTO public.media_items (collection, media_type, url, title, sort_order, is_active) VALUES
('galeria','image','/__l5e/assets-v1/f5716d88-2e85-41de-8470-d7e809ca9e0c/image-7.png','Fachada da Gireh Barber Shop',1,true),
('galeria','image','/__l5e/assets-v1/054af43b-54a3-4b87-825f-54908cbcc4aa/image-3.png','Salão da barbearia',2,true),
('galeria','image','/__l5e/assets-v1/58f19a46-f10a-4f4c-8d12-fe410b9c2369/image-5.png','Barbeiro finalizando um corte',3,true),
('galeria','image','/__l5e/assets-v1/5b54da88-7296-4cbd-8478-fcc2b61c675d/image-2.png','Bancada com ferramentas de trabalho',4,true),
('galeria','image','/__l5e/assets-v1/9f074a80-73db-4814-96bd-b737d0023bff/image-4.png','Detalhe do acabamento no corte',5,true),
('galeria','image','/__l5e/assets-v1/9482cdef-33b6-479c-b409-abc1c811950f/image-6.png','Atendimento na cadeira',6,true),
('galeria','image','/__l5e/assets-v1/eb4c7fbd-3a4e-4783-a8c1-04c85d384f35/image.png','Entrada da barbearia com área externa',7,true);
