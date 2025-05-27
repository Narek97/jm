export const truncateName = (name: string, maxLength = 10) => {
  return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
};
