var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  linkedin: {
    token      : String,
    id         : String,
    email      : String,
    firstName  : String,
    lastName   : String,
    industry   : Number,
    headline   : String,
    profileUrl : String,
    pictureUrl : String,
  },
  past_interview_companies: String
});

// UserSchema.methods.splitCompanies = funtion() {
//   return this.past_interview_companies.split(',')
// }

var User = mongoose.model('User', userSchema);

module.exports = User;
