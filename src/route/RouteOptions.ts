import { HTTPMethod } from 'find-my-way';

import { RouteHandler } from './RouteHandler';
import { Task } from '..';

export interface RouteOptions {
	method : HTTPMethod;
	url : string[];

	body : boolean;
	params : string[];

	middleware : Task<any, any, any>[];
	handler ?: RouteHandler<any>;
}
