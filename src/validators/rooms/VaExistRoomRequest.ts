import { VaChatRoomEntityItem } from "../VaChatRoomEntityItem";

/**
 * 	@class
 */
export class VaExistRoomRequest
{
	/**
	 *	@param existRoomRequest	{any}
	 *	@returns {string | null}
	 */
	static validateExistRoomRequest( existRoomRequest : any ) : string | null
	{
		if ( ! existRoomRequest )
		{
			return `invalid existInRoomRequest`;
		}

		const errorRoomId : string | null = VaChatRoomEntityItem.isValidRoomId( existRoomRequest.roomId );
		if ( null !== errorRoomId )
		{
			return errorRoomId;
		}

		//	...
		return null;
	}
}
