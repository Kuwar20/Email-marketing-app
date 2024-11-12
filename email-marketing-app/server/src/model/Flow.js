import { Schema, model } from 'mongoose';

const flowSchema = new Schema({
  nodes: Array,
  edges: Array,
  createdAt: { type: Date, default: Date.now },
});

export default model('Flow', flowSchema);
