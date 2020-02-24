import { RestServer } from '..';


export type PluginFunction<
	In extends Record<string, any>,
	Out extends Record<string, any>,
> = (server : RestServer<{}>) => Out | Promise<Out>;

export interface Plugin<
	In extends Record<string, any>,
	Out extends Record<string, any>,
> {
	handler: PluginFunction<In, Out>;
}
