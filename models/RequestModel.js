const mongoose=require('mongoose')

const RequestSchema = mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'project', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'client', required: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'freelancer', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    comp: { type: String }  // The proposed compensation for the project
  });
  
  const Request = mongoose.model('request', RequestSchema);
  module.exports = Request;