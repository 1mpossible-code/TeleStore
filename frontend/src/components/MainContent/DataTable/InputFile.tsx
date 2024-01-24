import { Input } from '@/components/ui/input';
import React, { useState, useRef } from 'react';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/state/store';
import { getAsync, uploadAsync } from '@/state/mainContent/mainContentSlice';

export function InputFile() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null); // Declare fileInputRef using useRef

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // get the selected file from the input
    if (!e.target.files) {
      return;
    }
    setSelectedFile(e.target.files[0]);
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

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Input type="file" onChange={handleFileUpload} ref={fileInputRef} />
      <button onClick={handleSubmit}>Submit</button> 
    </div>
  );
}


  
