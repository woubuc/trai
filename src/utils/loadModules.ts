import klaw, { Item } from 'klaw';
import path from 'path';

const ALLOWED_EXT = ['.js'];

export async function loadModules(rootDirectory : string) : Promise<Map<string, any>> {
	let files = new Map<string, any>();

	let cwd = process.cwd();

	for await (let i of klaw(rootDirectory)) {
		let item = i as Item;

		if (item.stats.isDirectory()) {
			continue;
		}

		let ext = path.extname(item.path);
		if (ALLOWED_EXT.includes(ext)) {
			let name = path.relative(cwd, item.path);
			console.log('loading %s', name);
			let module = await import(item.path);
			files.set(name, module);
		}
	}

	return files;
}
