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

async function atualizarJogo() {
    try {
        await client.connect();

        const lista = await client.query(
            "SELECT id, titulo, nota FROM jogos ORDER BY id"
        );

        console.log("\nJogos disponíveis:\n");

        lista.rows.forEach(jogo => {
            console.log(
                `${jogo.id} - ${jogo.titulo} | Nota atual: ${jogo.nota}`
            );
        });

        const id = Number(prompt("\nDigite o ID do jogo: "));
        const novaNota = Number(prompt("Digite a nova nota (0 a 10): "));

        if (isNaN(novaNota) || novaNota < 0 || novaNota > 10) {
            console.log("Erro: a nota deve estar entre 0 e 10.");
            return;
        }

        const jogoAtual = await client.query(
            "SELECT titulo, nota FROM jogos WHERE id = $1",
            [id]
        );

        if (jogoAtual.rows.length === 0) {
            console.log("Erro: jogo não encontrado.");
            return;
        }

        const titulo = jogoAtual.rows[0].titulo;
        const notaAntiga = jogoAtual.rows[0].nota;

        await client.query(
            `
            UPDATE jogos
            SET nota = $1
            WHERE id = $2
            `,
            [novaNota, id]
        );

        console.log(
            `${titulo} atualizado: ${notaAntiga} → ${novaNota}`
        );

    } catch (erro) {
        console.error("Erro:", erro.message);
    } finally {
        await client.end();
    }
}

atualizarJogo();