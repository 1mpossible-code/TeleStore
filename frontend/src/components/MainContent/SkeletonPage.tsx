import { Skeleton } from "../ui/skeleton";

const SkeletonPage = () => {
  return (
    <div className="flex-col px-20 pt-7">
      <div className="flex justify-between">
        <Skeleton className="w-1/4 h-5 rounded-full ml-5  mb-7" />
        <div className="flex">
          <Skeleton className="w-10 h-10 rounded-full ml-5  mb-7" />
          <Skeleton className="w-16 h-10 rounded-full ml-5  mb-7" />
        </div>
      </div>
      <Skeleton className="w-60% h-[25px] rounded-full ml-[1.5rem] mb-6" />
      <Skeleton className="w-60% h-[20px] rounded-full ml-[1.5rem] mb-14" />
      <Skeleton className="w-60% h-[20px] rounded-full ml-[1.5rem] mb-14" />
      <Skeleton className="w-60% h-[20px] rounded-full ml-[1.5rem] mb-7" />
      <Skeleton className="w-60% h-[20px] rounded-full ml-[1.5rem] mb-14" />
      <Skeleton className="w-60% h-[20px] rounded-full ml-[1.5rem] mb-7" />
      <Skeleton className="w-60% h-[20px] rounded-full ml-[1.5rem] mb-14" />
      <Skeleton className="w-60% h-[20px] rounded-full ml-[1.5rem] mb-7" />
    </div>
  );
}
export default SkeletonPage