import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { DownloadIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { getAsync, uploadAsync } from '@/state/mainContent/mainContentSlice';
import { FileIcon } from 'lucide-react';

const UploadDialog = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const isLoading = useSelector(
    (state: RootState) => state.mainContent.loading
  );

  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null); // Declare fileInputRef using useRef

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // get the selected file from the input
    if (!e.target.files) {
      return;
    }
    setSelectedFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const handleSubmit = () => {
    if (!selectedFile) return;
    // create a new FormData object and append the file to it
    const formData = new FormData();
    formData.append('file', selectedFile);

    // make a POST request to the File Upload API with the FormData object and Rapid API headers
    dispatch(uploadAsync(formData));

    // Clear the selected file after submission
    setSelectedFile(null);
    // Reset the input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    dispatch(getAsync());
  };

  const handleDragOver = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e);
    return e;
  };

  const handleDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <>
      {isLoading ? (
        <h1>pending</h1>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger>
            <div className=" text-xl text-000 inline-flex items-center justify-center whitespace-nowrap rounded-md  font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-3 py-1">
              +
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Upload New File</AlertDialogTitle>
            </AlertDialogHeader>
            <div>
              <label
                className="bg-inherit border-slate-500	"
                htmlFor="file_input"
              >
                <div className="transition-all text-center flex flex-col justify-between hover:opacity-50 hover:bg-accent border-dashed border-2 hover:text-accent-foreground bg-transparent shadow-sm text-sm pt-12 pb-5 border-input rounded-md h-36 ">
                  {fileName ? (
                    <>
                      <FileIcon className="scale-[2] w-full" />
                      <p className="text-sm font-semibold">{fileName}</p>
                    </>
                  ) : (
                    <>
                      <DownloadIcon className="scale-[4] w-full" />
                      <p className="text-sm font-semibold">
                        Browse or drop your files here!
                      </p>
                    </>
                  )}
                </div>
                <Input
                  id="file_input"
                  type="file"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
              </label>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setFileName(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  onClick={handleSubmit}
                  className="color-transition text-white hover:bg-gradient-to-r from-cyan-500 to-blue-500"
                >
                  Upload
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default UploadDialog;
