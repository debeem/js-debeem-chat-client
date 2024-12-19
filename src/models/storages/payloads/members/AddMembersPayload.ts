import { ChatRoomMember, ChatRoomMembers } from "../../../../entities/ChatRoomEntity";
import { DefRoomId } from "../DefRoomId";

/**
 * 	@interface
 */
export interface AddMembersPayload extends DefRoomId
{
	/**
	 * 	@type {ChatRoomMembers}
	 * 	@description member
	 */
	members : ChatRoomMembers;
}
