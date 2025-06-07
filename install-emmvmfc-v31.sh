#!/bin/bash

# Script de Instalação Rápida - EMMVMFC v3.1
# Sistema de Refeições Escolares
# Escola Municipal Militarizada de Vicentinópolis Manoel Fernandes da Cunha

echo "🏫 EMMVMFC v3.1 - Instalação"
echo "=========================="

# Verificar se o script install.sh existe no diretório atual
if [ -f "./install.sh" ]; then
    echo "✅ Encontrado script de instalação local"
    chmod +x ./install.sh
    ./install.sh
else
    echo "❌ Script de instalação não encontrado no diretório atual"
    echo "🔄 Tentando baixar do repositório..."
    
    # Tentar baixar do repositório
    if git clone --depth 1 https://github.com/SIWUMS/gme-saas.git /tmp/gme-saas; then
        echo "✅ Repositório clonado com sucesso"
        if [ -f "/tmp/gme-saas/scripts/install.sh" ]; then
            echo "✅ Script de instalação encontrado no repositório"
            chmod +x /tmp/gme-saas/scripts/install.sh
            /tmp/gme-saas/scripts/install.sh
        else
            echo "❌ Script de instalação não encontrado no repositório"
            exit 1
        fi
    else
        echo "❌ Falha ao clonar o repositório"
        echo "⚠️ Por favor, execute o script install.sh manualmente"
        exit 1
    fi
fi

echo "✅ Instalação EMMVMFC v3.1 concluída!"
echo "🌐 Acesse: https://gestor.emmvmfc.com.br"
