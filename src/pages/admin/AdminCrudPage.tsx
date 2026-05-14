import { FormEvent, ReactNode, useMemo, useState } from 'react';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/Button';
import { DataTable, DataTableColumn } from '../../components/ui/DataTable';
import { Input } from '../../components/ui/Input';
import { MediaUploader } from '../../components/ui/MediaUploader';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { useToast } from '../../contexts/ToastContext';
import { useAsync } from '../../hooks/useAsync';
import { dataService } from '../../services/dataService';
import type { AnyRecord, CrudTable } from '../../types/domain';
import { formatCurrency, formatDateTime } from '../../utils/format';

export type AdminField = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'textarea' | 'select' | 'boolean' | 'date' | 'datetime' | 'media' | 'json';
  options?: string[];
  placeholder?: string;
};

type AdminCrudPageProps = {
  table: CrudTable;
  title: string;
  eyebrow: string;
  description: string;
  fields: AdminField[];
  columns?: DataTableColumn<AnyRecord>[];
  getTitle?: (row: AnyRecord) => string;
  afterLoad?: (rows: AnyRecord[]) => AnyRecord[];
  extraAction?: ReactNode;
};

function emptyValue(field: AdminField) {
  if (field.type === 'boolean') return false;
  if (field.type === 'number') return 0;
  return '';
}

function prepareInitial(fields: AdminField, row?: AnyRecord) {
  const value = row?.[fields.name];
  if (fields.type === 'json') return JSON.stringify(value ?? {}, null, 2);
  if (fields.type === 'datetime' && typeof value === 'string') return value.slice(0, 16);
  return value ?? emptyValue(fields);
}

function coerceValue(field: AdminField, value: unknown) {
  if (field.type === 'number') return value === '' ? null : Number(value);
  if (field.type === 'boolean') return Boolean(value);
  if (field.type === 'json') {
    if (!value) return {};
    return typeof value === 'string' ? JSON.parse(value) : value;
  }
  if (field.type === 'datetime' && typeof value === 'string' && value) return new Date(value).toISOString();
  return value === '' ? null : value;
}

function renderValue(value: unknown) {
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  if (typeof value === 'number') return value > 1000 ? formatCurrency(value) : String(value);
  if (typeof value === 'string' && value.includes('T')) return formatDateTime(value);
  if (Array.isArray(value)) return `${value.length} itens`;
  if (value && typeof value === 'object') return JSON.stringify(value).slice(0, 80);
  return String(value ?? '-');
}

export function AdminCrudPage({ table, title, eyebrow, description, fields, columns, getTitle, afterLoad, extraAction }: AdminCrudPageProps) {
  const toast = useToast();
  const rows = useAsync(async () => {
    const data = await dataService.listCrud<AnyRecord>(table);
    return afterLoad ? afterLoad(data) : data;
  }, [table]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AnyRecord | null>(null);
  const [form, setForm] = useState<AnyRecord>({});
  const [saving, setSaving] = useState(false);

  const tableColumns = useMemo<DataTableColumn<AnyRecord>[]>(() => {
    if (columns) return columns;
    const base = fields.slice(0, 5).map<DataTableColumn<AnyRecord>>((field) => ({
      header: field.label,
      accessor: (row) => renderValue(row[field.name]),
    }));
    return [
      ...base,
      {
        header: 'Ações',
        accessor: (row) => (
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => openEdit(row)}>
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => remove(row)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, fields]);

  function openCreate() {
    setEditing(null);
    setForm(Object.fromEntries(fields.map((field) => [field.name, emptyValue(field)])));
    setModalOpen(true);
  }

  function openEdit(row: AnyRecord) {
    setEditing(row);
    setForm(Object.fromEntries(fields.map((field) => [field.name, prepareInitial(field, row)])));
    setModalOpen(true);
  }

  async function remove(row: AnyRecord) {
    if (!window.confirm('Excluir este item da gestão Husky?')) return;
    await dataService.deleteCrud(table, String(row.id));
    toast.success('Item excluído', 'A gestão foi atualizada.');
    await rows.reload();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = Object.fromEntries(fields.map((field) => [field.name, coerceValue(field, form[field.name])]));
      if (editing?.id) await dataService.updateCrud(table, String(editing.id), payload);
      else await dataService.createCrud(table, payload);
      toast.success('Gestão atualizada', 'A Husky guardou as mudanças.');
      setModalOpen(false);
      await rows.reload();
    } catch (error) {
      toast.error('Não deu para salvar', error instanceof Error ? error.message : undefined);
    } finally {
      setSaving(false);
    }
  }

  function fieldControl(field: AdminField) {
    const value = form[field.name];
    const setValue = (next: unknown) => setForm((current) => ({ ...current, [field.name]: next }));
    if (field.type === 'textarea' || field.type === 'json') {
      return (
        <Textarea
          key={field.name}
          label={field.label}
          value={String(value ?? '')}
          onChange={(event) => setValue(event.target.value)}
          placeholder={field.placeholder}
          className={field.type === 'json' ? 'min-h-52 font-mono text-xs' : undefined}
        />
      );
    }
    if (field.type === 'select') {
      return (
        <Select key={field.name} label={field.label} value={String(value ?? '')} onChange={(event) => setValue(event.target.value)}>
          <option value="">Selecione</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      );
    }
    if (field.type === 'boolean') {
      return (
        <label key={field.name} className="flex items-center gap-3 rounded-brand bg-husky-beige/30 p-3 text-sm font-bold text-husky-brown dark:bg-white/8 dark:text-husky-cream">
          <input type="checkbox" checked={Boolean(value)} onChange={(event) => setValue(event.target.checked)} />
          {field.label}
        </label>
      );
    }
    if (field.type === 'media') {
      return (
        <div key={field.name} className="space-y-2">
          <Input label={field.label} value={String(value ?? '')} onChange={(event) => setValue(event.target.value)} placeholder={field.placeholder} />
          <MediaUploader value={String(value ?? '')} folder={table} onChange={setValue} />
        </div>
      );
    }
    return (
      <Input
        key={field.name}
        label={field.label}
        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'datetime' ? 'datetime-local' : 'text'}
        step={field.type === 'number' ? '0.01' : undefined}
        value={String(value ?? '')}
        onChange={(event) => setValue(event.target.value)}
        placeholder={field.placeholder}
      />
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={
          <div className="flex gap-2">
            {extraAction}
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
              Novo ✨
            </Button>
          </div>
        }
      />
      <DataTable rows={rows.data ?? []} columns={tableColumns} getRowKey={(row) => String(row.id)} emptyTitle="Nada cadastrado ainda." />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Editar ${getTitle?.(editing) ?? 'item'}` : `Novo registro`} size="lg">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          {fields.map((field) => <div key={field.name} className={field.type === 'textarea' || field.type === 'json' || field.type === 'media' ? 'md:col-span-2' : undefined}>{fieldControl(field)}</div>)}
          <div className="md:col-span-2">
            <Button type="submit" isLoading={saving}>
              Salvar 💙
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
