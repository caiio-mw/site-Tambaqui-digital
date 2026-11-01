const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Importa a nossa conexão com o banco

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Essencial para o Express entender dados em formato JSON

// Rota GET: Buscar todas as medições cadastradas
app.get('/medicoes', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM medicoes ORDER BY data_hora DESC');
        res.json(resultado.rows);
    } catch (erro) {
        console.error("Erro ao buscar medições:", erro);
        res.status(500).json({ erro: "Erro interno no servidor ao consultar o banco de dados." });
    }
});

// Rota POST: Cadastrar uma nova medição enviada pelo front-end incluindo o device_id
app.post('/medicoes', async (req, res) => {
    const { viveiro, ph, temperatura, oxigenio, amonia, nitrito, turbidez, device_id } = req.body;

    try {
        const querySQL = `
            INSERT INTO medicoes (viveiro, ph, temperatura, oxigenio, amonia, nitrito, turbidez, device_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *;
        `;
        
        const valores = [viveiro, ph, temperatura, oxigenio, amonia, nitrito, turbidez, device_id];
        const novoRegistro = await pool.query(querySQL, valores);

        res.status(201).json({
            mensagem: "Medição cadastrada com sucesso!",
            dados: novoRegistro.rows[0]
        });
    } catch (erro) {
        console.error("Erro ao salvar medição:", erro);
        res.status(500).json({ erro: "Erro interno ao salvar a medição no banco de dados." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});