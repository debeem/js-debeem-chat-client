import { CreateGroupChatPayload } from "./CreateGroupChatPayload";

/**
 * 	@interface
 */
export interface UpdateRoomPayload extends CreateGroupChatPayload
{
	/**
	 * 	a mask list of fields to be updated
	 * 	@type { Array< string > }
	 */
	mask : Array< string >;
}
