import { HTTPMethod } from 'find-my-way';
import { Guard, Middleware } from '..';

import { RouterImpl } from '../router/RouterImpl';
import { ParamsObject } from './ParamsObject';
import { RouteBuilder } from './RouteBuilder';
import { RouteHandler } from './RouteHandler';
import { RouteOptions } from './RouteOptions';
import { BodyObject } from './BodyObject';

export class RouteBuilderImpl<
	Data extends Record<string, any>,
	RouteData extends Record<string, any>,
	Params extends Record<string, any>,
> implements RouteBuilder<Data, RouteData, Params> {

	private readonly options : RouteOptions;
	private readonly router : RouterImpl<Data>;

	public constructor(router : RouterImpl<Data>, method : HTTPMethod, url : string) {
		this.router = router;

		this.options = {
			method: method,
			url: [url],
			body: false,
			params: [],
			middleware: [],
		};
	}

	// TODO add body validation
	public body() : RouteBuilder<Data, RouteData & BodyObject<any>, Params> {
		this.options.body = true;
		return this as any;
	}

	public param<K extends string>(param : K) : RouteBuilder<Data, RouteData, Params & Record<K, any>> {
		this.options.params.push(param);
		return this as any;
	}

	public guard(guard : Guard<Data & RouteData>) : RouteBuilder<Data, RouteData, Params> {
		this.options.middleware.push(guard);
		return this;
	}

	public middleware<Out extends Record<string, any>>(middleware : Middleware<Data, Out, any>) : RouteBuilder<Data, RouteData & Out, Params> {
		this.options.middleware.push(middleware);
		return this as any;
	}

	public handle(handler : RouteHandler<Data & RouteData & ParamsObject<Params>>) : void {
		this.options.handler = handler;
		this.router.addRoute(this.options);
	}
}
