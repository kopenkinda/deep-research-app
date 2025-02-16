import { useForm } from "@tanstack/react-form";
import { ArrowUpIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Slider } from "~/components/ui/slider";
import { trpc } from "~/trpc/react";

const validation = z.object({
  topic: z.string().nonempty().endsWith("?"),
  breadth: z.number().int().positive().min(1).max(10),
  depth: z.number().int().positive().min(1).max(10),
});

type FormInput = z.infer<typeof validation>;

export default function NewChatPage() {
  const mutation = trpc.chat.initialize.useMutation();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const form = useForm<FormInput>({
    defaultValues: {
      topic: "",
      breadth: 4,
      depth: 2,
    },
    validators: {
      onChange: validation,
      onSubmit: validation,
    },
    async onSubmit({ value }) {
      console.log("Submit:", value);
      const res = await mutation.mutateAsync(value);
      await utils.chat.getAllChatMetas.invalidate();
      await navigate(`/chat/${res.id}`);
    },
  });

  return (
    <div className="w-full max-w-3xl m-auto p-4">
      <form
        className="w-full rounded-lg border bg-background overflow-hidden"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field name="topic">
          {(field) => (
            <textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="What do you want to research?"
              className="w-full min-h-[80px] resize-none bg-transparent p-3 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          )}
        </form.Field>
        <div className="border-t bg-muted/50 p-3">
          <div className="flex items-center gap-4">
            <div className="flex-grow flex items-center gap-4">
              <form.Field name="breadth">
                {(field) => (
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      Breadth: {field.state.value}
                    </span>
                    <Slider
                      className="flex-grow"
                      name={field.name}
                      value={[field.state.value]}
                      onValueChange={(value) => field.handleChange(value[0])}
                      min={1}
                      max={10}
                      step={1}
                    />
                  </div>
                )}
              </form.Field>
              <form.Field name="depth">
                {(field) => (
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      Depth: {field.state.value}
                    </span>
                    <Slider
                      className="flex-grow"
                      name={field.name}
                      value={[field.state.value]}
                      onValueChange={(value) => field.handleChange(value[0])}
                      min={1}
                      max={10}
                      step={1}
                    />
                  </div>
                )}
              </form.Field>
            </div>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  size="icon-sm"
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                >
                  <ArrowUpIcon className="h-4 w-4" />
                  <span className="sr-only">Start research</span>
                </Button>
              )}
            </form.Subscribe>
          </div>
        </div>
      </form>
    </div>
  );
}
