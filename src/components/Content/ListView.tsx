import React from "react";
import { DataTable } from "~/components/Content/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DiffbotItem } from "~/types";

const columnDefinitions: { [key: string]: string } = {
    title: "Title",
    summary: "Summary",
    date: "Date",
    link: "Link",
    image: "Image",
  };
  
//extends Item
type DataItem = DiffbotItem & {
  [key: string]: any; // For any other keys that may exist
};

// Create a function to generate column definitions based on data
function generateColumns(item: DataItem): ColumnDef<DataItem>[] {
    return Object.keys(item).map(key => {
      if (key in columnDefinitions) {
        const columnDef: ColumnDef<DataItem> = {
          accessorKey: key,
          header: columnDefinitions[key],
        };
  
        if (key === 'image') {
          columnDef.cell = ({ row }) => (
            row.original.image ? <img src={row.original.image} alt="" /> : null
          );
        }
  
        if (key === 'link') {
            columnDef.cell = ({ row }) => (
                row.original.link ? 
                    <a 
                        style={{
                            color: '#1a0dab', 
                            textDecoration: 'none',
                            padding: '10px',
                            borderRadius: '5px',
                            transition: 'background-color 0.2s',
                            display: 'inline-block'
                        }}
                        className='hover:underline hover:bg-gray-200'
                        href={row.original.link} 
                        target="_blank" 
                        rel="noreferrer"
                    >
                        {row.original.link}
                    </a> 
                : null
            );
        }
        
  
        return columnDef;
      }
  
      return null;
    }).filter(Boolean) as ColumnDef<DataItem>[];  // Assert here
  }
  

  const ListView: React.FC<{ data: DataItem[] }> = ({ data }) => {
    const items = data;
    const columns =
      items && items.length > 0 && items[0] ? generateColumns(items[0]) : [];
  
    return (
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={items || []} />
      </div>
    );
  };
  

export default ListView;
