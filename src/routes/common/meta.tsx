import type { MetaFunction } from "react-router";

export const blushAppMeta: MetaFunction = () => {
  return [
    { title: "Blush App" },
    { name: "description", content: "Welcome to Blush App!" },
  ];
};
