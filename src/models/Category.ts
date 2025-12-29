import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  id: number;
  name: string;
  primaryUseCase: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 200,
    },
    primaryUseCase: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    collection: 'categories',
  }
);

// Create indexes
CategorySchema.index({ id: 1 });
CategorySchema.index({ name: 1 });

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;

