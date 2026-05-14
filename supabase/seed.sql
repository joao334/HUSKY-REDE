insert into public.products (
  id, name, slug, category, short_description, full_description, price, promotional_price,
  estimated_cost, stock_quantity, image_url, gallery, ingredients_text, size,
  is_available, is_featured, is_best_seller, is_limited
)
values
('10000000-0000-0000-0000-000000000001','Lambe Lambe Brigadeiro','lambe-lambe-brigadeiro','Bolos de pote','Bolo de chocolate com muito brigadeiro cremoso e granulado.','Bolo de chocolate molhadinho, camadas generosas de brigadeiro cremoso e granulado macio. Um clássico da matilha para dias que pedem conforto.',18.00,null,7.20,18,'/assets/husky/bolo-brigadeiro.png','["/assets/husky/bolo-brigadeiro.png"]','Chocolate 50%, leite condensado, creme de leite, granulado e bolo de chocolate.','Pote 250 ml',true,true,true,false),
('10000000-0000-0000-0000-000000000002','Uivo de Prestígio','uivo-de-prestigio','Bolos de pote','Bolo de chocolate com creme de coco e cobertura cremosa.','Chocolate macio com creme de coco delicado, finalizado com uma cobertura cremosa que deixa o pote equilibrado e marcante.',18.00,null,7.50,13,'/assets/husky/bolo-prestigio.png','["/assets/husky/bolo-prestigio.png"]','Coco ralado, chocolate, leite condensado, creme de leite e bolo de chocolate.','Pote 250 ml',true,true,false,false),
('10000000-0000-0000-0000-000000000003','Abana Rabo','abana-rabo','Bolos de pote','Brigadeiro cremoso com maracujá, equilibrando doçura e acidez.','Um pote vibrante com brigadeiro branco, maracujá e massa leve. Doce na medida, com aquele azedinho que acorda o paladar.',18.00,null,7.10,9,'/assets/husky/bolo-maracuja.png','["/assets/husky/bolo-maracuja.png"]','Maracujá, brigadeiro branco, massa de baunilha e creme de leite.','Pote 250 ml',true,false,false,true),
('10000000-0000-0000-0000-000000000004','Pata Crocante','pata-crocante','Bolos de pote','Bolo de pote com creme, chocolate e Oreo crocante.','Camadas de creme leve, chocolate e Oreo em pedaços para uma mordida crocante e cremosa ao mesmo tempo.',18.00,null,7.80,0,'/assets/husky/mascote.png','["/assets/husky/mascote.png"]','Oreo, chocolate, creme branco, leite condensado e massa de chocolate.','Pote 250 ml',false,true,false,false),
('10000000-0000-0000-0000-000000000005','brAUnie','braunie','Brownies','Brownie intenso e chocolatudo da matilha.','Brownie de casquinha brilhante, centro úmido e sabor profundo de chocolate. Pequeno no tamanho, enorme no uivo.',14.90,null,5.40,24,'/assets/husky/post.PNG','["/assets/husky/post.PNG"]','Chocolate, manteiga, cacau, ovos, farinha e açúcar.','Unidade 90 g',true,true,true,false),
('10000000-0000-0000-0000-000000000006','Combo Matilha 3 sabores','combo-matilha-3-sabores','Combos','Escolha 3 bolos de pote para dividir, presentear ou guardar para mais tarde.','Informe os sabores na observação. Se algum acabar, a loja chama no chat e combina a melhor substituição.',50.00,48.00,18.50,8,'/assets/husky/hero.png','["/assets/husky/hero.png"]','Sabores sortidos conforme disponibilidade.','3 potes de 250 ml',true,true,false,false),
('10000000-0000-0000-0000-000000000007','Kit Presente Husky','kit-presente-husky','Combos','Dois bolos de pote, sacola kraft e cartão com mensagem.','Um presente simples, bonito e pronto para entregar com carinho artesanal.',42.00,null,15.00,6,'/assets/husky/logo.png','["/assets/husky/logo.png"]','Sabores sortidos conforme disponibilidade.','2 potes de 250 ml',true,false,false,false),
('10000000-0000-0000-0000-000000000008','Café gelado da casa','cafe-gelado-da-casa','Bebidas','Café gelado cremoso para acompanhar o bolo de pote.','Feito na hora, com calda da casa e aquele toque geladinho para acompanhar a sobremesa.',12.00,null,4.00,16,'/assets/husky/IMG_7154.JPG.jpeg','["/assets/husky/IMG_7154.JPG.jpeg"]','Café, leite, gelo e calda da casa.','Copo 300 ml',true,false,false,true)
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  short_description = excluded.short_description,
  full_description = excluded.full_description,
  price = excluded.price,
  promotional_price = excluded.promotional_price,
  estimated_cost = excluded.estimated_cost,
  stock_quantity = excluded.stock_quantity,
  image_url = excluded.image_url,
  gallery = excluded.gallery,
  ingredients_text = excluded.ingredients_text,
  size = excluded.size,
  is_available = excluded.is_available,
  is_featured = excluded.is_featured,
  is_best_seller = excluded.is_best_seller,
  is_limited = excluded.is_limited;

insert into public.polls (id, question, starts_at, ends_at, is_active)
values
('20000000-0000-0000-0000-000000000001','Qual sabor deve entrar no cardápio?', now() - interval '1 day', now() + interval '20 days', true)
on conflict (id) do update set question = excluded.question, starts_at = excluded.starts_at, ends_at = excluded.ends_at, is_active = excluded.is_active;

insert into public.poll_options (id, poll_id, option_text)
values
('21000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Ninho com Nutella'),
('21000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000001','Morango com chocolate'),
('21000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000001','Paçoca cremosa'),
('21000000-0000-0000-0000-000000000004','20000000-0000-0000-0000-000000000001','Limão com chocolate branco')
on conflict (id) do update set option_text = excluded.option_text;

update public.coupons
set is_active = false, updated_at = now()
where code in ('PRIMEIRAU', 'AUAU10', 'FRETEAU');

insert into public.coupons (
  id, code, description, discount_type, discount_value, starts_at, ends_at,
  max_uses, uses_per_customer, minimum_order_value, is_active
)
values
('30000000-0000-0000-0000-000000000001','PRIMEIRACOLHER','Primeira colher: R$5 de desconto acima de R$30.','fixed',5,now() - interval '1 day',now() + interval '60 days',100,1,30,true),
('30000000-0000-0000-0000-000000000002','HUSKY10','10% de desconto acima de R$50.','percentage',10,now() - interval '1 day',now() + interval '45 days',200,1,50,true),
('30000000-0000-0000-0000-000000000003','FRETEGRATIS','Frete grátis acima de R$50.','free_shipping',0,now() - interval '1 day',now() + interval '30 days',120,1,50,true),
('30000000-0000-0000-0000-000000000004','NIVERHUSKY','R$8 no mês do aniversário.','fixed',8,now() - interval '1 day',now() + interval '220 days',80,1,40,true)
on conflict (id) do update set
  code = excluded.code,
  description = excluded.description,
  discount_type = excluded.discount_type,
  discount_value = excluded.discount_value,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  max_uses = excluded.max_uses,
  uses_per_customer = excluded.uses_per_customer,
  minimum_order_value = excluded.minimum_order_value,
  is_active = excluded.is_active;

insert into public.posts (id, title, content, type, media_url, product_id, coupon_id, poll_id, status)
values
('40000000-0000-0000-0000-000000000001','O brAUnie chegou na matilha!','Nosso brownie chocolatudo chegou para conquistar seu coração. Crocante por fora, macio por dentro e cheio de personalidade.','Lançamento','/assets/husky/post.PNG','10000000-0000-0000-0000-000000000005',null,null,'published'),
('40000000-0000-0000-0000-000000000002','Lambe Lambe Brigadeiro','Para quem ama chocolate sem medo. Bolo fofinho, brigadeiro cremoso e aquele granulado que faz a diferença.','Produto','/assets/husky/bolo-brigadeiro.png','10000000-0000-0000-0000-000000000001',null,null,'published'),
('40000000-0000-0000-0000-000000000003','Qual sabor você quer ver por aqui?','A matilha manda! Vote no próximo sabor da Husky.','Enquete','/assets/husky/mascote.png',null,null,'20000000-0000-0000-0000-000000000001','published')
on conflict (id) do update set
  title = excluded.title,
  content = excluded.content,
  type = excluded.type,
  media_url = excluded.media_url,
  product_id = excluded.product_id,
  coupon_id = excluded.coupon_id,
  poll_id = excluded.poll_id,
  status = excluded.status;

insert into public.stories (
  id, title, content, media_url, button_text, button_link, product_id, coupon_id,
  starts_at, ends_at, is_active
)
values
('50000000-0000-0000-0000-000000000001','Tem fornada hoje!','Brownies saindo do forno e potinhos fresquinhos.','/assets/husky/post.PNG','Pedir agora','/app/cardapio','10000000-0000-0000-0000-000000000005',null,now() - interval '1 day',now() + interval '3 days',true),
('50000000-0000-0000-0000-000000000002','Últimas unidades','Pata Crocante está quase sumindo da matilha.','/assets/husky/mascote.png','Ver cardápio','/app/cardapio','10000000-0000-0000-0000-000000000004',null,now() - interval '1 day',now() + interval '3 days',true),
('50000000-0000-0000-0000-000000000003','Cupom liberado','Use HUSKY10 acima de R$50.','/assets/husky/logo.png','Usar cupom','/app/cupons',null,'30000000-0000-0000-0000-000000000002',now() - interval '1 day',now() + interval '3 days',true)
on conflict (id) do update set
  title = excluded.title,
  content = excluded.content,
  media_url = excluded.media_url,
  button_text = excluded.button_text,
  button_link = excluded.button_link,
  product_id = excluded.product_id,
  coupon_id = excluded.coupon_id,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  is_active = excluded.is_active;

insert into public.inventory_items (id, name, category, unit, current_quantity, minimum_quantity, unit_cost, supplier, last_purchase_date)
values
('60000000-0000-0000-0000-000000000001','Leite condensado','Ingredientes','un',18,8,6.90,'Fornecedor Husky',current_date - 5),
('60000000-0000-0000-0000-000000000002','Creme de leite','Ingredientes','un',22,10,3.80,'Fornecedor Husky',current_date - 5),
('60000000-0000-0000-0000-000000000003','Chocolate em pó 50%','Ingredientes','kg',4.5,2,32.00,'Fornecedor Husky',current_date - 7),
('60000000-0000-0000-0000-000000000004','Cacau em pó','Ingredientes','kg',1.4,1,48.00,'Fornecedor Husky',current_date - 7),
('60000000-0000-0000-0000-000000000005','Farinha','Ingredientes','kg',8,3,5.50,'Fornecedor Husky',current_date - 8),
('60000000-0000-0000-0000-000000000006','Açúcar','Ingredientes','kg',9,4,4.80,'Fornecedor Husky',current_date - 8),
('60000000-0000-0000-0000-000000000007','Óleo','Ingredientes','l',3,2,7.50,'Fornecedor Husky',current_date - 8),
('60000000-0000-0000-0000-000000000008','Ovos','Ingredientes','un',42,24,0.75,'Fornecedor Husky',current_date - 2),
('60000000-0000-0000-0000-000000000009','Fermento','Ingredientes','kg',0.5,0.3,18.00,'Fornecedor Husky',current_date - 8),
('60000000-0000-0000-0000-000000000010','Granulado','Ingredientes','kg',2.4,1,19.00,'Fornecedor Husky',current_date - 6),
('60000000-0000-0000-0000-000000000011','Coco ralado','Ingredientes','kg',1.2,0.8,24.00,'Fornecedor Husky',current_date - 6),
('60000000-0000-0000-0000-000000000012','Maracujá','Ingredientes','kg',2.2,1,12.00,'Fornecedor Husky',current_date - 1),
('60000000-0000-0000-0000-000000000013','Oreo','Ingredientes','pacote',8,5,4.50,'Fornecedor Husky',current_date - 4),
('60000000-0000-0000-0000-000000000014','Manteiga','Ingredientes','kg',1.5,1,38.00,'Fornecedor Husky',current_date - 5),
('60000000-0000-0000-0000-000000000015','Potes 250 ml','Embalagens','un',52,40,0.72,'Fornecedor Husky',current_date - 3),
('60000000-0000-0000-0000-000000000016','Colheres','Embalagens','un',60,50,0.18,'Fornecedor Husky',current_date - 3),
('60000000-0000-0000-0000-000000000017','Sacolas kraft','Embalagens','un',35,30,0.65,'Fornecedor Husky',current_date - 3),
('60000000-0000-0000-0000-000000000018','Etiquetas','Embalagens','un',80,50,0.12,'Fornecedor Husky',current_date - 3)
on conflict (id) do update set
  current_quantity = excluded.current_quantity,
  minimum_quantity = excluded.minimum_quantity,
  unit_cost = excluded.unit_cost,
  supplier = excluded.supplier,
  last_purchase_date = excluded.last_purchase_date;

insert into public.product_recipes (product_id, inventory_item_id, quantity_used, cost)
values
('10000000-0000-0000-0000-000000000001','60000000-0000-0000-0000-000000000001',0.35,2.42),
('10000000-0000-0000-0000-000000000001','60000000-0000-0000-0000-000000000003',0.04,1.28),
('10000000-0000-0000-0000-000000000001','60000000-0000-0000-0000-000000000015',1,0.72),
('10000000-0000-0000-0000-000000000005','60000000-0000-0000-0000-000000000014',0.04,1.52),
('10000000-0000-0000-0000-000000000005','60000000-0000-0000-0000-000000000004',0.03,1.44)
on conflict (product_id, inventory_item_id) do update set
  quantity_used = excluded.quantity_used,
  cost = excluded.cost;

insert into public.expenses (id, description, category, amount, date, payment_method, observation)
values
('70000000-0000-0000-0000-000000000001','Compra de ingredientes base','Ingredientes',380,current_date - 3,'PIX','Reposição semanal'),
('70000000-0000-0000-0000-000000000002','Impulsionamento Instagram','Marketing',120,current_date - 1,'Cartão','Campanha brAUnie')
on conflict (id) do update set
  description = excluded.description,
  category = excluded.category,
  amount = excluded.amount,
  date = excluded.date,
  payment_method = excluded.payment_method,
  observation = excluded.observation;

insert into public.settings (key, value)
values
('brand', '{
  "name": "Husky Confeiteiro",
  "store_name": "Husky Confeitaria e Caixa",
  "club_name": "Husky Club",
  "slogan": "A rede doce da matilha.",
  "city": "Embu das Artes",
  "state": "SP",
  "whatsapp": "5511945198349",
  "instagram": "@huskyconfeiteiro",
  "instagram_url": "https://www.instagram.com/huskyconfeiteiro/",
  "working_hours": "Terça a quinta 14h-21h; sexta 14h-22h; sábado 12h-22h; domingo 12h-20h",
  "opening_hours": {
    "monday": "Fechado",
    "tuesday": "14:00 às 21:00",
    "wednesday": "14:00 às 21:00",
    "thursday": "14:00 às 21:00",
    "friday": "14:00 às 22:00",
    "saturday": "12:00 às 22:00",
    "sunday": "12:00 às 20:00"
  },
  "address": "Embu das Artes - SP",
  "service_area": ["Centro", "Jardim Vista Alegre", "Parque Pirajussara", "Santo Eduardo"],
  "delivery_fee": 6.99,
  "free_delivery_from": 45,
  "minimum_order": 18,
  "delivery_time": "35-55 min",
  "pickup_time": "20-30 min",
  "orders_enabled": true,
  "payment_provider": "infinitepay",
  "infinitepay_handle": "huskybolos",
  "checkout_function": "create-infinitepay-checkout",
  "check_function": "check-infinitepay-payment",
  "payment_return_url": "https://husky-app.vercel.app/retorno-pagamento.html",
  "primary_color": "#3b6da6",
  "secondary_color": "#577fac",
  "beige": "#edd8ab",
  "cream": "#f5f5f0",
  "brown": "#5f442e",
  "logo_url": "/assets/husky/logo.png",
  "mascot_url": "/assets/husky/mascote.png",
  "hero_url": "/assets/husky/hero.png",
  "chat_emojis": ["😍", "😋", "🥳", "💙", "🍰", "✨", "✅", "🚚"],
  "chat_stickers": [
    { "id": "sticker-01", "label": "Husky 💙", "image": "/assets/husky/sticker-01.png" },
    { "id": "sticker-02", "label": "Amei 😍", "image": "/assets/husky/sticker-02.png" },
    { "id": "sticker-03", "label": "Delícia 😋", "image": "/assets/husky/sticker-03.png" },
    { "id": "sticker-04", "label": "Fornada 🍰", "image": "/assets/husky/sticker-04.png" },
    { "id": "sticker-05", "label": "Entrega 🚚", "image": "/assets/husky/sticker-05.png" }
  ],
  "automatic_whatsapp_message": true
}'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();
