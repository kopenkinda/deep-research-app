export function researchInfoPrompt({
  question,
  followUps,
}: {
  question: string;
  followUps: {
    question: string;
    answer: string;
  }[];
}) {
  return `Initial Query: ${question}
Follow-up Questions and Answers:
${followUps
  .map(({ answer, question }) => `Q: ${question}\nA: ${answer}`)
  .join("\n")}
`;
}
