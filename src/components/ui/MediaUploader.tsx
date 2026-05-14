import { ChangeEvent, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Button } from './Button';
import { useToast } from '../../contexts/ToastContext';

type MediaUploaderProps = {
  value?: string | null;
  folder?: string;
  onChange: (url: string) => void;
};

export function MediaUploader({ value, folder = 'uploads', onChange }: MediaUploaderProps) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const url = await dataService.uploadMedia(file, folder);
      onChange(url);
      toast.success('Imagem enviada', 'O arquivo entrou no pote certo.');
    } catch (error) {
      toast.error('Não deu para enviar', error instanceof Error ? error.message : undefined);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {value ? <img src={value} alt="Prévia" className="h-16 w-16 rounded-brand object-cover ring-1 ring-husky-blue/10" /> : null}
      <label>
        <input className="sr-only" type="file" accept="image/*,video/*" onChange={handleFile} />
        <span className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-husky-blue/25 bg-white/60 px-4 text-sm font-semibold text-husky-blue transition hover:bg-husky-blue/10 dark:bg-white/5 dark:text-husky-cream">
          <ImagePlus className="h-4 w-4" />
          {loading ? 'Enviando...' : 'Enviar mídia'}
        </span>
      </label>
    </div>
  );
}
