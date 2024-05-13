import { describe, expect } from '@jest/globals';
import { ChatRoomStorageService } from "../../../src";
import {
	ChatRoomEntityItem,
	ChatRoomMember,
	ChatRoomMembers,
	ChatRoomMemberType
} from "../../../src";
import { ChatType } from "../../../src";
import { EtherWallet } from "web3id";
import _ from "lodash";
import { VaChatRoomEntityItem } from "../../../src";
import { RoomUtil } from "../../../src";


/**
 *	unit test
 */
describe( "ChatRoomStorageService", () =>
{
	beforeAll( async () =>
	{
	});
	afterAll( async () =>
	{
	});

	describe( "Test saving Private Chat Room", () =>
	{
		it( "should put a Private Chat Room to database", async () =>
		{
			let randomPrivateRoomId = RoomUtil.generateRandomRoomId( ChatType.PRIVATE );
			let randomGroupRoomId = RoomUtil.generateRandomRoomId( ChatType.GROUP );
			const isValidPrivateRoomId = VaChatRoomEntityItem.isValidRoomId( randomPrivateRoomId );
			const isValidGroupRoomId = VaChatRoomEntityItem.isValidRoomId( randomGroupRoomId );
			expect( isValidPrivateRoomId ).toBeNull();
			expect( isValidGroupRoomId ).toBeNull();
		});
	});

	describe( "Test saving Private Chat Room", () =>
	{
		const chatRoomStorageService = new ChatRoomStorageService( `my password` );
		let randomRoomId = RoomUtil.generateRandomRoomId( ChatType.PRIVATE );
		//console.log( `randomRoomId :`, randomRoomId );

		it( "should put a Private Chat Room to database", async () =>
		{
			const BobWalletObj = EtherWallet.createWalletFromMnemonic();
			const AliceWalletObj = EtherWallet.createWalletFromMnemonic();
			const passwordValue = await chatRoomStorageService.encryptPassword( '', '' );

			BobWalletObj.address = BobWalletObj.address.trim().toLowerCase();
			AliceWalletObj.address = AliceWalletObj.address.trim().toLowerCase();
			const item : ChatRoomEntityItem = {
				wallet : BobWalletObj.address,
				chatType : ChatType.PRIVATE,
				name : `Alice and Bob\'s chat room`,
				roomId : randomRoomId,
				// desc : 'Alice and Bob',
				password : passwordValue,
				timestamp : new Date().getTime(),
				members : {
					[ BobWalletObj.address ] : {
						memberType : ChatRoomMemberType.OWNER,
						wallet : BobWalletObj.address,
						publicKey : BobWalletObj.publicKey,
						userName : 'Bob',
						userAvatar : 'https://www.aaa/avatar.png',
						timestamp : new Date().getTime()
					},
					[ AliceWalletObj.address ] : {
						memberType : ChatRoomMemberType.MEMBER,
						wallet : AliceWalletObj.address,
						publicKey : AliceWalletObj.publicKey,
						userName : 'Alice',
						userAvatar : 'https://www.aaa/avatar.png',
						timestamp : new Date().getTime()
					}
				},
			};
			const key : string | null = chatRoomStorageService.getKeyByItem( item );
			expect( key ).toBeDefined();
			expect( _.isString( key ) && ! _.isEmpty( key ) ).toBeTruthy();
			if ( key )
			{
				const saved : boolean = await chatRoomStorageService.put( key, item );
				const itemKey : string | null = chatRoomStorageService.getKeyByItem( item );
				expect( itemKey ).toBeDefined();
				expect( _.isString( itemKey ) && ! _.isEmpty( itemKey ) ).toBeTruthy();
				if ( itemKey )
				{
					const value : ChatRoomEntityItem | null = await chatRoomStorageService.get( itemKey );
					expect( saved ).toBe( true );
					expect( value ).toHaveProperty( 'chatType' );
					expect( value ).toHaveProperty( 'roomId' );
					// expect( value ).toHaveProperty( 'desc' );
					expect( value ).toHaveProperty( 'password' );
					expect( value ).toHaveProperty( 'timestamp' );
					expect( value ).toHaveProperty( 'members' );
					expect( value?.chatType ).toBe( ChatType.PRIVATE );
					expect( value?.roomId ).toBe( item.roomId );
					expect( value?.desc ).toBe( item.desc );
					expect( value?.password ).toBe( item.password );
					expect( value?.timestamp ).toBe( item.timestamp );
					expect( value?.members ).toHaveProperty( BobWalletObj.address );
					expect( value?.members ).toHaveProperty( AliceWalletObj.address );
				}
			}
		});
		it( "should delete the object just saved", async () =>
		{
			const deleted : boolean = await chatRoomStorageService.delete( randomRoomId );
			expect( deleted ).toBeTruthy();
		});
	} );


	describe( "Test saving Group Chat Room", () =>
	{
		const chatRoomStorageService = new ChatRoomStorageService( `my password` );
		let randomRoomId = RoomUtil.generateRandomRoomId( ChatType.GROUP );

		const BobWalletObj = EtherWallet.createWalletFromMnemonic();
		const AliceWalletObj = EtherWallet.createWalletFromMnemonic();
		BobWalletObj.address = BobWalletObj.address.trim().toLowerCase();
		AliceWalletObj.address = AliceWalletObj.address.trim().toLowerCase();

		it( "should put a Group Chat Room", async () =>
		{
			const randomPassword = RoomUtil.generateRandomEncryptionKey();
			const pinCode = '';
			const passwordValue = await chatRoomStorageService.encryptPassword( randomPassword, pinCode );

			const item : ChatRoomEntityItem = {
				wallet : BobWalletObj.address,
				chatType : ChatType.GROUP,
				name : 'Group A',
				roomId : randomRoomId,
				desc : 'Group A',
				password : passwordValue,
				timestamp : new Date().getTime(),
				members : {
					[ BobWalletObj.address ] : {
						memberType : ChatRoomMemberType.OWNER,
						wallet : BobWalletObj.address,
						publicKey : undefined,
						userName : 'Bob',
						userAvatar : 'https://www.aaa/avatar.png',
						timestamp : new Date().getTime()
					},
					[ AliceWalletObj.address ] : {
						memberType : ChatRoomMemberType.MEMBER,
						wallet : AliceWalletObj.address,
						publicKey : undefined,
						userName : 'Alice',
						userAvatar : 'https://www.aaa/avatar.png',
						timestamp : new Date().getTime()
					}
				},
			};
			const key : string | null = chatRoomStorageService.getKeyByItem( item );
			expect( key ).toBeDefined();
			expect( _.isString( key ) && ! _.isEmpty( key ) ).toBeTruthy();
			if ( key )
			{
				const saved : boolean = await chatRoomStorageService.put( key, item );
				expect( saved ).toBe( true );

				const itemKey : string | null = chatRoomStorageService.getKeyByItem( item );
				expect( itemKey ).toBeDefined();
				expect( _.isString( itemKey ) && ! _.isEmpty( itemKey ) ).toBeTruthy();
				if ( itemKey )
				{
					const value : ChatRoomEntityItem | null = await chatRoomStorageService.get( itemKey );
					expect( value ).toBeDefined();
					expect( value ).toHaveProperty( 'chatType' );
					expect( value ).toHaveProperty( 'roomId' );
					expect( value ).toHaveProperty( 'desc' );
					expect( value ).toHaveProperty( 'password' );
					expect( value ).toHaveProperty( 'timestamp' );
					expect( value ).toHaveProperty( 'members' );
					if ( value )
					{
						expect( value.chatType ).toBe( ChatType.GROUP );
						expect( value.roomId ).toBe( item.roomId );
						expect( value.desc ).toBe( item.desc );
						expect( value.password ).toBe( item.password );
						expect( value.timestamp ).toBe( item.timestamp );
						expect( value.members ).toHaveProperty( BobWalletObj.address );
						expect( value.members ).toHaveProperty( AliceWalletObj.address );
					}
				}
			}
		});

		const MaryWalletObj = EtherWallet.createWalletFromMnemonic();
		const MaryWalletAddress = MaryWalletObj.address.trim().toLowerCase();
		const MaryMember : ChatRoomMember = {
			memberType : ChatRoomMemberType.MEMBER,
			wallet : MaryWalletAddress,
			publicKey : undefined,
			userName : 'Mary',
			userAvatar : 'https://www.aaa/avatar.png',
			timestamp : new Date().getTime()
		};

		it( "should put a new member to Group Chat Room", async () =>
		{
			const key : string | null = chatRoomStorageService.getKeyByWalletAndRoomId( BobWalletObj.address, randomRoomId );
			expect( key ).not.toBeNull();
			expect( chatRoomStorageService.isValidKey( key ) ).toBeTruthy();
			if ( key )
			{
				const saved : boolean = await chatRoomStorageService.putMember( key, MaryMember );
				expect( saved ).toBeTruthy();
			}
		});
		it( "should return all members of a Group Chat Room", async () =>
		{
			const key : string | null = chatRoomStorageService.getKeyByWalletAndRoomId( BobWalletObj.address, randomRoomId );
			expect( key ).not.toBeNull();
			expect( chatRoomStorageService.isValidKey( key ) ).toBeTruthy();
			if ( key )
			{
				//	get all members
				const members : ChatRoomMembers | null = await chatRoomStorageService.getMembers( key );
				expect( members ).toBeDefined();
				expect( _.isObject( members ) && ! _.isEmpty( members ) ).toBeTruthy();
				expect( members ).toHaveProperty( MaryWalletAddress );
				if ( members )
				{
					const member = members[ MaryWalletAddress ];
					expect( member ).toBeDefined();
					expect( member ).toHaveProperty( 'memberType' );
					expect( member ).toHaveProperty( 'wallet' );
					expect( member ).toHaveProperty( 'userName' );
					expect( member ).toHaveProperty( 'userAvatar' );
					expect( member ).toHaveProperty( 'timestamp' );
					expect( member.memberType ).toBe( MaryMember.memberType );
					expect( member.wallet ).toBe( MaryMember.wallet );
					expect( member.publicKey ).toBe( MaryMember.publicKey );
					expect( member.userName ).toBe( MaryMember.userName );
					expect( member.userAvatar ).toBe( MaryMember.userAvatar );
					expect( member.timestamp ).toBe( MaryMember.timestamp );
				}
			}
		});
		it( "should return a member of a Group Chat Room", async () =>
		{
			const key : string | null = chatRoomStorageService.getKeyByWalletAndRoomId( BobWalletObj.address, randomRoomId );
			expect( key ).not.toBeNull();
			expect( chatRoomStorageService.isValidKey( key ) ).toBeTruthy();
			if ( key )
			{
				//	get a member
				const member : ChatRoomMember | null = await chatRoomStorageService.getMember( key, MaryWalletAddress );
				expect( member ).toBeDefined();
				expect( _.isObject( member ) && ! _.isEmpty( member ) ).toBeTruthy();
				if ( member )
				{
					expect( member ).toBeDefined();
					expect( member ).toHaveProperty( 'memberType' );
					expect( member ).toHaveProperty( 'wallet' );
					expect( member ).toHaveProperty( 'userName' );
					expect( member ).toHaveProperty( 'userAvatar' );
					expect( member ).toHaveProperty( 'timestamp' );
					expect( member.memberType ).toBe( MaryMember.memberType );
					expect( member.wallet ).toBe( MaryMember.wallet );
					expect( member.publicKey ).toBe( MaryMember.publicKey );
					expect( member.userName ).toBe( MaryMember.userName );
					expect( member.userAvatar ).toBe( MaryMember.userAvatar );
					expect( member.timestamp ).toBe( MaryMember.timestamp );
				}
			}
		});

		it( "should delete a member from a Group Chat Room", async () =>
		{
			//	get all members
			const key : string | null = chatRoomStorageService.getKeyByWalletAndRoomId( BobWalletObj.address, randomRoomId );
			expect( key ).not.toBeNull();
			expect( chatRoomStorageService.isValidKey( key ) ).toBeTruthy();
			if ( key )
			{
				const deleted : boolean = await chatRoomStorageService.deleteMember( key, MaryWalletAddress );
				expect( deleted ).toBeTruthy();

				const member : ChatRoomMember | null = await chatRoomStorageService.getMember( key, MaryWalletAddress );
				expect( member ).toBeNull();
			}
		});

		it( "should delete the object just saved", async () =>
		{
			const key : string | null = chatRoomStorageService.getKeyByWalletAndRoomId( BobWalletObj.address, randomRoomId );
			expect( key ).not.toBeNull();
			expect( chatRoomStorageService.isValidKey( key ) ).toBeTruthy();
			if ( key )
			{
				const deleted : boolean = await chatRoomStorageService.delete( key );
				expect( deleted ).toBeTruthy();
			}
		});
	} );
} );
