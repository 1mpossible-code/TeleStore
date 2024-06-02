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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/state/store';
import { deleteAsync } from '@/state/mainContent/mainContentSlice';

import { Button } from '@/components/ui/button';

interface DeleteDialogProps {
  Uid: number;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ Uid }) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <p className="text-sm"> Delete File</p>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            upload and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <DropdownMenuItem asChild>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="bg-red-600 hover:bg-red-500">
            <AlertDialogAction asChild className="">
              <Button
                className="bg-red-600 hover:bg-red-500 text-white	"
                onClick={async () => {
                  dispatch(deleteAsync(Uid));
                }}
              >
                Yes, delete file
              </Button>
            </AlertDialogAction>
          </DropdownMenuItem>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
