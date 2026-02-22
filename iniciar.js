const concurrently = require('concurrently');

console.log('🚀 Iniciando Webgenda (Backend + Frontend)...');

concurrently([
    { command: 'npm run dev --prefix backend', name: 'Backend', prefixColor: 'bgBlue.bold' },
    { command: 'npm run dev --prefix frontend', name: 'Frontend', prefixColor: 'bgGreen.bold' }
], {
    prefix: 'name',
    killOthers: ['failure', 'success'],
}).result.then(
    () => console.log('✅ Ambos servidores se cerraron exitosamente.'),
    () => console.log('🛑 Servidores detenidos.')
);
