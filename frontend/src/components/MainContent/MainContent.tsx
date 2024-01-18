import { DataTable } from './DataTable/DataTable';
import { columns, Uploads } from './DataTable/Columns';
import UserData from '@/UserData';

const MainContent = () => {
  return (
    <div className="margin-auto mx-24	">
      <DataTable columns={columns} data={UserData} />
    </div>
  );
};
export default MainContent;
