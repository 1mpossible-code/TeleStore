import { DataTable } from './DataTable/DataTable';
import { columns } from './DataTable/Columns';
import { Upload } from '@/App';

// Define a type for the component's props
type MainContentProps = {
  uploads_data: Array<Upload>;
};

const MainContent: React.FC<MainContentProps> = ({ uploads_data }) => {
  return (
    <div className="margin-auto mx-24	">
      <DataTable columns={columns} data={uploads_data} />
    </div>
  );
};
export default MainContent;
