const LessonList = require('./models/LessonList');
const Course = require('./models/Course');
const School = require('./models/School');
const Lesson = require('./models/Lesson');
const Exercise = require('./models/Exercise');
const Attendance = require('./models/Attendance');

exports = module.exports = (io) => {

  io.on("connection", socket => {
    
    socket.on("lesson_list", () => {
      LessonList.find({},'title lesson._id lesson.text created')
      .sort({created: -1})
      .then(list => {
        io.sockets.emit("get_lesson_list", list);
      });
    });
    //////////////////////////////////////////////

    socket.on("all_course", () => {
      Course.find(
        { 'enrollDeadline' : {$gte : new Date()}},
        { coursePhoto: 1, title: 1, intro: 1, enrollDeadline: 1, code: 1, maxStudent:1, students: 1 }
      )
      .sort({created: -1})
      .then(courses => io.sockets.emit("get_all_course", courses))
    });
    //////////////////////////////////////////////

    socket.on("course_info", (courseId) => {
      async function run() {
        try {
  
          var course = await 
          Course.findById( courseId, { coursePhoto: 1, title: 1, intro: 1, enrollDeadline: 1, pointColumns: 1, code: 1, days: 1, students: 1 })
                .lean()
  
          var course_detail = await  
          CourseDetail.findOne(
            { 'courseId' : courseId },
            { studyTime: 1, openingDay: 1, endDay: 1, fee: 1, info: 1, isFull: 1, maxStudent: 1, minStudent: 1 }
          ).lean()
  
          var schedule = await
          Schedule.findOne(
            { courseId: courseId }
          )
          .populate('events.lessonId','text')
          .lean()
  
          schedule.events.map(e=>{
            e.text = e.lessonId.text
            e.lessonId = e.lessonId._id
          })
  
          const result = {
            course,
            course_detail,
            schedule
          }
  
          io.sockets.emit("get_course_info", result)
        } catch (err) {
          console.log(err)
        }
      }
  
      run();
    });
    //////////////////////////////////////////////

    socket.on("student_approve_list", (courseId) => {

      async function run() {
        try {
  
          const coursedetail = await 
            CourseDetail.findOne(
              { 'courseId' : courseId } ,
              { enrollStudents: 1 , maxStudent: 1, minStudent: 1, isFull: 1, isNotifyMail: 1 }
            )
            .populate('enrollStudents.student', '_id name email photo code phone')
            .lean()
          
          const course = await 
            Course.findById(
              courseId  ,
              { enrollDeadline: 1, code: 1, title: 1 }
            )
            .lean()
  
          const result = {
            courseId: courseId,
            code: course.code,
            title: course.title,
            enrollDeadline: course.enrollDeadline,
            enrollStudents: coursedetail.enrollStudents,
            maxStudent: coursedetail.maxStudent,
            minStudent: coursedetail.minStudent,
            isFull: coursedetail.isFull,
            isNotifyMail: coursedetail.isNotifyMail          
          }
          io.sockets.emit("get_student_approve_list", result)
          
        } catch (err) {
          console.log(err)
        }
      }
  
      run();
    });
    //////////////////////////////////////////////

    socket.on("school", () => {
      School.find()
      .then(school => {
        io.sockets.emit("get_school", school[0]);
      });
    });
    //////////////////////////////////////////////

    socket.on("schedule", (courseId) => {
      async function run() {
        try {
          const schedule = await 
          Schedule.findOne(
            { courseId: courseId }
          )
          .populate('events.lessonId','text')
          .lean()
  
          schedule.events.map(e=>{
            e.text = e.lessonId.text
            e.lessonId = e.lessonId._id
          })

          io.sockets.emit("get_schedule", schedule);

        } catch (err) {
          console.log(err)
        }
      }
  
      run();
    });
    //////////////////////////////////////////////

    socket.on("event_schedule", (dataId) => {
      async function run() {
        try {
          const schedule = await 
          Schedule.findOne(
            { 
              courseId: dataId.courseId
            },
            {
              events: { $elemMatch: { _id: dataId.eventId }}
            }
          )
          .populate({
            path: 'events.exercises'
          })
          .populate({
            path: 'events.quizzes.quizId'
          })

          io.sockets.emit("get_event_schedule", schedule.events[0]);

        } catch (err) {
          console.log(err)
        }
      }
  
      run();
    });
    //////////////////////////////////////////////

    socket.on("lesson_in_course", (dataId) => {
      Lesson.findOne({ _id: dataId.lessonId, courseId: dataId.courseId })
      .populate({
        path: 'exercises'
      })
      .populate({
        path: 'quizzes.quizId'
      })
      .then(lesson => io.sockets.emit("get_lesson_in_course", lesson))
      .catch(err => console.log(err));
    });
    //////////////////////////////////////////////

    socket.on("comments", (exerciseId) => {
      Exercise.findById(
        exerciseId ,
        { comments: 1 }
      )
      .populate('comments.user', '_id name email photo')
      .lean()
      .then(commments => io.sockets.emit("get_comments", commments))
      .catch(err => console.log(err));
    });
    //////////////////////////////////////////////

    socket.on("today_attendance", (data) => {
      Attendance.findOne(
        { 
          'courseId' : data.courseId,
          'date' : data.selectDate
        }
      )
      .populate('students.userId', '_id name email photo code')
      .then(attendance => io.sockets.emit("get_today_attendance", attendance))
      .catch(err => console.log(err));
    });
    //////////////////////////////////////////////

    socket.on("attendance", (courseId) => {
      Attendance.find(
        { 
          'courseId' : courseId
        }
      )
      .populate('students.userId', '_id name email photo code')
      .then(attendance => {
        var data ={
          attendance,
          courseId
        }
        io.sockets.emit("get_attendance", data)
      })
      .catch(err => console.log(err));
    });
    
  });
}