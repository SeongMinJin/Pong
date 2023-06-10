import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, OneToMany } from "typeorm";
import { RoomStatus } from "../chat.room.status";
import { User } from "src/user/entity/user.entity";
import { ChatRoomUser } from "./chat.room.user.entity";
import { ChatHistory } from "./chat.history.entity";
import { Block } from "./chat.block.entity";

@Entity('chat_room')
export class ChatRoom {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		nullable: false,
		enum: RoomStatus
	})
	status: string;

	@Column({
		nullable: true,
	})
	password: string;

	@Column({
		nullable: false,
	})
	title: string;

	@ManyToOne(() => User)
	owner: User;

	@OneToMany(() => ChatRoomUser, (chatRoomUser) => chatRoomUser.room)
	users: ChatRoomUser[];

	@OneToMany(() => Block, (block) => block.room)
	block: Block[];

	@OneToMany(() => ChatHistory, (chatHistory) => chatHistory.room)
	history: ChatHistory[];

	@ManyToMany(() => User, (user) => user.ban)
	ban: User[];


}