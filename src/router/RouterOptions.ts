import { Task } from '..';

export interface RouterOptions {
	prefix : string;
	middleware : Task<any, any, any>[];
}
