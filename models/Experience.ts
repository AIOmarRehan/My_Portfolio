import mongoose, {Schema, Document, Model} from 'mongoose'

export interface IExperience extends Document {
  company: string
  role: string
  startDate?: Date
  endDate?: Date
  description?: string
}

const ExperienceSchema: Schema = new Schema<IExperience>({
  company: {type: String, required: true},
  role: {type: String, required: true},
  startDate: {type: Date},
  endDate: {type: Date},
  description: {type: String}
}, {timestamps: true})

const Experience: Model<IExperience> = (mongoose.models.Experience as Model<IExperience>) || mongoose.model<IExperience>('Experience', ExperienceSchema)

export default Experience
