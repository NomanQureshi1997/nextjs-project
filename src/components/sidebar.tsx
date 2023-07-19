import { FC } from "react";
import Image from "next/image";

import { Source } from "@prisma/client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface SidebarProps {
  results: Source[];
}

const Sidebar: FC<SidebarProps> = ({ results }) => {
  const [displayResults, setDisplayResults] = useState<Source[]>([]);

  useEffect(() => {
    setDisplayResults(results);
  }, [results]);  

    return (
      <div className="mb-6 grid grid-cols-1 gap-4 lg:ml-20">
        {displayResults && displayResults.length > 1 && displayResults.map((displayResult: any, index: any) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-gray-500 bg-white shadow-lg"
          >
            <div className="px-6 py-4">
              <div className="mb-2 flex items-center">
                <Image
                  src={displayResult.favicon ? displayResult.favicon : "/favicon.ico"}
                  alt="favicon"
                  width={20}
                  height={20}
                  className="rounded-full"
                />{" "}
                {/* replace favicon.ico with your favicon URL */}
                <Link
                  href={displayResult.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-500 underline transition duration-300 hover:text-blue-700"
                >
                  {displayResult.url}
                </Link>
              </div>
              <div className="mb-2 text-xl font-bold">{displayResult.title}</div>
              <p className="text-base text-gray-700">{displayResult.snippet}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

export default Sidebar;