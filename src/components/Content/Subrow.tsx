import React, { ReactNode, MouseEventHandler, FC } from 'react';

interface SubRowProps {
  children: ReactNode;
  classes?: string;
  subclasses?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const SubRow: FC<SubRowProps> = ({ children, classes = '', subclasses = '', onClick }) => {
  return (
    <div className={`flex justify-between ${classes}`} onClick={onClick}>
      <div
        className={`flex items-center justify-center gap-1 self-center pt-2 text-xs ${subclasses}`}
      >
        {children}
      </div>
    </div>
  );
}

SubRow.displayName = 'SubRow';
export default SubRow;
