import { TypedContext } from '..';

export type RouteHandler<Data extends Record<string, any>> = (ctx : TypedContext<Data>) => Record<string, any> | Promise<Record<string, any>>;
