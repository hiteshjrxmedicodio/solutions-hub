import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISpecialty extends Document {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SpecialtySchema: Schema = new Schema(
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
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    collection: 'specialties',
  }
);

// Create indexes
SpecialtySchema.index({ id: 1 });
SpecialtySchema.index({ name: 1 });

const Specialty: Model<ISpecialty> =
  mongoose.models.Specialty || mongoose.model<ISpecialty>('Specialty', SpecialtySchema);

export default Specialty;


