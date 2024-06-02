'use client';

import * as React from 'react';
import cn from "classnames";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

//Component styling imports
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

// ui imports
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import UploadDialog from './UploadDialog';

//Redux methods imports
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/state/store';
import {
  deleteAsync,
  downloadAsync, setSelected,
} from '@/state/mainContent/mainContentSlice';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const dispatch = useDispatch<AppDispatch>();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleDeleteSelected = async (selected: Array<TData>) => {
    for (let idx = 0; idx < selected.length; idx++) {
      //@ts-ignore
      dispatch(deleteAsync(selected[idx]));
      setRowSelection({});
    }
  };
    const handleDownloadSelected = async (selected:any) => {
      for (let idx = 0; idx < selected.length; idx++) {
        //@ts-ignore
        dispatch(downloadAsync({id:selected[idx][0], name:selected[idx][1]}));
        setRowSelection({});
      }
    };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search by name..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className=" flex ml-auto space-x-4">
          <UploadDialog />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between space-x-2 py-4">
        <AlertDialog>
          <AlertDialogTrigger
            disabled={!table.getFilteredSelectedRowModel().rows.length}
          >
            <div
              className={cn(
                !!table.getFilteredSelectedRowModel().rows.length
                  ? 'bg-primary hover:bg-blue-400'
                  : 'bg-secondary cursor-not-allowed ',
                'py-2 px-4 rounded-md whitespace-nowrap items-center justify-center h-9 inline-flex shadow text-primary-foreground font-medium flex-1 text-sm '
              )}
            >
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Selected Actions</AlertDialogTitle>
            </AlertDialogHeader>


              <>
                <AlertDialogDescription>
                  You currently have
                  <b> {table.getFilteredSelectedRowModel().rows.length} </b>
                  file(s) selected!
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      className="transition-colors text-white bg-red-600 hover:bg-red-700 "
                      onClick={() => {
                        dispatch(setSelected(table.getFilteredSelectedRowModel().rows.length))
                        const selected_id: Array<TData> = table
                          .getFilteredSelectedRowModel()
                          .rows.map((sel_row) => {
                            // @ts-ignore
                            return sel_row.original.id;
                          });
                        handleDeleteSelected(selected_id);
                      }}
                    >
                      Delete file(s)
                    </Button>
                  </AlertDialogAction>
                  <AlertDialogAction asChild>
                    <Button
                      className="bg-indigo-500 hover:bg-indigo-600 text-white"
                      onClick={() => {
                        dispatch(setSelected(table.getFilteredSelectedRowModel().rows.length))
                        const selected__tup = table
                          .getFilteredSelectedRowModel()
                          .rows.map((sel_row) => {
                            // @ts-ignore
                            return [sel_row.original.id, sel_row.original.name];
                          });
                        console.log(selected__tup);
                        handleDownloadSelected(selected__tup);
                      }}
                    >
                      Download file(s)
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </>

          </AlertDialogContent>
        </AlertDialog>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
