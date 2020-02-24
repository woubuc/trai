import 'source-map-support/register';

import { server } from './server';

async function main() {
	let port = 8080;
	await server.start(port);
}

main();
