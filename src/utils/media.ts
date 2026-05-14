export function mediaTypeFromFile(file?: File | null): 'image' | 'video' {
  return file?.type.startsWith('video/') ? 'video' : 'image';
}

export function isVideoMedia(url?: string | null, mediaType?: string | null) {
  if (mediaType === 'video') return true;
  if (!url) return false;
  return /\.(mp4|webm|mov|m4v|ogg)(\?|#|$)/i.test(url);
}
