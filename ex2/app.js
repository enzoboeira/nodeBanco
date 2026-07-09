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

async function buscarJogos() {
    try {
        const genero = prompt("Digite o gênero do jogo: ");

        await client.connect();

        const jogos = await client.query(
            `
            SELECT titulo, nota
            FROM jogos
            WHERE genero ILIKE $1
            ORDER BY nota DESC
            `,
            [genero]
        );

        if (jogos.rows.length === 0) {
            console.log(
                "Nenhum jogo encontrado para o gênero informado."
            );
            return;
        }

        console.log("\nJogos encontrados:\n");

        jogos.rows.forEach(jogo => {
            console.log(`${jogo.titulo} - Nota: ${jogo.nota}`);
        });

    } catch (erro) {
        console.error("Erro:", erro.message);
    } finally {
        await client.end();
    }
}

buscarJogos();