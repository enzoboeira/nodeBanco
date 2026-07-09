import pg from "pg";
import promptSync from "prompt-sync";

const prompt = promptSync();

const { Client } = pg;

const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "root",
    database: "escola_db",
});

async function cadastrarJogo() {
    const titulo = prompt("Título do jogo: ");
    const genero = prompt("Gênero: ");
    const nota = Number(prompt("Nota (0 a 10): "));
    const lancamento = Number(prompt("Ano de lançamento: "));

    // Validações antes da query
    if (titulo.trim() === "") {
        console.log("Erro: título não pode estar vazio.");
        return;
    }

    if (isNaN(nota) || nota < 0 || nota > 10) {
        console.log("Erro: nota deve estar entre 0 e 10.");
        return;
    }

    if (isNaN(lancamento) || lancamento <= 1970) {
        console.log("Erro: ano deve ser maior que 1970.");
        return;
    }

    try {
        await client.connect();

        const resultado = await client.query(
            `
            INSERT INTO jogos (titulo, genero, nota, lancamento)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [titulo, genero, nota, lancamento]
        );

        console.log("\nJogo cadastrado com sucesso:");
        console.log(resultado.rows[0]);

    } catch (erro) {
        console.error("Erro ao cadastrar:", erro.message);
    } finally {
        await client.end();
    }
}

cadastrarJogo();