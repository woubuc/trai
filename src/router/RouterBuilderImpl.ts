import { Guard, Middleware } from '..';
import { RouterOptions } from './RouterOptions';
import { Router } from './Router';
import { RouterImpl } from './RouterImpl';
import { RouterBuilder } from './RouterBuilder';
import { RestServerImpl } from '../server/RestServerImpl';

export class RouterBuilderImpl<Data extends Record<string, any>> implements RouterBuilder<Data> {

	private options : RouterOptions = {
		prefix: '',
		middleware: [],
	};

	private readonly server : RestServerImpl<Data>;

	public constructor(server : RestServerImpl<Data>) {
		this.server = server;
	}

	prefix(prefix : string) : RouterBuilder<Data> {
		this.options.prefix = prefix;
		return this as any;
	}

	guard(guard : Guard<Data>) : RouterBuilder<Data> {
		this.options.middleware.push(guard);
		return this as any;
	}

	middleware<Out extends Record<string, any>>(middleware : Middleware<Data, Out, any>) : RouterBuilder<Data & Out> {
		this.options.middleware.push(middleware);
		return this as any;
	}

	create() : Router<Data> {
		return new RouterImpl(this.options, this.server);
	}
}
