import pg from 'pg';
import promptSync from 'prompt-sync';

const { Client } = pg;
const prompt = promptSync();

const client = new Client({
    host:     'localhost',
    port:     5432,
    user:     'postgres',
    password: 'root',
    database: 'loja_db'
});

async function cadastrarProduto() {

    try {
        await client.connect();

        console.log('\n🛒 CADASTRO DE PRODUTO\n');

        const nome      = prompt('Nome do produto: ');
        const preco     = Number(prompt('Preço: '));
        const estoque   = Number(prompt('Estoque: '));
        const categoria = prompt('Categoria: ');

        const query = `
            INSERT INTO produtos (nome, preco, estoque, categoria)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const valores = [nome, preco, estoque, categoria];

        const resultado = await client.query(query, valores);

        console.log('\n✅ Produto cadastrado com sucesso!');
        console.log('Dados salvos:', resultado.rows[0]);

    } catch (erro) {
        console.log('❌ Erro ao cadastrar produto:', erro.message);

    } finally {
        await client.end();
    }
}

cadastrarProduto();