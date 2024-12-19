import { VaChatRoomEntityItem } from "../VaChatRoomEntityItem";

/**
 * 	@class
 */
export class VaJoinRoomRequest
{
	/**
	 *	@param joinRoomRequest	{any}
	 *	@returns {string | null}
	 */
	static validateJoinRoomRequest( joinRoomRequest : any ) : string | null
	{
		if ( ! joinRoomRequest )
		{
			return `invalid joinRoomRequest`;
		}

		const errorRoomId : string | null = VaChatRoomEntityItem.isValidRoomId( joinRoomRequest.roomId );
		if ( null !== errorRoomId )
		{
			return errorRoomId;
		}

		//	...
		return null;
	}
}
