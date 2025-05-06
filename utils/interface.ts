import { RubizCodeFile } from "@prisma/client";

export type tabValueProps = "chat" | "upload";
export type tabProps = {
  name: string;
  value: tabValueProps;
};
// Altered type with `size` as a string instead of number
export type AlteredRubizCodeFile = Omit<RubizCodeFile, "size"> & {
  size: string;
};

export type SingleConversationProps = {
  user: "human" | "assistant";
  query: string;
};
