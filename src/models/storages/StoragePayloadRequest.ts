import { BaseRequest } from "../BaseRequest";

/**
 * 	@interface
 */
export interface StoragePayloadRequest extends BaseRequest
{
	/**
	 * 	chat room id
	 * 	@type {string}
	 * 	@description start with 'p'|'g', and, max length was limited to 42-256
	 */
	roomId ?: string;

	/**
	 * 	@type {any}
	 */
	payload : any;
}
