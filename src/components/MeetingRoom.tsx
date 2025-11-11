"use client";

import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Users, LayoutGrid, Loader2, Code2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import CodeEditor from "./CodeEditor";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";

type CallLayoutType = "grid" | "speaker";

function MeetingRoom() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");

  const [layout, setLayout] = useState<CallLayoutType>("speaker");
  const [showParticipants, setShowParticipants] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker":
        return <SpeakerLayout participantsBarPosition="bottom" />;
      default:
        return <SpeakerLayout participantsBarPosition="bottom" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-background">
      {showCodeEditor ? (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="relative flex size-full items-center justify-center">
              <div className="flex size-full items-center">
                <CallLayout />
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle />
          
          <ResizablePanel defaultSize={50} minSize={30}>
            <CodeEditor onClose={() => setShowCodeEditor(false)} />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="relative flex size-full items-center justify-center">
          <div className="flex size-full max-w-[1000px] items-center">
            <CallLayout />
          </div>

          <div
            className={cn("h-[calc(100vh-86px)] hidden ml-2", {
              "show-block": showParticipants,
            })}
          >
            <CallParticipantsList onClose={() => setShowParticipants(false)} />
          </div>
        </div>
      )}

      {/* Video Layout and Controls */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap bg-background/80 backdrop-blur-sm py-4 px-4 border-t">
        <CallControls onLeave={() => router.push("/")} />

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setLayout(layout === "grid" ? "speaker" : "grid")}
            variant="outline"
            size="icon"
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>

          <CallStatsButton />

          <Button
            onClick={() => setShowParticipants((prev) => !prev)}
            variant="outline"
            size="icon"
          >
            <Users className="h-5 w-5" />
          </Button>

          <Button
            onClick={() => setShowCodeEditor((prev) => !prev)}
            variant={showCodeEditor ? "default" : "outline"}
            size="icon"
          >
            <Code2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default MeetingRoom;
