export interface BaseRequest
{
	/**
	 * 	owner's wallet address
	 * 	@type {string}
	 */
	wallet : string;

	/**
	 * 	timestamp in time zone 0 when the message was created,
	 * 	specified by the client
	 * 	@type {number}
	 */
	timestamp: number;

	/**
	 * 	hash value of the packet
	 * 	@type {string}
	 * 	@description hex string consisting of 64 characters starting with 0x
	 */
	hash: string;

	/**
	 * 	signature of a message by the message creator
	 * 	using his or her own wallet’s private key.
	 * 	@type {string}
	 * 	@description hex string consisting of 132 characters starting with 0x
	 */
	sig: string;
}
