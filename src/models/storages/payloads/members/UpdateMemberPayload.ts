import { ChatRoomMember } from "../../../../entities/ChatRoomEntity";
import { DefRoomId } from "../DefRoomId";
import { DefMemberKey } from "../DefMemberKey";

/**
 * 	@interface
 */
export interface UpdateMemberPayload extends DefRoomId, DefMemberKey
{
	/**
	 * 	@type {ChatRoomMember}
	 * 	@description member
	 */
	member : ChatRoomMember;
}
