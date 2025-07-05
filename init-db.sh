#!/bin/bash
set -e

# Função para criar o banco se não existir
create_database() {
    local database=$1
    echo "Verificando se o banco '$database' existe..."

    # Aguarda o PostgreSQL estar pronto
    until pg_isready -U postgres; do
        echo "Aguardando PostgreSQL..."
        sleep 2
    done

    # Verifica se o banco existe
    if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw "$database"; then
        echo "Banco '$database' já existe."
    else
        echo "Criando banco '$database'..."
        createdb -U postgres "$database"
        echo "Banco '$database' criado com sucesso!"
    fi
}

if [ -n "$POSTGRES_DB" ]; then
    create_database "$POSTGRES_DB"
fi

echo "Inicialização do banco concluída!"
