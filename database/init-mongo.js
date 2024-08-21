db = db.getSiblingDB("msg-store");

db.createCollection("students");
db.students.insertMany([
  { name: "Michael", surname: "Brown", age: 20 },
  { name: "Emily", surname: "Davis", age: 22 },
  { name: "David", surname: "Wilson", age: 19 },
]);

db.createCollection("lecturers");
db.lecturers.insertMany([
  { name: "John", surname: "Doe" },
  { name: "Jane", surname: "Smith" },
  { name: "Alice", surname: "Johnson" },
]);


