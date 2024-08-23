db = db.getSiblingDB("msg-store");

db.createCollection("students");
const students = db.students.insertMany([
  { name: "Michael", surname: "Brown", age: 20 },
  { name: "Emily", surname: "Davis", age: 22 },
  { name: "David", surname: "Wilson", age: 19 },
]);

db.createCollection("lecturers");
const lecturers = db.lecturers.insertMany([
  { name: "John", surname: "Doe" },
  { name: "Jane", surname: "Smith" },
  { name: "Alice", surname: "Johnson" },
]);

db.createCollection("messages");
db.messages.insertMany([
  {
    title: "Welcome to the course",
    details: "We are excited to have you on board!",
    createdAt: new Date(),
    student: students.insertedIds[0].toString(),
    lecturer: lecturers.insertedIds[0].toString()
  },
  {
    title: "Course materials available",
    details: "The course materials have been uploaded.",
    createdAt: new Date(),
    student: students.insertedIds[1].toString(),
    lecturer: lecturers.insertedIds[1].toString()
  },
  {
    title: "Assignment 1",
    details: "Please complete Assignment 1 by the end of the week.",
    createdAt: new Date(),
    student: students.insertedIds[2].toString(),
    lecturer: lecturers.insertedIds[2].toString()
  },
  {
    title: "Upcoming exam",
    details: "The midterm exam will take place next Monday.",
    createdAt: new Date(),
    student: students.insertedIds[0].toString(),
    lecturer: lecturers.insertedIds[1].toString()
  },
  {
    title: "Lab results",
    details: "Your lab results are now available.",
    createdAt: new Date(),
    student: students.insertedIds[1].toString(),
    lecturer: lecturers.insertedIds[2].toString()
  },
  {
    title: "Group project",
    details: "Please find your group members for the upcoming project.",
    createdAt: new Date(),
    student: students.insertedIds[2].toString(),
    lecturer: lecturers.insertedIds[0].toString()
  },
  {
    title: "New reading material",
    details: "New articles have been added to the course resources.",
    createdAt: new Date(),
    student: students.insertedIds[0].toString(),
    lecturer: lecturers.insertedIds[2].toString()
  },
  {
    title: "Seminar invitation",
    details: "You are invited to attend the upcoming seminar on AI.",
    createdAt: new Date(),
    student: students.insertedIds[1].toString(),
    lecturer: lecturers.insertedIds[0].toString()
  },
  {
    title: "Assignment 2 released",
    details: "Assignment 2 is now available. Deadline is next Friday.",
    createdAt: new Date(),
    student: students.insertedIds[2].toString(),
    lecturer: lecturers.insertedIds[1].toString()
  },
  {
    title: "Exam results",
    details: "Your midterm exam results have been posted.",
    createdAt: new Date(),
    student: students.insertedIds[0].toString(),
    lecturer: lecturers.insertedIds[1].toString()
  },
  {
    title: "Office hours update",
    details: "Office hours have been changed to Wednesday afternoons.",
    createdAt: new Date(),
    student: students.insertedIds[1].toString(),
    lecturer: lecturers.insertedIds[2].toString()
  },
  {
    title: "Final project guidelines",
    details: "Please review the guidelines for the final project.",
    createdAt: new Date(),
    student: students.insertedIds[2].toString(),
    lecturer: lecturers.insertedIds[0].toString()
  },
  {
    title: "Guest lecture",
    details: "Join us for a guest lecture by Dr. Green next Friday.",
    createdAt: new Date(),
    student: students.insertedIds[0].toString(),
    lecturer: lecturers.insertedIds[2].toString()
  },
  {
    title: "Holiday announcement",
    details: "There will be no classes next Thursday due to the holiday.",
    createdAt: new Date(),
    student: students.insertedIds[1].toString(),
    lecturer: lecturers.insertedIds[1].toString()
  },
  {
    title: "End of semester party",
    details: "Join us for the end of semester party this Saturday!",
    createdAt: new Date(),
    student: students.insertedIds[2].toString(),
    lecturer: lecturers.insertedIds[0].toString()
  }
]);
