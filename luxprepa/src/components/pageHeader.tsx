import type{ FC } from "react";

interface PageHeaderProps {
  title: string;
  sub?: string;
}

const PageHeader: FC<PageHeaderProps> = ({ title, sub }) => (
  <div className="bg-[#0a0a0a] px-10 md:px-20 py-10">
    <h1 className="font-clash text-[36px] font-bold text-white">{title}</h1>
    {sub && <p className="text-[#888] text-sm mt-1.5">{sub}</p>}
  </div>
);

export default PageHeader;
