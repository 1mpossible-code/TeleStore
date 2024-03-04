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
import React, {useState, useRef, DragEvent} from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import {setSelected, uploadAsync} from '@/state/mainContent/mainContentSlice';
import { FileIcon, Upload } from 'lucide-react';
import cn from 'classnames'

const UploadDialog = () => {
  const isFetching = useSelector((state: RootState) => state.mainContent.Fetching);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null); // Declare fileInputRef using useRef
  const dispatch = useDispatch<AppDispatch>();
  const [isOver, setIsOver] = useState(false);


  const setFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const filesArray: File[] = Array.from(newFiles);

    setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
    setFileNames((prevNames) => [
      ...prevNames,
      ...filesArray.map((file) => file.name),
    ]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // get the selected file from the input
    if (!e.target.files) {
      return;
    }
    setFiles(e.target.files);
  };

  const handleSubmit = () => {
    if (!selectedFiles.length) return;
    dispatch(setSelected(selectedFiles.length))

    selectedFiles.forEach((file) => {
      const formData = new FormData();
      formData.append('file', file);

      dispatch(uploadAsync(formData));
    });

    //Reset files
    setSelectedFiles([]);
    setFileNames([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  // Define the event handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);

    setFiles(e.dataTransfer.files)
  };



  return (
    <>
      {isFetching ? (
        <h1>pending</h1>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger>
            <div className=" text-xl text-000 inline-flex items-center justify-center whitespace-nowrap rounded-md  font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-3 py-1">
              <Upload />
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
                <div
                  className={cn(isOver?"opacity-50 bg-accent text-accent-foreground":"","transition-all text-center flex flex-col justify-between hover:opacity-50 hover:bg-accent border-dashed border-2 hover:text-accent-foreground bg-transparent shadow-sm text-sm pt-12 pb-5 border-input rounded-md h-36 ")}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {fileNames.length > 0 ? (
                    <div>
                      <FileIcon className="scale-[2] w-full" />
                      {/* Here I'm going to add an accordian to see the files that were uploaded inside that accorddian to keep a clean UI */}
                      {fileNames.map((name: string, FileId) => (
                        <p className="text-sm font-semibold" key={FileId}>
                          {name}
                        </p>
                      ))}
                    </div>
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
                  multiple
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
              </label>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setFileNames([]);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  onClick={handleSubmit}
                  className="color-transition bg-primary hover:bg-blue-400	 text-white "
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
