const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LessonListSchema = new Schema({
  title: {
    type: String
  },
  lesson: [
    {
      text: {
        type: String
      },
      content: {
        type: String
      },
      files: [
        {
          id: {
            type: String
          },
          name: {
            type: String
          },
          url: {
            type: String
          },
          thumbnail: {
            type: String
          }
        }
      ]
    }
  ]
})

module.exports = LessonList = mongoose.model('lessonlist', LessonListSchema)

