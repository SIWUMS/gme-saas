-- Dados iniciais para o sistema
-- Execute este arquivo após criar o schema

-- Inserir escolas
INSERT INTO escolas (nome, codigo, endereco, telefone, email, diretor, total_alunos) VALUES
('Escola Municipal Centro', 'EMC001', 'Rua Central, 123 - Centro', '(11) 3333-1111', 'centro@emmvmfc.com.br', 'Maria Silva Santos', 450),
('Escola Municipal Norte', 'EMN002', 'Av. Norte, 456 - Bairro Norte', '(11) 3333-2222', 'norte@emmvmfc.com.br', 'João Carlos Lima', 380),
('Escola Municipal Sul', 'EMS003', 'Rua Sul, 789 - Bairro Sul', '(11) 3333-3333', 'sul@emmvmfc.com.br', 'Ana Paula Costa', 520);

-- Inserir usuários (senha padrão: 123456)
INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario, escola_id, ativo) VALUES
('Super Administrador', 'superadmin@sistema.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.BO/QwK', 'administrador', NULL, true),
('Admin Escola Centro', 'admin@escola1.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.BO/QwK', 'administrador', 1, true),
('Maria Silva - Nutricionista', 'nutricionista@escola1.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.BO/QwK', 'nutricionista', 1, true),
('João Santos - Estoquista', 'estoquista@escola1.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.BO/QwK', 'estoquista', 1, true),
('Ana Costa - Servidora', 'servidor@escola1.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.BO/QwK', 'servidor', 1, true);

-- Inserir alimentos da tabela TACO
INSERT INTO alimentos (codigo_taco, nome, categoria, unidade_medida, energia_kcal, proteinas, lipidios, carboidratos, fibra_alimentar, calcio, ferro, sodio, tem_gluten, tem_lactose, eh_vegano, eh_vegetariano) VALUES
('100', 'Arroz, integral, cozido', 'Cereais e derivados', 'g', 124, 2.6, 1.0, 25.8, 2.7, 5, 1.3, 1, false, false, true, true),
('101', 'Arroz, branco, cozido', 'Cereais e derivados', 'g', 128, 2.5, 0.1, 28.1, 1.6, 4, 1.5, 1, false, false, true, true),
('200', 'Feijão, carioca, cozido', 'Leguminosas', 'g', 76, 4.8, 0.5, 13.6, 8.5, 27, 1.3, 2, false, false, true, true),
('201', 'Feijão, preto, cozido', 'Leguminosas', 'g', 77, 4.5, 0.5, 14.0, 8.4, 29, 1.5, 2, false, false, true, true),
('300', 'Frango, peito, sem pele, grelhado', 'Carnes e derivados', 'g', 159, 32.0, 3.0, 0.0, 0.0, 2, 0.4, 63, false, false, false, false),
('301', 'Carne, bovina, músculo, cozida', 'Carnes e derivados', 'g', 219, 36.0, 7.0, 0.0, 0.0, 4, 2.7, 52, false, false, false, false),
('400', 'Leite, vaca, integral', 'Leite e derivados', 'ml', 61, 2.9, 3.2, 4.3, 0.0, 113, 0.1, 4, false, true, false, true),
('401', 'Queijo, minas, frescal', 'Leite e derivados', 'g', 264, 17.4, 20.0, 3.8, 0.0, 579, 0.4, 346, false, true, false, true),
('500', 'Banana, nanica', 'Frutas', 'g', 92, 1.3, 0.1, 23.8, 2.0, 1, 0.4, 1, false, false, true, true),
('501', 'Maçã, fuji, com casca', 'Frutas', 'g', 56, 0.3, 0.4, 15.2, 2.0, 3, 0.1, 1, false, false, true, true),
('600', 'Alface, lisa', 'Hortaliças', 'g', 11, 1.6, 0.2, 1.7, 2.0, 26, 0.4, 10, false, false, true, true),
('601', 'Tomate, salada', 'Hortaliças', 'g', 15, 1.1, 0.2, 3.1, 1.2, 5, 0.3, 4, false, false, true, true),
('700', 'Óleo, soja', 'Óleos e gorduras', 'ml', 884, 0.0, 100.0, 0.0, 0.0, 0, 0.0, 0, false, false, true, true),
('701', 'Azeite, oliva', 'Óleos e gorduras', 'ml', 884, 0.0, 100.0, 0.0, 0.0, 0, 0.0, 0, false, false, true, true);

-- Inserir estoque inicial
INSERT INTO estoque (escola_id, alimento_id, quantidade_atual, quantidade_minima, valor_unitario, data_validade, lote, fornecedor) VALUES
(1, 1, 150.5, 50, 5.50, '2024-12-15', 'LT001', 'Distribuidora ABC'),
(1, 2, 200.0, 80, 4.20, '2024-11-30', 'LT002', 'Distribuidora ABC'),
(1, 3, 25, 30, 8.00, '2024-11-30', 'LT003', 'Grãos & Cia'),
(1, 4, 35, 25, 7.50, '2024-12-10', 'LT004', 'Grãos & Cia'),
(1, 5, 80, 20, 12.00, '2024-09-10', 'LT005', 'Frigorífico Sul'),
(1, 6, 45, 15, 15.00, '2024-08-25', 'LT006', 'Frigorífico Sul'),
(1, 7, 100, 50, 4.50, '2024-10-15', 'LT007', 'Laticínios Norte'),
(1, 8, 12, 15, 6.50, '2024-08-20', 'LT008', 'Óleos Premium'),
(1, 9, 200, 100, 2.50, '2024-07-30', 'LT009', 'Hortifruti Central'),
(1, 10, 150, 80, 3.00, '2024-07-25', 'LT010', 'Hortifruti Central');

-- Inserir turmas
INSERT INTO turmas (escola_id, nome, faixa_etaria, total_alunos, turno) VALUES
(1, 'Berçário A', '0-2 anos', 15, 'integral'),
(1, 'Berçário B', '0-2 anos', 18, 'integral'),
(1, 'Maternal A', '2-3 anos', 20, 'matutino'),
(1, 'Maternal B', '2-3 anos', 22, 'vespertino'),
(1, 'Pré I A', '4-5 anos', 25, 'matutino'),
(1, 'Pré I B', '4-5 anos', 25, 'vespertino'),
(1, '1º Ano A', '6-7 anos', 30, 'matutino'),
(1, '1º Ano B', '6-7 anos', 28, 'vespertino'),
(1, '2º Ano A', '7-8 anos', 32, 'matutino'),
(1, '2º Ano B', '7-8 anos', 30, 'vespertino');

-- Inserir cardápios
INSERT INTO cardapios (escola_id, nome, faixa_etaria, data_inicio, data_fim, status, created_by) VALUES
(1, 'Cardápio Creche - Junho 2024', '0-3 anos', '2024-06-01', '2024-06-30', 'aprovado', 3),
(1, 'Cardápio Pré-escola - Junho 2024', '4-5 anos', '2024-06-01', '2024-06-30', 'aprovado', 3),
(1, 'Cardápio Fundamental - Junho 2024', '6-14 anos', '2024-06-01', '2024-06-30', 'pendente', 3);

-- Inserir refeições do cardápio
INSERT INTO cardapio_refeicoes (cardapio_id, nome, horario, ordem) VALUES
(1, 'Café da Manhã', '07:30', 1),
(1, 'Lanche da Manhã', '09:30', 2),
(1, 'Almoço', '11:30', 3),
(1, 'Lanche da Tarde', '14:30', 4),
(1, 'Jantar', '17:30', 5),
(2, 'Café da Manhã', '07:30', 1),
(2, 'Lanche da Manhã', '09:30', 2),
(2, 'Almoço', '11:30', 3),
(2, 'Lanche da Tarde', '14:30', 4),
(3, 'Lanche da Manhã', '09:30', 1),
(3, 'Almoço', '11:30', 2),
(3, 'Lanche da Tarde', '14:30', 3);

-- Inserir preparações (receitas)
INSERT INTO preparacoes (nome, categoria, rendimento_porcoes, tempo_preparo, modo_preparo, custo_total, custo_porcao, created_by) VALUES
('Arroz Integral', 'Acompanhamentos', 50, 45, 'Lavar o arroz, refogar com cebola e alho, adicionar água e cozinhar por 40 minutos.', 25.00, 0.50, 3),
('Feijão Carioca', 'Leguminosas', 50, 120, 'Deixar de molho por 8 horas, cozinhar na panela de pressão por 40 minutos com temperos.', 40.00, 0.80, 3),
('Frango Grelhado', 'Proteínas', 30, 30, 'Temperar o frango com sal, alho e ervas. Grelhar por 15 minutos de cada lado.', 90.00, 3.00, 3),
('Salada Verde', 'Saladas', 40, 15, 'Lavar e higienizar as folhas, cortar e temperar com azeite e limão.', 20.00, 0.50, 3);

-- Inserir ingredientes das preparações
INSERT INTO preparacao_ingredientes (preparacao_id, alimento_id, quantidade, unidade, custo_unitario, custo_total) VALUES
(1, 1, 2000, 'g', 0.0055, 11.00),
(1, 13, 50, 'ml', 0.0088, 0.44),
(2, 3, 1500, 'g', 0.008, 12.00),
(2, 13, 30, 'ml', 0.0088, 0.26),
(3, 5, 3000, 'g', 0.012, 36.00),
(3, 13, 100, 'ml', 0.0088, 0.88),
(4, 11, 2000, 'g', 0.002, 4.00),
(4, 12, 1000, 'g', 0.003, 3.00),
(4, 14, 50, 'ml', 0.0088, 0.44);

-- Inserir consumo diário (dados dos últimos 30 dias)
INSERT INTO consumo_diario (escola_id, turma_id, data_consumo, quantidade_servida, registrado_por) 
SELECT 
    1,
    (t.id),
    (CURRENT_DATE - INTERVAL '1 day' * generate_series(0, 29)),
    (t.total_alunos + FLOOR(RANDOM() * 10 - 5)),
    4
FROM turmas t
WHERE t.escola_id = 1;

-- Inserir movimentações de estoque
INSERT INTO movimentacoes_estoque (estoque_id, tipo_movimentacao, quantidade, valor_unitario, valor_total, motivo, usuario_id) VALUES
(1, 'entrada', 200.0, 5.50, 1100.00, 'Compra mensal', 4),
(2, 'entrada', 250.0, 4.20, 1050.00, 'Compra mensal', 4),
(3, 'entrada', 50.0, 8.00, 400.00, 'Compra mensal', 4),
(1, 'saida', 49.5, 5.50, 272.25, 'Consumo semanal', 4),
(2, 'saida', 50.0, 4.20, 210.00, 'Consumo semanal', 4);

-- Inserir configurações do sistema
INSERT INTO configuracoes (escola_id, chave, valor, descricao, updated_by) VALUES
(1, 'dias_antecedencia_cardapio', '7', 'Dias de antecedência para criação de cardápio', 2),
(1, 'aprovacao_obrigatoria', 'true', 'Aprovação obrigatória para cardápios', 2),
(1, 'alerta_estoque_baixo', 'true', 'Alertas de estoque baixo', 2),
(1, 'dias_alerta_vencimento', '30', 'Dias para alerta de vencimento', 2),
(1, 'formato_padrao_relatorio', 'pdf', 'Formato padrão para relatórios', 2),
(1, 'backup_automatico', 'true', 'Backup automático habilitado', 2),
(1, 'frequencia_backup', 'diario', 'Frequência do backup automático', 2);
