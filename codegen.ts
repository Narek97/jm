import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: `${process.env.VITE_BASE_URL}`,
  watch: false,
  overwrite: true,
  generates: {
    "src/api/types.ts": {
      plugins: ["typescript"],
      config: {
        skipTypename: true,
      },
    },
    "src/api/mutations/": {
      documents: "src/api/mutations/*.graphql",
      preset: "near-operation-file",
      presetConfig: {
        extension: ".generated.ts",
        baseTypesPath: "../types.ts",
        folder: "generated",
      },
      plugins: ["typescript-operations", "typescript-react-query"],
      config: {
        exposeMutationKeys: true,
        fetcher: {
          func: "../../axios#axiosRequest",
          isReactHook: true,
        },
        reactQueryVersion: 5,
      },
    },
    "src/api/queries/": {
      documents: "src/api/queries/*.graphql",
      preset: "near-operation-file",
      presetConfig: {
        extension: ".generated.ts",
        baseTypesPath: "../types.ts",
        folder: "generated",
      },
      plugins: ["typescript-operations", "typescript-react-query"],
      config: {
        exposeQueryKeys: true,
        fetcher: {
          func: "../../axios#axiosRequest",
          isReactHook: true,
        },
        reactQueryVersion: 5,
      },
    },
    "src/api/infinite-queries/": {
      documents: "src/api/infinite-queries/*.graphql",
      preset: "near-operation-file",
      presetConfig: {
        extension: ".generated.ts",
        baseTypesPath: "../types.ts",
        folder: "generated",
      },
      plugins: ["typescript-operations", "typescript-react-query"],
      config: {
        exposeQueryKeys: true,
        addInfiniteQuery: true,
        fetcher: {
          func: "../../axios#axiosRequest",
          isReactHook: true,
        },
        reactQueryVersion: 5,
      },
    },
  },
};
export default config;
