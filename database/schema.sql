-- Sistema de Refeições Escolares
-- Schema do Banco de Dados PostgreSQL

-- Tabela de Escolas
CREATE TABLE escolas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    endereco TEXT,
    telefone VARCHAR(20),
    email VARCHAR(255),
    diretor VARCHAR(255),
    total_alunos INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(50) NOT NULL CHECK (tipo_usuario IN ('administrador', 'nutricionista', 'estoquista', 'servidor')),
    escola_id INTEGER REFERENCES escolas(id),
    ativo BOOLEAN DEFAULT true,
    ultimo_acesso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Alimentos (Base TACO)
CREATE TABLE alimentos (
    id SERIAL PRIMARY KEY,
    codigo_taco VARCHAR(20) UNIQUE,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    unidade_medida VARCHAR(20) NOT NULL,
    -- Informações Nutricionais por 100g
    energia_kcal DECIMAL(8,2),
    proteinas DECIMAL(8,2),
    lipidios DECIMAL(8,2),
    carboidratos DECIMAL(8,2),
    fibra_alimentar DECIMAL(8,2),
    calcio DECIMAL(8,2),
    magnesio DECIMAL(8,2),
    fosforo DECIMAL(8,2),
    ferro DECIMAL(8,2),
    sodio DECIMAL(8,2),
    potassio DECIMAL(8,2),
    zinco DECIMAL(8,2),
    vitamina_c DECIMAL(8,2),
    -- Restrições
    tem_gluten BOOLEAN DEFAULT false,
    tem_lactose BOOLEAN DEFAULT false,
    eh_vegano BOOLEAN DEFAULT false,
    eh_vegetariano BOOLEAN DEFAULT false,
    -- Controle
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Estoque
CREATE TABLE estoque (
    id SERIAL PRIMARY KEY,
    escola_id INTEGER REFERENCES escolas(id),
    alimento_id INTEGER REFERENCES alimentos(id),
    quantidade_atual DECIMAL(10,3) NOT NULL DEFAULT 0,
    quantidade_minima DECIMAL(10,3) NOT NULL DEFAULT 0,
    valor_unitario DECIMAL(10,2),
    data_ultima_entrada DATE,
    data_validade DATE,
    lote VARCHAR(100),
    fornecedor VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(escola_id, alimento_id, lote)
);

-- Tabela de Movimentações de Estoque
CREATE TABLE movimentacoes_estoque (
    id SERIAL PRIMARY KEY,
    estoque_id INTEGER REFERENCES estoque(id),
    tipo_movimentacao VARCHAR(20) NOT NULL CHECK (tipo_movimentacao IN ('entrada', 'saida', 'ajuste')),
    quantidade DECIMAL(10,3) NOT NULL,
    valor_unitario DECIMAL(10,2),
    valor_total DECIMAL(10,2),
    motivo TEXT,
    documento VARCHAR(100),
    usuario_id INTEGER REFERENCES usuarios(id),
    data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Cardápios
CREATE TABLE cardapios (
    id SERIAL PRIMARY KEY,
    escola_id INTEGER REFERENCES escolas(id),
    nome VARCHAR(255) NOT NULL,
    faixa_etaria VARCHAR(50) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'pendente', 'aprovado', 'rejeitado')),
    observacoes TEXT,
    aprovado_por INTEGER REFERENCES usuarios(id),
    data_aprovacao TIMESTAMP,
    created_by INTEGER REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Refeições do Cardápio
CREATE TABLE cardapio_refeicoes (
    id SERIAL PRIMARY KEY,
    cardapio_id INTEGER REFERENCES cardapios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    horario TIME NOT NULL,
    ordem INTEGER NOT NULL,
    ativo BOOLEAN DEFAULT true
);

-- Tabela de Preparações (Receitas)
CREATE TABLE preparacoes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    rendimento_porcoes INTEGER NOT NULL,
    tempo_preparo INTEGER, -- em minutos
    modo_preparo TEXT,
    observacoes TEXT,
    custo_total DECIMAL(10,2),
    custo_porcao DECIMAL(10,2),
    created_by INTEGER REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Ingredientes das Preparações
CREATE TABLE preparacao_ingredientes (
    id SERIAL PRIMARY KEY,
    preparacao_id INTEGER REFERENCES preparacoes(id) ON DELETE CASCADE,
    alimento_id INTEGER REFERENCES alimentos(id),
    quantidade DECIMAL(10,3) NOT NULL,
    unidade VARCHAR(20) NOT NULL,
    custo_unitario DECIMAL(10,2),
    custo_total DECIMAL(10,2)
);

-- Tabela de Cardápio Diário
CREATE TABLE cardapio_diario (
    id SERIAL PRIMARY KEY,
    cardapio_id INTEGER REFERENCES cardapios(id),
    refeicao_id INTEGER REFERENCES cardapio_refeicoes(id),
    data_refeicao DATE NOT NULL,
    preparacao_id INTEGER REFERENCES preparacoes(id),
    quantidade_planejada INTEGER NOT NULL,
    quantidade_servida INTEGER DEFAULT 0,
    observacoes TEXT
);

-- Tabela de Turmas
CREATE TABLE turmas (
    id SERIAL PRIMARY KEY,
    escola_id INTEGER REFERENCES escolas(id),
    nome VARCHAR(100) NOT NULL,
    faixa_etaria VARCHAR(50) NOT NULL,
    total_alunos INTEGER NOT NULL DEFAULT 0,
    turno VARCHAR(20) NOT NULL CHECK (turno IN ('matutino', 'vespertino', 'integral')),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Consumo Diário
CREATE TABLE consumo_diario (
    id SERIAL PRIMARY KEY,
    escola_id INTEGER REFERENCES escolas(id),
    turma_id INTEGER REFERENCES turmas(id),
    cardapio_diario_id INTEGER REFERENCES cardapio_diario(id),
    data_consumo DATE NOT NULL,
    quantidade_servida INTEGER NOT NULL,
    observacoes TEXT,
    registrado_por INTEGER REFERENCES usuarios(id),
    registrado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Relatórios Gerados
CREATE TABLE relatorios (
    id SERIAL PRIMARY KEY,
    escola_id INTEGER REFERENCES escolas(id),
    tipo_relatorio VARCHAR(100) NOT NULL,
    parametros JSONB,
    arquivo_path VARCHAR(500),
    gerado_por INTEGER REFERENCES usuarios(id),
    gerado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Configurações do Sistema
CREATE TABLE configuracoes (
    id SERIAL PRIMARY KEY,
    escola_id INTEGER REFERENCES escolas(id),
    chave VARCHAR(100) NOT NULL,
    valor TEXT,
    descricao TEXT,
    updated_by INTEGER REFERENCES usuarios(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(escola_id, chave)
);

-- Tabela de Logs de Auditoria
CREATE TABLE logs_auditoria (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    escola_id INTEGER REFERENCES escolas(id),
    tabela VARCHAR(100) NOT NULL,
    operacao VARCHAR(20) NOT NULL CHECK (operacao IN ('INSERT', 'UPDATE', 'DELETE')),
    registro_id INTEGER,
    dados_anteriores JSONB,
    dados_novos JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para Performance
CREATE INDEX idx_estoque_escola_alimento ON estoque(escola_id, alimento_id);
CREATE INDEX idx_cardapio_diario_data ON cardapio_diario(data_refeicao);
CREATE INDEX idx_consumo_diario_data ON consumo_diario(data_consumo);
CREATE INDEX idx_movimentacoes_data ON movimentacoes_estoque(data_movimentacao);
CREATE INDEX idx_logs_auditoria_data ON logs_auditoria(created_at);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_alimentos_codigo_taco ON alimentos(codigo_taco);

-- Triggers para Auditoria
CREATE OR REPLACE FUNCTION trigger_auditoria()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO logs_auditoria (tabela, operacao, registro_id, dados_anteriores)
        VALUES (TG_TABLE_NAME, TG_OP, OLD.id, row_to_json(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO logs_auditoria (tabela, operacao, registro_id, dados_anteriores, dados_novos)
        VALUES (TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO logs_auditoria (tabela, operacao, registro_id, dados_novos)
        VALUES (TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers nas tabelas principais
CREATE TRIGGER trigger_auditoria_usuarios
    AFTER INSERT OR UPDATE OR DELETE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION trigger_auditoria();

CREATE TRIGGER trigger_auditoria_cardapios
    AFTER INSERT OR UPDATE OR DELETE ON cardapios
    FOR EACH ROW EXECUTE FUNCTION trigger_auditoria();

CREATE TRIGGER trigger_auditoria_estoque
    AFTER INSERT OR UPDATE OR DELETE ON estoque
    FOR EACH ROW EXECUTE FUNCTION trigger_auditoria();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_escolas_updated_at BEFORE UPDATE ON escolas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alimentos_updated_at BEFORE UPDATE ON alimentos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_estoque_updated_at BEFORE UPDATE ON estoque
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cardapios_updated_at BEFORE UPDATE ON cardapios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preparacoes_updated_at BEFORE UPDATE ON preparacoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
