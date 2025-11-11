import useMeetingActions from "@/hooks/useMeetingActions";
import { Doc } from "../../convex/_generated/dataModel";
import { getMeetingStatus } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CalendarIcon, Copy, Share2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

type Interview = Doc<"interviews">;

function MeetingCard({ interview }: { interview: Interview }) {
  const { joinMeeting } = useMeetingActions();

  const status = getMeetingStatus(interview);
  const formattedDate = new Date(interview.startTime).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const copyMeetingLink = () => {
    const meetingUrl = `${window.location.origin}/meeting/${interview.streamCallId}`;
    navigator.clipboard.writeText(meetingUrl);
    toast.success("Meeting link copied to clipboard!");
  };

  const shareMeeting = () => {
    const meetingUrl = `${window.location.origin}/meeting/${interview.streamCallId}`;
    const subject = `Interview: ${interview.title}`;
    const body = `You have been invited to an interview.\n\nTitle: ${interview.title}\nDate: ${formattedDate}\n\nJoin here: ${meetingUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: subject,
        text: body,
        url: meetingUrl,
      }).catch(() => {
        // Fallback to email
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      });
    } else {
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            {formattedDate}
          </div>

          <Badge
            variant={
              status === "live" ? "default" : status === "upcoming" ? "secondary" : "outline"
            }
          >
            {status === "live" ? "Live Now" : status === "upcoming" ? "Upcoming" : "Completed"}
          </Badge>
        </div>

        <CardTitle>{interview.title}</CardTitle>

        {interview.description && (
          <CardDescription className="line-clamp-2">{interview.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-2">
        {status === "live" && (
          <Button className="w-full" onClick={() => joinMeeting(interview.streamCallId)}>
            Join Meeting
          </Button>
        )}

        {status === "upcoming" && (
          <Button variant="outline" className="w-full" disabled>
            Waiting to Start
          </Button>
        )}

        {/* Copy and Share buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={copyMeetingLink}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={shareMeeting}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
export default MeetingCard;
