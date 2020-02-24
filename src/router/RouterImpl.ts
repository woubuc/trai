import { HTTPMethod } from 'find-my-way';

import { RouteBuilder } from '..';

import { RouterOptions } from './RouterOptions';
import { Router } from './Router';
import { RouterBuilderImpl } from './RouterBuilderImpl';
import { RouterBuilder } from './RouterBuilder';
import { RouteBuilderImpl } from '../route/RouteBuilderImpl';
import { RestServerImpl } from '../server/RestServerImpl';
import { RouteOptions } from '../route/RouteOptions';

export class RouterImpl<Data> implements Router<Data> {

	private readonly options : RouterOptions;
	private readonly server : RestServerImpl<Data>;
	private readonly parent ?: RouterImpl<Data>;

	constructor(options : RouterOptions, server : RestServerImpl<Data>, parent ?: RouterImpl<Data>) {
		this.options = options;
		this.server = server;
		this.parent = parent;
	}

	public router() : RouterBuilder<Data> {
		return new RouterBuilderImpl<Data>(this.server);
	}

	public route<T>(method : HTTPMethod, url : string) : RouteBuilder<Data> {
		return new RouteBuilderImpl(this, method, url);
	}

	public addRoute(options : RouteOptions) {
		options.middleware.unshift(...this.options.middleware);
		options.url.unshift(this.options.prefix);

		if (!!this.parent) {
			this.parent.addRoute(options);
		} else {
			this.server.addRoute(options);
		}
	}
}
