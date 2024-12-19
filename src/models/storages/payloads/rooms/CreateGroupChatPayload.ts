import { ChatRoomMembers } from "../../../../entities/ChatRoomEntity";
import { ChatType } from "../../../messages/SendMessageRequest";
import { DefRoomId } from "../DefRoomId";

/**
 * 	@interface
 */
export interface CreateGroupChatPayload extends DefRoomId
{
	/**
	 * 	@type {ChatType}
	 */
	chatType : ChatType;

	/**
	 * 	chat room name
	 * 	@type {string}
	 * 	@description max length was limited to 3-64
	 */
	name : string;

	/**
	 * 	partner's wallet address,
	 * 	it must be different from the owner's wallet address
	 *
	 * 	@for chatType.PRIVATE
	 * 	@type {string}
	 */
	partnerWallet ?: string;

	/**
	 * 	encryption Key for group chat, max length was limited to 8-64
	 *
	 * 	@for chatType.GROUP
	 * 	@type {string}
	 */
	encryptionKey ?: string;

	/**
	 * 	@type {string}
	 * 	@description max length was limited to 4-16
	 */
	pinCode ?: string;

	/**
	 * 	@type {string}
	 * 	@description room description, max length was limited to 256
	 */
	desc ?: string;

	/**
	 *	member list
	 *
	 * 	@on create	- must be an Array in type of ChatRoomMembers
	 * 	@on update	- will be ignored
	 *
	 * 	@type {ChatRoomMembers}
	 */
	members ?: ChatRoomMembers;
}
