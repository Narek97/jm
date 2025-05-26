export const getResizedFileName = (fileKey: string, ratioNumber: number) => {
  if (!fileKey) {
    return { key: "", extension: "" };
  }
  const lastDotIndex = fileKey.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return { key: fileKey, extension: "" }; // No extension present
  }
  const key = fileKey.slice(0, lastDotIndex);
  const extension = fileKey.slice(lastDotIndex + 1);
  return `${key}_${ratioNumber}x${ratioNumber}.${extension}`;
};
