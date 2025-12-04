import { useMemo } from "react";

export const useDateFormatter = () => {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("pl", {
        dateStyle: "medium",
        hour12: false,
        timeStyle: "medium",
      }),
    [],
  );
  return (date: string | Date) => formatter.format(new Date(date));
};
