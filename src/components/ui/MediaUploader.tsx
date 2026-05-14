import { ChangeEvent, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Button } from './Button';
import { useToast } from '../../contexts/ToastContext';
import { isVideoMedia } from '../../utils/media';

type MediaUploaderProps = {
  value?: string | null;
  folder?: string;
  label?: string;
  accept?: string;
  showPreview?: boolean;
  previewClassName?: string;
  onChange: (url: string, file?: File) => void;
};

export function MediaUploader({
  value,
  folder = 'uploads',
  label = 'Enviar mídia ✨',
  accept = 'image/*,video/*',
  showPreview = true,
  previewClassName = 'h-16 w-16',
  onChange,
}: MediaUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [previewKind, setPreviewKind] = useState<'image' | 'video'>('image');
  const toast = useToast();

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setPreviewKind(file.type.startsWith('video/') ? 'video' : 'image');
    try {
      const url = await dataService.uploadMedia(file, folder);
      onChange(url, file);
      toast.success('Midia enviada', 'O arquivo entrou no pote certo.');
    } catch (error) {
      toast.error('Não deu para enviar', error instanceof Error ? error.message : undefined);
    } finally {
      event.target.value = '';
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {showPreview && value ? (
        previewKind === 'video' || isVideoMedia(value) ? (
          <video src={value} className={`${previewClassName} rounded-brand object-cover ring-1 ring-husky-blue/10`} muted playsInline />
        ) : (
          <img src={value} alt="Prévia" className={`${previewClassName} rounded-brand object-cover ring-1 ring-husky-blue/10`} />
        )
      ) : null}
      <label>
        <input className="sr-only" type="file" accept={accept} onChange={handleFile} disabled={loading} />
        <span className={`inline-flex h-11 items-center justify-center gap-2 rounded-full border border-husky-blue/25 bg-white/60 px-4 text-sm font-semibold text-husky-blue transition hover:bg-husky-blue/10 dark:bg-white/5 dark:text-husky-cream ${loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
          <ImagePlus className="h-4 w-4" />
          {loading ? 'Enviando...' : label}
        </span>
      </label>
    </div>
  );
}
