import { isVideoMedia } from '../utils/media';

export function SocialMedia({
  url,
  mediaType,
  alt,
  className = 'max-h-[560px] w-full object-cover',
}: {
  url?: string | null;
  mediaType?: string | null;
  alt: string;
  className?: string;
}) {
  if (!url) return null;

  if (isVideoMedia(url, mediaType)) {
    return (
      <video className={className} controls playsInline preload="metadata">
        <source src={url} />
        Seu navegador não conseguiu abrir esse vídeo.
      </video>
    );
  }

  return <img src={url} alt={alt} className={className} />;
}
