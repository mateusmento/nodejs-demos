const { fork } = require('child_process');

const hello = fork('hello.js');

process.on('SIGTERM', () => {
	console.log('Terminate');
	hello.kill(9);
	process.exit();
});

process.on('SIGINT', () => {
	console.log('Ctrl-C');
	hello.kill(9);
	process.exit();
});

