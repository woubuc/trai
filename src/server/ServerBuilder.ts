import { Middleware, Plugin } from '..';
import { RestServer } from './RestServer';

export interface ServerBuilder<Data extends Record<string, any>> {
	enableLogging() : ServerBuilder<Data>;

	findRoutes(dir : string) : ServerBuilder<Data>;
	middleware<Out extends Record<string, any>>(middleware : Middleware<Data, Out, any>) : ServerBuilder<Data & Out>;
	plugin<Out extends Record<string, any>>(plugin : Plugin<Data, Out> | Promise<Plugin<Data, Out>>) : ServerBuilder<Data & Out>;
	create() : RestServer<Data>;
}
