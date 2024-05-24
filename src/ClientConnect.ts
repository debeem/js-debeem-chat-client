import _ from "lodash";
import { io, Socket } from "socket.io-client";
import { ChatRoomStorageService } from "./storages/ChatRoomStorageService";
import { JoinRoomRequest } from "./models/rooms/JoinRoomRequest";
import { JoinRoomResponse } from "./models/rooms/JoinRoomResponse";
import { LeaveRoomResponse } from "./models/rooms/LeaveRoomResponse";
import { LeaveRoomRequest } from "./models/rooms/LeaveRoomRequest";
import { ChatMessage, SendMessageRequest } from "./models/messages/SendMessageRequest";
import { VaJoinRoomRequest } from "./validators/VaJoinRoomRequest";
import { VaLeaveRoomRequest } from "./validators/VaLeaveRoomRequest";
import { VaSendMessageRequest } from "./validators/VaSendMessageRequest";
import { ResponseCallback } from "./models/callbacks/ResponseCallback";
import { ClientReceiveMessageCallback } from "./models/callbacks/ClientReceiveMessageCallback";
import { ExistInRoomRequest } from "./models/rooms/ExistInRoomRequest";
import { VaExistInRoomRequest } from "./validators/VaExistInRoomRequest";
import { PullMessageRequest } from "./models/messages/PullMessageRequest";
import { VaPullMessageRequest } from "./validators/VaPullMessageRequest";
import { PrivateMessageBuilder } from "./builders/PrivateMessageBuilder";
import { GroupMessageBuilder } from "./builders/GroupMessageBuilder";
import { CountMessageRequest } from "./models/messages/CountMessageRequest";
import { VaCountMessageRequest } from "./validators/VaCountMessageRequest";

/**
 * 	@class
 */
export class ClientConnect
{
	serverUrl : string = '';
	socket ! : Socket;
	receiveMessageCallback ! : ClientReceiveMessageCallback;
	chatRoomStorageService ! : ChatRoomStorageService;

	/**
	 *	@param serverUrl	{string}
	 *	@param receiveMessageCallback
	 */
	constructor( serverUrl : string, receiveMessageCallback : ClientReceiveMessageCallback )
	{
		//
		//	documentation:
		//	https://socket.io/docs/v3/client-initialization/
		//
		//	the following forms are similar
		//	const socket = io( "https://server-domain.com" );
		//	const socket = io( "wss://server-domain.com" );
		//
		//	only in the browser when the page is served over https (will not work in Node.js)
		//	const socket = io( "server-domain.com" );
		//
		if ( ! _.isString( serverUrl ) || _.isEmpty( serverUrl ) )
		{
			throw new Error( `invalid serverUrl` );
		}

		this.serverUrl = serverUrl;
		this.socket = io( serverUrl );
		this.receiveMessageCallback = receiveMessageCallback;
		this.chatRoomStorageService = new ChatRoomStorageService( `` );

		//	...
		this._setupEvents();
	}

	/**
	 * 	setup
	 *	@private
	 *	@returns {void}
	 */
	private _setupEvents() : void
	{
		/**
		 * 	events
		 */
		this.socket.on( `connect`, () =>
		{
			//	x8WIv7-mJelg7on_ALbx
			console.log( `connected to server, socket.id :`, this.socket.id );
		} );
		this.socket.on( `connect_error`, () =>
		{
			console.log( `connect error, will reconnect later ...` )
			setTimeout( () =>
			{
				this.socket.connect();
			}, 1000 );
		} );
		this.socket.on( `disconnect`, ( reason ) =>
		{
			console.log( `disconnected from server, socket.id :`, this.socket.id );
			if ( `io server disconnect` === reason )
			{
				//	the disconnection was initiated by the server, you need to reconnect manually
				this.socket.connect();
			}
		} );
		// this.socket.on( `message`, ( serverId : string, roomId : string, message : any ) =>
		// {
		// 	console.log( `message from server: ${ serverId }, roomId: ${ roomId }, `, message );
		// 	this.socket.emit( `ack`, `200` );
		// 	if ( _.isFunction( this.receiveMessageCallback ) )
		// 	{
		// 		this.receiveMessageCallback( serverId, roomId, message );
		// 	}
		// } );

		/**
		 * 	for room
		 */
		this.socket.on( `room-join`, ( response : JoinRoomResponse ) =>
		{
			console.log( `Client :: received room-join response:`, response );
		} );
		this.socket.on( `room-leave`, ( response : LeaveRoomResponse ) =>
		{
			console.log( `Client :: received room-leave response:`, response );
		} );
		this.socket.on( `chat-message`, ( sendMessageRequest : SendMessageRequest, callback : ( ack : any ) => void ) =>
		{
			console.log( `received chat-message: `, sendMessageRequest );
			console.log( `received chat-message: callback :`, callback );
			console.log( `received chat-message: callback is function: `, _.isFunction( callback ) );
			if ( _.isFunction( callback ) )
			{
				console.log( `received chat-message: will call callback` );
				callback( {
					status : `ok`
				} );
			}
			else
			{
				console.log( `received chat-message: callback is not a function` );
			}
			if ( _.isFunction( this.receiveMessageCallback ) )
			{
				//	.payload.body is encrypted string
				this.receiveMessageCallback( sendMessageRequest, ( ack : any ) =>
				{
					console.log( `ReceiveMessageCallback ack:`, ack );
				} );
			}
		} );
	}

	/**
	 *	@param joinRoomRequest	{JoinRoomRequest}
	 *	@param [callback]	{ResponseCallback}
	 *	@returns {void}
	 */
	public joinRoom( joinRoomRequest : JoinRoomRequest, callback ? : ResponseCallback ) : void
	{
		const errorJoinRoomRequest : string | null = VaJoinRoomRequest.validateJoinRoomRequest( joinRoomRequest );
		if ( null !== errorJoinRoomRequest )
		{
			throw new Error( errorJoinRoomRequest );
		}
		this.send( `room-join`, joinRoomRequest, callback );
	}

	/**
	 *	@param leaveRoomRequest		{LeaveRoomRequest}
	 *	@param [callback]		{ResponseCallback}
	 *	@returns {void}
	 */
	public leaveRoom( leaveRoomRequest : LeaveRoomRequest, callback ? : ResponseCallback ) : void
	{
		const errorLeaveRoomRequest : string | null = VaLeaveRoomRequest.validateLeaveRoomRequest( leaveRoomRequest );
		if ( null !== errorLeaveRoomRequest )
		{
			throw new Error( errorLeaveRoomRequest );
		}
		this.send( `room-leave`, leaveRoomRequest, callback );
	}

	/**
	 *	@param existInRoomRequest	{ExistInRoomRequest}
	 *	@param [callback]		{ResponseCallback}
	 *	@returns {void}
	 */
	public existInRoom( existInRoomRequest : ExistInRoomRequest, callback ? : ResponseCallback ) : void
	{
		const errorExistInRoomRequest : string | null = VaExistInRoomRequest.validateExistInRoomRequest( existInRoomRequest );
		if ( null !== errorExistInRoomRequest )
		{
			throw new Error( errorExistInRoomRequest );
		}
		this.send( `room-exist`, existInRoomRequest, callback );
	}

	/**
	 *	@param sendMessageRequest	{SendMessageRequest}
	 *	@param [callback]		{ResponseCallback}
	 *	@returns {void}
	 */
	public sendMessage( sendMessageRequest : SendMessageRequest, callback ? : ResponseCallback ) : void
	{
		const errorSendMessageRequest : string | null = VaSendMessageRequest.validateSendMessageRequest( sendMessageRequest );
		if ( null !== errorSendMessageRequest )
		{
			throw new Error( errorSendMessageRequest );
		}

		//	...
		this.send( `chat-message`, sendMessageRequest, callback );
	}

	/**
	 *	@param privateKey	{string}
	 *	@param chatMessage	{ChatMessage}
	 *	@param [callback]	{ResponseCallback}
	 */
	public sendPrivateMessage( privateKey : string, chatMessage : ChatMessage, callback ? : ResponseCallback ) : void
	{
		new PrivateMessageBuilder().buildMessage( privateKey, chatMessage ).then( ( sendMessageRequest : SendMessageRequest ) =>
		{
			this.sendMessage( sendMessageRequest, callback );

		}).catch( err =>
		{
			throw new Error( err );
		});
	}

	/**
	 *	@param privateKey	{string}
	 *	@param chatMessage	{ChatMessage}
	 *	@param pinCode		{string}
	 *	@param [callback]	{ResponseCallback}
	 */
	public sendGroupMessage( privateKey : string, chatMessage : ChatMessage, pinCode : string, callback ? : ResponseCallback ) : void
	{
		new GroupMessageBuilder().buildMessage( privateKey, chatMessage, pinCode ).then( ( sendMessageRequest : SendMessageRequest ) =>
		{
			this.sendMessage( sendMessageRequest, callback );

		}).catch( err =>
		{
			throw new Error( err );
		});
	}

	/**
	 *	@param pullMessageRequest	{PullMessageRequest}
	 *	@param [callback]		{ResponseCallback}
	 *	@returns {void}
	 */
	public pullMessage( pullMessageRequest : PullMessageRequest, callback ? : ResponseCallback ) : void
	{
		const errorPullMessageRequest : string | null = VaPullMessageRequest.validatePullMessageRequest( pullMessageRequest );
		if ( null !== errorPullMessageRequest )
		{
			throw new Error( errorPullMessageRequest );
		}

		//	...
		this.send( `pull-message`, pullMessageRequest, callback );
	}

	/**
	 *	@param countMessageRequest	{CountMessageRequest}
	 *	@param callback			{ResponseCallback}
	 *	@returns {void}
	 */
	public countMessage( countMessageRequest : CountMessageRequest, callback ? : ResponseCallback ) : void
	{
		const errorCountMessageRequest : string | null = VaCountMessageRequest.validateCountMessageRequest( countMessageRequest );
		if ( null !== errorCountMessageRequest )
		{
			throw new Error( errorCountMessageRequest );
		}

		//	...
		this.send( `count-message`, countMessageRequest, callback );
	}


	/**
	 *	@param eventName	{string}
	 *	@param arg		{any}
	 *	@param [callback]	{ResponseCallback}
	 *	@param [retry]		{number}
	 */
	public send( eventName : string, arg : any, callback ? : ResponseCallback, retry ? : number ) : void
	{
		/**
		 * 	@description
		 * 	https://socket.io/docs/v4/
		 */
		this.socket.timeout( 2000 ).emit( eventName, arg, ( err : any, response : any ) =>
		{
			if ( err )
			{
				//
				//	the other side did not acknowledge the event in the given delay.
				//	let's retry
				//
				if ( undefined === retry )
				{
					retry = 0;
				}
				if ( retry > 3 )
				{
					throw new Error( `failed to send event : ${ eventName }, arg: ${ arg }`, );
				}

				//	...
				this.send( eventName, arg, callback, ++retry );
			}
			else if ( _.isFunction( callback ) )
			{
				callback( response );
			}
		} );
	}
}
