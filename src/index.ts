import app from './app';

const port = process.env.PORT || 6002;

app.listen(port, () => {
    console.log(`🚀 Servidor iniciado en http://localhost:${port}`);
    console.log(`🔒 Acceso HTTPS: https://localhost:4443`);
}); 