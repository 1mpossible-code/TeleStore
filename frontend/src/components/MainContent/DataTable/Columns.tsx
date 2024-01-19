'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Upload } from '@/App';
function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const columns: ColumnDef<Upload>[] = [
  {
    accessorKey: 'id',
    header: 'File ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'size',
    header: () => <div className="text-right">File Size</div>,
    cell: ({ row }) => {
      const size = parseFloat(row.getValue('size'));
      const formatted = formatBytes(size);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
