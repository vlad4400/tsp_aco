export interface Message {
  _id: string;
  title: string;
  details: string;
  student: {
    _id: string;
    name: string;
    surname: string;
  };
  lecturer: {
    _id: string;
    name: string;
    surname: string;
  };
}

export interface MessageDTO {
  content: string;
  student: string; // studentId
  lecturer: string; // lecturerId
}
