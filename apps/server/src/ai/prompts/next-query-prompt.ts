export const nextQuery = (serpQuery: {
  researchGoal: string;
  followUpQuestions: string[];
}) =>
  `Previous research goal: ${serpQuery.researchGoal}
Follow-up research directions:
${serpQuery.followUpQuestions.join("\n")}
`.trim();
