import { DataTable } from './DataTable/DataTable';
import { columns } from './DataTable/Columns';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Define a type for the component's props
export interface Upload {
  id: number;
  name: string;
  size: number;
}
const MainContent = () => {
  const [uploads, setUploads] = useState<Array<Upload>>([]);

  useEffect(() => {
    (async () => {
      const res = await axios.get<Array<Upload>>(
        'http://127.0.0.1:3000/uploads/'
      );
      setUploads(res.data);
    })();
  }, []);

  return (
    <div className="margin-auto mx-24	">
      <DataTable columns={columns} data={uploads} />
    </div>
  );
};
export default MainContent;
