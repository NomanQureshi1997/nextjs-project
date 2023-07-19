"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationButtons() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchTerm = searchParams?.get("searchTerm");
  let startIndex = 1;
  
  const startParam = searchParams?.get("start");
  if (startParam !== null) {
      const parsedStartIndex = parseInt(startParam ?? "", 10);
      if (!isNaN(parsedStartIndex)) {
          startIndex = parsedStartIndex;
      }
  }
  

  return (
    <div className="text-blue-700 flex px-10 pb-4 justify-between sm:justify-start sm:space-x-44 sm:px-0">
      {startIndex >= 10 && (
        <Link
          href={`${pathname}?searchTerm=${searchTerm}&start=${startIndex - 10}`}
        >
          <div className="flex flex-col cursor-pointer items-center hover:underline">
            <ChevronLeft className="h-5" />
            <p>Previous</p>
          </div>
        </Link>
      )}
      {startIndex <= 90 && (
        <Link
          href={`${pathname}?searchTerm=${searchTerm}&start=${startIndex + 10}`}
        >
          <div className="flex flex-col cursor-pointer items-center hover:underline">
            <ChevronRight className="h-5" />
            <p>Next</p>
          </div>
        </Link>
      )}
    </div>
  );
}