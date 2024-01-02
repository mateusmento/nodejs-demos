const moment = require('moment');

const date = moment();

process.env.TZ = 'America/Sao_Paulo';
console.log(date.format('DD/MM/YYYY HH:mm'));
process.env.TZ = 'Europe/Amsterdam';
console.log(date.format('DD/MM/YYYY HH:mm'));
process.env.TZ = 'UTC';
console.log(date.format('DD/MM/YYYY HH:mm'));
