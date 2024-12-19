/**
 * 	@interface
 */
export interface QueryRoomPayload
{
	/**
	 * 	room id
	 * 	@type {string}
	 * 	@description start with 'p'|'g', and, max length was limited to 42-256
	 */
	roomId : string;
}
