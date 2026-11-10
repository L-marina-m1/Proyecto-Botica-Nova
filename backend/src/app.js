const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN === '*' ? true : process.env.CORS_ORIGIN?.split(',') }));
app.use(express.json());
app.get('/', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'Bienvenido a la API de Botica Nova Salud',
        estado: 'Servidor funcionando correctamente'
    });
});


app.get('/api/health', (req, res) => res.json({ ok: true, servicio: 'Botica Nova Salud API' }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/categorias', require('./routes/categorias.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/productos', require('./routes/productos.routes'));
app.use('/api/ventas', require('./routes/ventas.routes'));
app.use('/api/alertas', require('./routes/alertas.routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
