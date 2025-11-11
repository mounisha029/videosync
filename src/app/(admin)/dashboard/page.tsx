"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";
import LoaderUI from "@/components/LoaderUI";
import MeetingCard from "@/components/MeetingCard";
import { DashboardStatSkeleton, MeetingCardSkeleton, TableRowSkeleton } from "@/components/SkeletonCard";

function DashboardPage() {
  const interviews = useQuery(api.interviews.getAllInterviews);
  const users = useQuery(api.users.getUsers);

  const isLoading = !interviews || !users;

  // Calculate statistics
  const totalInterviews = interviews?.length || 0;
  const scheduledInterviews = interviews?.filter((i) => i.status === "scheduled").length || 0;
  const completedInterviews = interviews?.filter((i) => i.status === "completed").length || 0;
  const inProgressInterviews = interviews?.filter((i) => i.status === "in-progress").length || 0;
  const totalCandidates = users?.filter((u) => u.role === "candidate").length || 0;
  const totalInterviewers = users?.filter((u) => u.role === "interviewer").length || 0;

  const upcomingInterviews = interviews
    ?.filter((i) => i.status === "scheduled")
    .sort((a, b) => a.startTime - b.startTime)
    .slice(0, 5) || [];

  const stats = [
    {
      title: "Total Interviews",
      value: totalInterviews,
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Scheduled",
      value: scheduledInterviews,
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Completed",
      value: completedInterviews,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "In Progress",
      value: inProgressInterviews,
      icon: BarChart3,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Total Candidates",
      value: totalCandidates,
      icon: Users,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Total Interviewers",
      value: totalInterviewers,
      icon: Users,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Overview of all interviews and platform statistics
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {isLoading ? (
          <>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <DashboardStatSkeleton key={i} />
            ))}
          </>
        ) : (
          stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Upcoming Interviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Interviews
          </CardTitle>
          <CardDescription>Next scheduled interview sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingInterviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming interviews scheduled
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingInterviews.map((interview) => (
                <MeetingCard key={interview._id} interview={interview} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest interview sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interviews
              .sort((a, b) => b.startTime - a.startTime)
              .slice(0, 10)
              .map((interview) => {
                const candidate = users.find((u) => u.clerkId === interview.candidateId);
                const statusColors = {
                  scheduled: "bg-orange-500/10 text-orange-500",
                  "in-progress": "bg-blue-500/10 text-blue-500",
                  completed: "bg-green-500/10 text-green-500",
                  cancelled: "bg-red-500/10 text-red-500",
                };

                return (
                  <div
                    key={interview._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{interview.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Candidate: {candidate?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(interview.startTime).toLocaleString()}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[interview.status as keyof typeof statusColors] ||
                        "bg-gray-500/10 text-gray-500"
                      }`}
                    >
                      {interview.status}
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardPage;