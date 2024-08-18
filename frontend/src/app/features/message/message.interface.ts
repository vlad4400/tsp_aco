export interface Message {
  _id: string;
  title: string;
  details: string;
  student: string; // studentId
  lecturer: string; // lecturerId
  createdAt: Date;
  // student: {
  //   _id: string;
  //   name: string;
  //   surname: string;
  // };
  // lecturer: {
  //   _id: string;
  //   name: string;
  //   surname: string;
  // };
}

export interface MessageDTO {
  title: string;
  details: string;
  student: string; // studentId
  lecturer: string; // lecturerId
}
