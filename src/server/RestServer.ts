import { Router } from '..';

export interface RestServer<Data> extends Router<Data> {
	start(port : number) : Promise<void>;
	log(msg : string) : void;
}
