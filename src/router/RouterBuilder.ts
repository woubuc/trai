import { Guard, Middleware } from '..';
import { Router } from './Router';

export interface RouterBuilder<Data extends Record<string, any>> {

	prefix(prefix : string) : RouterBuilder<Data>;

	guard(guard : Guard<Data>) : RouterBuilder<Data>;
	middleware<Out extends Record<string, any>>(middleware : Middleware<Data, Out, any>) : RouterBuilder<Data & Out>;

	create() : Router<Data>;
}

