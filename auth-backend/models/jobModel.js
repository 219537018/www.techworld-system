import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  experience: { type: String, required: true },
  salary: { type: Number, required: true },
  description: { type: String, required: true },
  techStack: { type: String, required: true },
  qualification: { type: String, required: true },
  location: {
    line1: { type: String, required: true },
    line2: { type: String, required: true },
  },
  
}, { timestamps: true });

const JobModel = mongoose.model('Job', jobSchema);
export default JobModel;
