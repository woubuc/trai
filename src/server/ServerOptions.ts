import { Plugin, Task } from '..';

export interface ServerOptions {
	logging : boolean;

	routeDirectories : string[];
	plugins : Promise<Plugin<any, any>>[];
	middleware : Task<any, any, any>[];
}
