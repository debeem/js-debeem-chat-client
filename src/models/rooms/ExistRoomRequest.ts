import { BaseRequest } from "../BaseRequest";


export interface ExistRoomRequest extends BaseRequest
{
	/**
	 * 	room number of a string type
	 */
	roomId : string;
}
