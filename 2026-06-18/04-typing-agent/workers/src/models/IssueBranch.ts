import mongoose, { Schema, Document } from 'mongoose';

export interface IIssueBranch extends Document {
  repoOwner: string;
  repoName: string;
  parentIssueNumber: number;
  branchName: string;
  createdAt: Date;
  updatedAt: Date;
}

const issueBranchSchema = new Schema<IIssueBranch>(
  {
    repoOwner: { type: String, required: true },
    repoName: { type: String, required: true },
    parentIssueNumber: { type: Number, required: true },
    branchName: { type: String, required: true },
  },
  { timestamps: true }
);

issueBranchSchema.index({ repoOwner: 1, repoName: 1, parentIssueNumber: 1 }, { unique: true });

export const IssueBranch = mongoose.model<IIssueBranch>('IssueBranch', issueBranchSchema);
