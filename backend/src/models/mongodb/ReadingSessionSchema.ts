import mongoose, { Schema, Document } from 'mongoose';
import { DeviceType } from './enum/DeviceType';
import { ReadingSession, Highlight } from './ReadingSession';

// Mongoose document interface extending the base interface
export interface ReadingSessionDocument extends Omit<ReadingSession, 'id'>, Document { }


const HighlightSchema = new Schema<Highlight>({
    pageNumber: { type: Number, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}, { _id: false });

// Reading session schema
const ReadingSessionSchema = new Schema<ReadingSessionDocument>({
    userId: { type: String, required: true, index: true },
    bookId: { type: String, required: true, index: true },
    startTime: { type: Date, required: true, default: Date.now },
    endTime: { type: Date, required: false },
    device: {
        type: String,
        required: true,
        enum: Object.values(DeviceType),
        default: DeviceType.DESKTOP
    },
    pagesRead: [{ type: Number, required: true }],
    highlights: [HighlightSchema],
    sessionDuration: { type: Number, required: false }, // seconds
}, {
    timestamps: true,
    collection: 'reading_sessions'
});

// indexes
ReadingSessionSchema.index({ userId: 1, bookId: 1 });
ReadingSessionSchema.index({ startTime: -1 });
ReadingSessionSchema.index({ bookId: 1, 'highlights.pageNumber': 1 });

export default mongoose.model<ReadingSessionDocument>('ReadingSession', ReadingSessionSchema); 