import { DeepReadonly } from 'ts-essentials';
import { IncomingHttpHeaders } from 'http';

export interface Context {
	url : string;
	headers : IncomingHttpHeaders;

	setStatus(status : number) : void;
	setHeader(name : string, value : string) : void;
}

export type TypedContext<Data extends Record<string, any>> = DeepReadonly<Context & Data>;
