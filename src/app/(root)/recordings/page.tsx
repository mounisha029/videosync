"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Clock, Download, Play } from "lucide-react";
import LoaderUI from "@/components/LoaderUI";

interface CallRecording {
  call: Call;
  recordings: any[];
}

function RecordingsPage() {
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [callRecordings, setCallRecordings] = useState<CallRecording[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecordings = async () => {
      if (!client || !user?.id) return;

      try {
        const { calls } = await client.queryCalls({
          filter_conditions: {
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],
          },
          sort: [{ field: "starts_at", direction: -1 }],
          limit: 20,
        });

        // Fetch recordings for each call
        const recordingsPromises = calls.map(async (call) => {
          try {
            const recordings = await call.queryRecordings();
            return { call, recordings: recordings.recordings || [] };
          } catch {
            return { call, recordings: [] };
          }
        });

        const results = await Promise.all(recordingsPromises);
        const withRecordings = results.filter((r) => r.recordings.length > 0);
        setCallRecordings(withRecordings);
      } catch (error) {
        console.error("Error fetching recordings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecordings();
  }, [client, user?.id]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (isLoading) return <LoaderUI />;

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
          Recordings
        </h1>
        <p className="text-muted-foreground mt-2">
          Access and review your past interview sessions
        </p>
      </div>

      {callRecordings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Video className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Recordings Yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Your recorded interview sessions will appear here. Make sure to enable recording
              during your calls to save them for later review.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {callRecordings.map(({ call, recordings }) => {
            const recording = recordings[0];
            const startTime = call.state.startsAt || new Date();
            const endTime = call.state.endedAt;
            const duration = endTime && startTime 
              ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
              : 0;

            return (
              <Card key={call.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">
                        {call.state.custom?.title || "Interview Recording"}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {call.state.custom?.description || "No description"}
                      </CardDescription>
                    </div>
                    <Video className="h-5 w-5 text-orange-500 flex-shrink-0 ml-2" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(duration)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        if (recording?.url) {
                          window.open(recording.url, "_blank");
                        }
                      }}
                      disabled={!recording?.url}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (recording?.url) {
                          const link = document.createElement("a");
                          link.href = recording.url;
                          link.download = `recording-${call.id}.mp4`;
                          link.click();
                        }
                      }}
                      disabled={!recording?.url}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecordingsPage;