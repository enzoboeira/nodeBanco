import pg from 'pg';
const { Client } = pg;

const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "root",
    database: "escola_db",
});

async function seila() {
    try {
        await client.connect();
        console.log("Conectado ao PostgreSQL");

        const total = await client.query(
            "SELECT COUNT(*) AS total FROM alunos"
        );
        console.log(`Total de alunos: ${total.rows[0].total}`);

        const media = await client.query(
            "SELECT AVG(nota) AS media FROM alunos"
        );
        console.log(
            `Média geral da turma: ${Number(media.rows[0].media).toFixed(2)}`
        );
    } catch (erro) {
        console.error("Erro:", erro.message);
    } finally {
        await client.end();
        console.log("Conexão encerrada");
    }
}

seila();