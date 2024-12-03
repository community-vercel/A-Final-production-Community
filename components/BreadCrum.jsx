// Breadcrumb.js
import React from 'react';
import Link from 'next/link';
import { ChevronRight } from '@mui/icons-material';

const Breadcrumb = ({ items }) => {
  return (
    <nav className=" flex items-center text-sm text-[#000000] font-medium space-x-1 mt-0">
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          <Link href={item.href}>
            <p
              className={`${
                index === items.length - 1 ? "text-[#000000]" : "text-blue-700 text-font-bold text-[16px]"
              } hover:underline`}
            >
              {item.label}
          </p>
          </Link>
          {index < items.length - 1 && (
            <ChevronRight
            className="h-4 w-4 text-[#000000] font-bold  mx-1"
            aria-hidden="true"
            />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
