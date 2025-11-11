"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, Plus } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LoaderUI from "@/components/LoaderUI";
import { TIME_SLOTS } from "@/constants";
import { z } from "zod";

// Form validation schema
const scheduleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  candidateEmail: z.string().email("Invalid email address"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
});

function SchedulePage() {
  const router = useRouter();
  const { user } = useUser();
  const [isScheduling, setIsScheduling] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    candidateEmail: "",
    date: "",
    time: "",
  });

  const createInterview = useMutation(api.interviews.createInterview);
  const users = useQuery(api.users.getUsers);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validation = scheduleSchema.safeParse(formData);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      toast.error(firstError.message);
      return;
    }

    setIsScheduling(true);

    try {
      // Find candidate by email
      const candidate = users?.find((u) => u.email === formData.candidateEmail);
      if (!candidate) {
        toast.error("Candidate not found. Please ensure the email is registered.");
        setIsScheduling(false);
        return;
      }

      // Validate date is in the future
      const selectedDate = new Date(formData.date);
      if (selectedDate < new Date()) {
        toast.error("Please select a future date");
        setIsScheduling(false);
        return;
      }

      // Create date object from date and time
      const [hours, minutes] = formData.time.split(":");
      const startTime = new Date(formData.date);
      startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Generate unique call ID
      const streamCallId = `interview-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      await createInterview({
        title: formData.title,
        description: formData.description,
        startTime: startTime.getTime(),
        status: "scheduled",
        streamCallId,
        candidateId: candidate.clerkId,
        interviewerIds: [user?.id || ""],
      });

      toast.success("Interview scheduled successfully!");
      setFormData({
        title: "",
        description: "",
        candidateEmail: "",
        date: "",
        time: "",
      });
      router.push("/");
    } catch (error) {
      console.error("Error scheduling interview:", error);
      toast.error("Failed to schedule interview");
    } finally {
      setIsScheduling(false);
    }
  };

  if (!users) return <LoaderUI />;

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Schedule Interview
        </h1>
        <p className="text-muted-foreground mt-2">
          Plan and organize upcoming technical interviews
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            New Interview
          </CardTitle>
          <CardDescription>
            Fill in the details to schedule a new interview session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSchedule} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Interview Title</label>
              <Input
                placeholder="e.g., Frontend Developer Interview"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Input
                placeholder="Brief description of the interview"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Candidate Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Candidate Email
              </label>
              <Input
                type="email"
                placeholder="candidate@example.com"
                value={formData.candidateEmail}
                onChange={(e) => setFormData({ ...formData, candidateEmail: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter the email of a registered candidate
              </p>
            </div>

            {/* Date and Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                >
                  <option value="">Select time</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isScheduling}>
                {isScheduling ? (
                  <>Scheduling...</>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SchedulePage;