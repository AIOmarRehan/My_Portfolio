import mongoose, {Schema, Document, Model} from 'mongoose'

export interface IArticle extends Document {
  title: string
  url?: string
  source?: string
  publishedAt?: Date
}

const ArticleSchema: Schema = new Schema<IArticle>({
  title: {type: String, required: true},
  url: {type: String},
  source: {type: String},
  publishedAt: {type: Date}
}, {timestamps: true})

const Article: Model<IArticle> = (mongoose.models.Article as Model<IArticle>) || mongoose.model<IArticle>('Article', ArticleSchema)

export default Article
