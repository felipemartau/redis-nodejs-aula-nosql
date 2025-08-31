const express = require('express');
const path = require('path');
const redis = require('redis');

const app = express();
let cli = null;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/pedido', async (req, res) => {
  const itens = req.body.itens || [];
  const pedidoId = `pedido:${Date.now()}`;
  await cli.hSet(pedidoId, { itens: JSON.stringify(itens) });
  res.end();
});

app.listen(3000, async () => {
    cli = redis.createClient({
        socket: {
            host: '192.168.0.14',
            port: 6379
        }
    });

    cli.on("error", function (error) {
        console.error(error);
    });

    await cli.connect();

    console.log('conectado', cli.isOpen);
    var ret = await cli.ping();
    console.log(ret)

    console.log('Servidor rodando...');
});

