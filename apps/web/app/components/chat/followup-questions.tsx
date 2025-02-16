import { SendIcon } from "lucide-react";
import { useId, useState } from "react";
import { trpc } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/router";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";

export function ChatFollowupQuestions({ chatId }: { chatId: number }) {
  const { data, isLoading } = trpc.chat.getFollowups.useQuery(
    { id: chatId },
    {
      refetchInterval: false,
    }
  );
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          /* biome-ignore lint/suspicious/noArrayIndexKey: <explanation> */
          <div className="flex flex-col gap-1" key={i}>
            <Skeleton className="w-3/4 h-5" />
            <Skeleton className="w-full h-9" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {data?.map((question) => (
        <FollowUpQuestionForm key={question.id} question={question} />
      ))}
    </div>
  );
}

function FollowUpQuestionForm({
  question,
}: {
  question: RouterOutputs["chat"]["getFollowups"][0];
}) {
  const [answer, setAnswer] = useState(question.answer ?? "");
  const id = useId();
  return (
    <div>
      <Label htmlFor={id}>{question.question}</Label>
      <div className="flex gap-1 flex-nowrap">
        <Input
          type="text"
          name={id}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={question.placeholder}
        />
        <Button size="icon" variant="secondary">
          <SendIcon />
        </Button>
      </div>
    </div>
  );
}
