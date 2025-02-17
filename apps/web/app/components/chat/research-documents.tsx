import { LinkIcon, Loader2Icon, PackageIcon, XIcon } from "lucide-react";
import type { ChatState } from "~/hooks/use-chat-state";
import { cn } from "~/lib/utils";
import { trpc } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/router";

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
    <div className="grid grid-cols-3 gap-2">
      {data?.map((doc) => (
        <Document key={doc.id} doc={doc} />
      ))}
    </div>
  );
}

function Document({
  doc,
}: {
  doc: RouterOutputs["researchDocument"]["getRelated"][number];
}) {
  return (
    <div className="flex items-center gap-2 hover:bg-slate-200/10 pl-2 pr-4 rounded-lg">
      <div
        className={cn(
          "text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg my-2",
          {
            "bg-slate-500": doc.status === "pending",
            "bg-lime-500": doc.status === "success",
            "bg-red-500": doc.status === "error",
          }
        )}
      >
        <PackageIcon className="size-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="">{doc.serp}</span>
      </div>
      {doc.status === "pending" && (
        <Loader2Icon className="animate-spin" size={16} />
      )}
      {doc.status === "success" && <LinkIcon size={16} />}
      {doc.status === "error" && <XIcon size={16} />}
    </div>
  );
}
