"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, User } from "lucide-react";
import LoaderUI from "@/components/LoaderUI";
import { Id } from "../../../../../../convex/_generated/dataModel";

function InterviewFeedbackPage() {
  const params = useParams();
  const interviewId = params.id as Id<"interviews">;

  const interview = useQuery(
    api.interviews.getInterviewByStreamCallId,
    interviewId ? { streamCallId: interviewId } : "skip"
  );
  const comments = useQuery(
    api.comments.getComments,
    interview?._id ? { interviewId: interview._id } : "skip"
  );
  const users = useQuery(api.users.getUsers);

  if (!interview || !comments || !users) return <LoaderUI />;

  const candidate = users.find((u) => u.clerkId === interview.candidateId);
  const averageRating =
    comments.length > 0
      ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length
      : 0;

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
          Interview Feedback
        </h1>
        <p className="text-muted-foreground mt-2">{interview.title}</p>
      </div>

      {/* Interview Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Interview Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Candidate</p>
              <p className="font-semibold">{candidate?.name || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-semibold">
                {new Date(interview.startTime).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-semibold capitalize">{interview.status}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold">
                  {averageRating.toFixed(1)} / 5.0
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Interviewer Feedback ({comments.length})
          </CardTitle>
          <CardDescription>
            Detailed feedback from interviewers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No feedback has been submitted yet
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => {
                const interviewer = users.find(
                  (u) => u.clerkId === comment.interviewerId
                );

                return (
                  <div
                    key={comment._id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">
                          {interviewer?.name || "Anonymous Interviewer"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {interviewer?.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= comment.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default InterviewFeedbackPage;
