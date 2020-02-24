import { DeepReadonly, Primitive } from 'ts-essentials';

export interface ParamsObject<Params extends Record<string, Primitive>> {
	params : DeepReadonly<Params & Record<string, Primitive>>;
}
