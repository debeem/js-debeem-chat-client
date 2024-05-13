import { VaChatRoomEntityItem } from "./VaChatRoomEntityItem";
import { ExistInRoomRequest } from "../models/rooms/ExistInRoomRequest";

/**
 * 	@class
 */
export class VaExistInRoomRequest
{
	/**
	 *	@param existInRoomRequest	{ExistInRoomRequest}
	 *	@returns {string | null}
	 */
	static validateExistInRoomRequest( existInRoomRequest : ExistInRoomRequest ) : string | null
	{
		if ( ! existInRoomRequest )
		{
			return `invalid existInRoomRequest`;
		}

		const errorRoomId : string | null = VaChatRoomEntityItem.isValidRoomId( existInRoomRequest.roomId );
		if ( null !== errorRoomId )
		{
			return errorRoomId;
		}

		//	...
		return null;
	}
}
