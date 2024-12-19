import { VaChatRoomEntityItem } from "../VaChatRoomEntityItem";

/**
 * 	@class
 */
export class VaLeaveRoomRequest
{
	/**
	 *	@param leaveRequest	{any}
	 *	@returns {string | null}
	 */
	static validateLeaveRoomRequest( leaveRequest : any ) : string | null
	{
		if ( ! leaveRequest )
		{
			return `invalid leaveRequest`;
		}

		const errorRoomId : string | null = VaChatRoomEntityItem.isValidRoomId( leaveRequest.roomId );
		if ( null !== errorRoomId )
		{
			return errorRoomId;
		}

		//	...
		return null;
	}
}
