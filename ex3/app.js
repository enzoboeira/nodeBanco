import pg from "pg";

const { Client } = pg;

const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "root",
    database: "escola_db",
});

async function listarJogos() {
    try {
        await client.connect();

        const resultado = await client.query(
            "SELECT * FROM jogos"
        );

        resultado.rows.forEach(jogo => {
            console.log(
                `${jogo.id} - ${jogo.titulo} | ${jogo.genero} | Nota: ${jogo.nota} | ${jogo.lancamento}`
            );
        });

    } catch (erro) {
        console.error("Erro:", erro.message);
    } finally {
        await client.end();
    }
}

listarJogos();