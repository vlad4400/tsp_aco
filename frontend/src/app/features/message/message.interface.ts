export interface Message {
  _id: string;
  content: string;
  student: {
    _id: string;
    name: string;
  };
}

export interface MessageDTO {
  content: string;
  student: string;
}
