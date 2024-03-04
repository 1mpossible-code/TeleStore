import { DataTable } from './DataTable/DataTable';
import { columns } from './DataTable/Columns';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../state/store';
import { getAsync } from '@/state/mainContent/mainContentSlice';
import { useEffect } from 'react';
import SkeletonPage from './SkeletonPage';



const MainContent = () => {
  const data = useSelector((state: RootState) => state.mainContent.data);
  const isFetching = useSelector(
    (state: RootState) => state.mainContent.Fetching
  );
  const error = useSelector((state: RootState) => state.mainContent.error);


  const dispatch = useDispatch<AppDispatch>();

  useEffect(()=>{
    dispatch(getAsync())}, []
  );
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return isFetching ? (
    <SkeletonPage/>
  ) : (
    <div className="margin-auto mx-24	">
      <DataTable columns={columns} data={data} />

    </div>
  );
};
export default MainContent;
