/*
 *          DM
 */

export type DmListArray = {
  username: string;
  content: string;
}[];

export type DmList = {
  type: "dmList";
  alert: "new";
};

export interface DmData {
  from: string;
  content: string;
}

export interface DmResponse extends DmData {
  type: "dm";
}

export type DmHistoryData = {
  type: "history";
  list: DmData[];
};

/*
 *          Friend
 */

export type FriendListArray = {
  username: string;
  status: string;
}[];

export type FriendList = {
  type: "friend";
  list: FriendListArray;
};
