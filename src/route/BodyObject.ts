import { DeepReadonly } from 'ts-essentials';

export interface BodyObject<Body extends Record<string, any>> {
	body : DeepReadonly<Body>;
}
