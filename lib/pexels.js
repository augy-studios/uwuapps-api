/**
 * Parse a raw Pexels photo object into a clean shape.
 * @param {object} photo - Raw Pexels photo object
 * @returns {object}
 */
function parsePhoto(photo) {
  return {
    id:           photo.id,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    alt:          photo.alt,
    avgColor:     photo.avg_color,
    src: {
      original: photo.src.original,
      large:    photo.src.large2x,
      medium:   photo.src.large,
      small:    photo.src.medium,
      thumb:    photo.src.tiny,
    },
    pexelsUrl:    photo.url,
  };
}

/**
 * Validate and parse pagination params from req.query.
 * @param {object} query
 * @returns {{ page: number, perPage: number } | { error: string }}
 */
function parsePagination(query) {
  const page    = query.page    != null ? parseInt(query.page,    10) : 1;
  const perPage = query.perPage != null ? parseInt(query.perPage, 10) : 15;

  if (isNaN(page)    || page    < 1)  return { error: '"page" must be a positive integer.'               };
  if (isNaN(perPage) || perPage < 1)  return { error: '"perPage" must be a positive integer.'            };
  if (perPage > 80)                   return { error: '"perPage" cannot exceed 80.'                      };

  return { page, perPage };
}

module.exports = { parsePhoto, parsePagination };
