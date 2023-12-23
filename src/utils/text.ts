export const textColor = (status: string) => {
  if (status === "SUCCESS") return "green.500";
  if (status === "FAILED" || status === "CRASHED") return "red.600";
  if (status === "REMOVED") return "gray.600";
  return undefined;
}