export type AiModelElementType = {
  name: "name" | "prompt";
  title: string;
  type: string;
  placeholder?: string;
  isMultiline?: boolean;
};

export type AiModelFormType = {
  name: string;
  prompt: string;
  universal: boolean;
  orgIds: Array<number>;
};
