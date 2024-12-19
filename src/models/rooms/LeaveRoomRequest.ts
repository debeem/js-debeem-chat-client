import { BaseRequest } from "../BaseRequest";


export interface LeaveRoomRequest extends BaseRequest
{
	/**
	 * 	room number of a string type
	 */
	roomId : string;
}
