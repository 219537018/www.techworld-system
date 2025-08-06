import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const PublishedJobsList = () => {

  const { aToken, jobs, getAllPublishedJobs } = useContext(AdminContext);
  const { formatJobDate } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllPublishedJobs();
    }
  }, [aToken]);

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Published Jobs</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {jobs.map((item, index) => (
          <div className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
            <img className='bg-[#EAEFFF] w-full h-32 object-cover group-hover:bg-primary transition-all duration-500' src={item.image || '/default-job.png'} alt="Job" />
            <div className='p-4'>
              <p className='text-[#262626] text-lg font-medium'>{item.title}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.company}</p>
              <p className='text-xs text-gray-500 mt-1'>Posted: {formatJobDate(item.postedDate)}</p>
              <p className='text-xs text-gray-500'>Closing: {formatJobDate(item.closeDate)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublishedJobsList;
