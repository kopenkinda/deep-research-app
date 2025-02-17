import { ArrowRightIcon, CheckIcon, SaveIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/router";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";

export function ChatFollowupQuestions({
  chatId,
  isLoading,
  isReadyToStart,
  refetchState,
}: {
  chatId: number;
  isLoading: boolean;
  isReadyToStart: boolean;
  refetchState: () => Promise<void>;
}) {
  const { data, isLoading: followupsLoading } = trpc.chat.getFollowups.useQuery(
    { id: chatId },
    {
      refetchInterval: isLoading ? 1000 : false,
    }
  );
  const mutation = trpc.chat.startResearch.useMutation();

  const allQuestionsAnswered = data?.every(
    (question) => question.answer !== null
  );

  useEffect(() => {
    if (allQuestionsAnswered) {
      refetchState();
    }
  }, [allQuestionsAnswered]);

  if (isLoading || followupsLoading) {
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
      {allQuestionsAnswered && isReadyToStart && (
        <div className="flex items-center justify-end w-full">
          <Button
            className="ml-auto"
            onClick={async () => {
              await mutation.mutateAsync({ id: chatId });
              await refetchState();
            }}
          >
            Continue <ArrowRightIcon />
          </Button>
        </div>
      )}
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
          chatId: question.researchId,
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
