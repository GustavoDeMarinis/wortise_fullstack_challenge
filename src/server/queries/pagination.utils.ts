export function normalizePagination(params?: {
  page?: number;
  pageSize?: number;
}) {
  const page = params?.page && params.page > 0 ? params.page : 1;

  let pageSize = params?.pageSize && params.pageSize > 0 ? params.pageSize : 10;
  if (pageSize > 50) pageSize = 50;

  const skip = (page - 1) * pageSize;

  return {
    page,
    pageSize,
    skip,
    limit: pageSize,
  };
}
