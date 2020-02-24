import { Middleware, Plugin } from '..';
import { RestServer } from './RestServer';
import { RestServerImpl } from './RestServerImpl';
import { ServerBuilder } from './ServerBuilder';
import { ServerOptions } from './ServerOptions';

export class ServerBuilderImpl<Data extends Record<string, any>> implements ServerBuilder<Data> {

	private options : ServerOptions = {
		logging: false,

		middleware: [],
		routeDirectories: [],
		plugins: [],
	};

	public enableLogging() : ServerBuilder<Data> {
		this.options.logging = true;
		return this;
	}

	public findRoutes(dir : string) : ServerBuilder<Data> {
		this.options.routeDirectories.push(dir);
		return this;
	}

	public middleware<Out extends Record<string, any>>(middleware : Middleware<Data, Out, any>) : ServerBuilder<Data & Out> {
		this.options.middleware.push(middleware);
		return this as any;
	}

	public plugin<Out extends Record<string, any>>(plugin : Plugin<Data, Out> | Promise<Plugin<Data, Out>>) : ServerBuilder<Data & Out> {
		this.options.plugins.push(Promise.resolve(plugin));
		return this as any;
	}

	public create() : RestServer<Data> {
		return new RestServerImpl<Data>(this.options);
	}
}
