export const scrollNeighbours = (scrollLeft: number, neighbours: HTMLElement[]) => {
  neighbours.forEach(el => {
    el?.scroll({
      // top: 0,
      left: scrollLeft,
    });
  });
};
