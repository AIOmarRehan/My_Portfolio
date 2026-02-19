import mongoose, {Schema, Document, Model} from 'mongoose'

export interface ICertificate extends Document {
  title: string
  issuer?: string
  date?: Date
  url?: string
}

const CertificateSchema: Schema = new Schema<ICertificate>({
  title: {type: String, required: true},
  issuer: {type: String},
  date: {type: Date},
  url: {type: String}
}, {timestamps: true})

const Certificate: Model<ICertificate> = (mongoose.models.Certificate as Model<ICertificate>) || mongoose.model<ICertificate>('Certificate', CertificateSchema)

export default Certificate
