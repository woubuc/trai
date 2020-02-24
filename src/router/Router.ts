import { HTTPMethod } from 'find-my-way';

import { RouteBuilder } from '..';

import { RouterBuilder } from './RouterBuilder';

export interface Router<Data> {
	route(method : HTTPMethod, url : string) : RouteBuilder<Data>;
	router() : RouterBuilder<Data>;
}

