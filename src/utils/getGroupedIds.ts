function mergeGroup(index: number, group: number[], arrays: number[][], visited: boolean[]) {
  if (visited[index]) return;
  visited[index] = true;
  arrays[index].forEach(num => {
    if (!group.includes(num)) group.push(num);
  });
  arrays.forEach((array, i) => {
    if (!visited[i] && array.some(num => group.includes(num))) {
      mergeGroup(i, group, arrays, visited);
    }
  });
}

function mergeConnectedArrays(arrays: number[][]): number[][] {
  const visited = new Array(arrays.length).fill(false);
  const result: number[][] = [];
  arrays.forEach((_, i) => {
    if (!visited[i]) {
      const group: number[] = [];
      mergeGroup(i, group, arrays, visited);
      result.push(group);
    }
  });
  return result;
}

export const getGroupedIds = (columns: StageAndLaneItemType[]) => {
  const result: number[][] = [];
  columns?.forEach(item => {
    if (item?.mergedIds?.length) {
      result.push(item?.mergedIds);
    }
  });
  return mergeConnectedArrays(result);
};
