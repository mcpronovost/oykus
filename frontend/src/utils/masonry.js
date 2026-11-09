export function getMasonryColumnCount(width) {
  if (width >= 1600) return 5;
  if (width >= 1200) return 4;
  if (width >= 768) return 3;
  if (width >= 576) return 2;
  return 1;
}

export function distributeMasonryItems(items, columnCount) {
  const count = Math.max(1, columnCount);
  const columns = Array.from({ length: count }, () => []);

  items.forEach((item, index) => {
    columns[index % count].push({ item, index });
  });

  return columns;
}
