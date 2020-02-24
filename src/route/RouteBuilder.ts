import { Guard, Middleware } from '..';

import { RouteHandler } from './RouteHandler';
import { ParamsObject } from './ParamsObject';
import { BodyObject } from './BodyObject';

export interface RouteBuilder<
	Data extends Record<string, any>,
	RouteData extends Record<string, any> = {},
	Params extends Record<string, any> = {},
> {
	body() : RouteBuilder<Data, RouteData & BodyObject<any>, Params>;
	param<K extends string>(param : K) : RouteBuilder<Data, RouteData, Params & Record<K, any>>;

	guard(guard : Guard<Data & RouteData>) : RouteBuilder<Data,  RouteData, Params>;
	middleware<Out extends Record<string, any>>(middleware : Middleware<Data, Out, any>) : RouteBuilder<Data, RouteData & Out, Params>;

	handle(handler : RouteHandler<Data & RouteData & ParamsObject<Params>>) : void;
}

