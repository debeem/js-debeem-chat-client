import { BaseRequest } from "../BaseRequest";


export interface JoinRoomRequest extends BaseRequest
{
	/**
	 * 	room number of a string type
	 */
	roomId : string;
}
