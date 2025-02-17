import { AlertCircleIcon, FileTextIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import type { ChatState } from "~/hooks/use-chat-state";
import { cn } from "~/lib/utils";
import { trpc } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/router";
import { ScrollArea } from "../ui/scroll-area";

export function ResearchDocuments({
  chatId,
  chatState,
}: {
  chatId: number;
  chatState: ChatState;
}) {
  const { data, isLoading } = trpc.researchDocument.getRelated.useQuery(
    { id: chatId },
    {
      refetchInterval: chatState === "generating-research" ? 1000 : false,
      enabled: chatState === "generating-research" || chatState === "finished",
    }
  );
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <DocumentGrid documents={data ?? []} />
    // <div className="grid grid-cols-3 gap-2">
    //   {data?.map((doc) => (
    //     <Document key={doc.id} doc={doc} />
    //   ))}
    // </div>
  );
}

type DocumentEntry = RouterOutputs["researchDocument"]["getRelated"][number];

type DocumentGridProps = {
  documents: DocumentEntry[];
};

export default function DocumentGrid({ documents }: DocumentGridProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentEntry | null>(null);

  const handleCardClick = (document: DocumentEntry) => {
    if (document.status === "success") {
      setSelectedDocument(document);
      setIsDrawerOpen(true);
    }
  };

  const getStatusIcon = (status: DocumentEntry["status"]) => {
    switch (status) {
      case "success":
        return <FileTextIcon className="size-4 text-lime-500" />;
      case "error":
        return <AlertCircleIcon className="size-4 text-red-600" />;
      case "pending":
      default:
        return <Loader2Icon className="size-4 animate-spin" />;
    }
  };

  return (
    <div className="container mx-auto py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <Card
            key={doc.id}
            className={cn({
              "cursor-pointer hover:bg-foreground/10": doc.status === "success",
            })}
            onClick={() => handleCardClick(doc)}
          >
            <CardHeader className="grid grid-cols-[theme('spacing.6')_auto] items-center p-4">
              {getStatusIcon(doc.status)}
              <CardTitle className="text-sm font-medium truncate">
                {doc.serp}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        direction="right"
      >
        <DrawerContent>
          <ScrollArea className="h-full">
            <DrawerHeader>
              <DrawerTitle>Document {selectedDocument?.id}</DrawerTitle>
              <DrawerDescription>
                Created on {selectedDocument?.createdAt.toLocaleDateString()}
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <h3 className="font-semibold mb-2">Goal:</h3>
              <p className="mb-4">{selectedDocument?.goal}</p>
              <h3 className="font-semibold mb-2">Content:</h3>
              <Markdown className="prose prose-lime dark:prose-invert">
                {selectedDocument?.document}
              </Markdown>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
