import { PersonaGroup, Personas } from "@/api/types.ts";

export type PersonaGroupType = Pick<PersonaGroup, "id" | "name"> & {
  persona: Array<
    Pick<
      Personas,
      "id" | "name" | "type" | "color" | "attachment" | "croppedArea"
    >
  >;
};
