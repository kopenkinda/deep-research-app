import { CheckIcon, SaveIcon, SendIcon, XIcon } from "lucide-react";
import { useId, useState } from "react";
import { trpc } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/router";
import { Badge } from "../ui/badge";
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
          /* biome-ignore lint/suspicious/noArrayIndexKey: keys wont change for skeleton */
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
  const id = `followup-question-#${question.id}`;
  const mutation = trpc.chat.setFollowupAnswer.useMutation();
  const utils = trpc.useUtils();
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await mutation.mutateAsync({
          answer,
          id: question.id,
        });
        await utils.chat.getFollowups.invalidate({ id: question.researchId });
      }}
    >
      <div className="flex gap-2 flex-nowrap items-start mb-1 justify-between">
        <Label htmlFor={id}>{question.question}</Label>
        <Badge
          variant={question.answer !== null ? "success" : "destructive"}
          className="w-9 px-0"
        >
          {question.answer !== null ? <CheckIcon /> : <XIcon />}
        </Badge>
      </div>
      <div className="flex gap-2 flex-nowrap">
        <Input
          type="text"
          id={id}
          name={id}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={question.placeholder}
        />
        <Button
          size="icon"
          variant="secondary"
          type="submit"
          disabled={
            answer === "" || question.answer === answer || mutation.isPending
          }
        >
          <SaveIcon />
        </Button>
      </div>
    </form>
  );
}
