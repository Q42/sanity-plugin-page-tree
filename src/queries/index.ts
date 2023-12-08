export const getPageInfoQuery = (pageSchemaTypes: string[]) => `*[_type in [${Object.values(pageSchemaTypes)
  .map(key => `"${key}"`)
  .join(', ')}]]{
          _id,
          _type,
          _updatedAt,
          parent,
          slug,
          title,
          language
        }`;
