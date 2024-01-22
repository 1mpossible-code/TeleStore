import { DataTable } from './DataTable/DataTable';
import { columns } from './DataTable/Columns';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../state/store';
import { getAsync } from '@/state/mainContent/mainContentSlice';
import { useEffect } from 'react';



const MainContent = () => {
  const data = useSelector((state: RootState) => state.mainContent.data);
  const isLoading = useSelector((state: RootState) => state.mainContent.loading);
  const error = useSelector((state: RootState) => state.mainContent.error);


  const dispatch = useDispatch<AppDispatch>();

  useEffect(()=>{
    dispatch(getAsync())}, []
  );
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return isLoading ? (
    <h1>Loading</h1>
  ) : (
    <div className="margin-auto mx-24	">
      <DataTable columns={columns} data={data} />
    </div>
  );
};
export default MainContent;
