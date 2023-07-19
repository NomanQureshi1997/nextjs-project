import React, { ReactNode } from "react";
import { UserCircleIcon, ClockIcon, CalendarIcon, GlobeIcon } from "lucide-react";
import PropTypes from "prop-types";

// interface ArticleHeaderProps {
//   title?: string;
//   date?: string;
//   author?: string;
//   source?: string;
//   fullSource?: string;
//   minutesToRead?: string;
// }

// const ArticleHeader: React.FC<ArticleHeaderProps> = ({
//   title = "Untitled",
//   date,
//   author = "Untitled",
//   source,
//   fullSource,
//   minutesToRead,
// }) => {
//   return (
//     <div className="mb-10">
//       <div className="mb-6">
//         <h1 className="text-5xl font-bold text-gray-900">{title}</h1>
//       </div>
//       <div className="-ml-4 -mt-4 flex flex-wrap items-center space-x-4 leading-3 !text-gray-800">
//         <div className="ml-4 mt-4 flex items-center space-x-1.5">
//           <svg
//             width="15"
//             height="15"
//             viewBox="0 0 15 15"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4"
//           >
//             <path
//               d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z"
//               fill="currentColor"
//               fill-rule="evenodd"
//               clip-rule="evenodd"
//             ></path>
//           </svg>
//           <div>{author}</div>
//         </div>
//         <div className="ml-4 mt-4 flex items-center space-x-1.5">
//           <svg
//             width="15"
//             height="15"
//             viewBox="0 0 15 15"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4"
//           >
//             <path
//               d="M4.5 1C4.77614 1 5 1.22386 5 1.5V2H10V1.5C10 1.22386 10.2239 1 10.5 1C10.7761 1 11 1.22386 11 1.5V2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V3.5C1 2.67157 1.67157 2 2.5 2H4V1.5C4 1.22386 4.22386 1 4.5 1ZM10 3V3.5C10 3.77614 10.2239 4 10.5 4C10.7761 4 11 3.77614 11 3.5V3H12.5C12.7761 3 13 3.22386 13 3.5V5H2V3.5C2 3.22386 2.22386 3 2.5 3H4V3.5C4 3.77614 4.22386 4 4.5 4C4.77614 4 5 3.77614 5 3.5V3H10ZM2 6V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V6H2ZM7 7.5C7 7.22386 7.22386 7 7.5 7C7.77614 7 8 7.22386 8 7.5C8 7.77614 7.77614 8 7.5 8C7.22386 8 7 7.77614 7 7.5ZM9.5 7C9.22386 7 9 7.22386 9 7.5C9 7.77614 9.22386 8 9.5 8C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7ZM11 7.5C11 7.22386 11.2239 7 11.5 7C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8C11.2239 8 11 7.77614 11 7.5ZM11.5 9C11.2239 9 11 9.22386 11 9.5C11 9.77614 11.2239 10 11.5 10C11.7761 10 12 9.77614 12 9.5C12 9.22386 11.7761 9 11.5 9ZM9 9.5C9 9.22386 9.22386 9 9.5 9C9.77614 9 10 9.22386 10 9.5C10 9.77614 9.77614 10 9.5 10C9.22386 10 9 9.77614 9 9.5ZM7.5 9C7.22386 9 7 9.22386 7 9.5C7 9.77614 7.22386 10 7.5 10C7.77614 10 8 9.77614 8 9.5C8 9.22386 7.77614 9 7.5 9ZM5 9.5C5 9.22386 5.22386 9 5.5 9C5.77614 9 6 9.22386 6 9.5C6 9.77614 5.77614 10 5.5 10C5.22386 10 5 9.77614 5 9.5ZM3.5 9C3.22386 9 3 9.22386 3 9.5C3 9.77614 3.22386 10 3.5 10C3.77614 10 4 9.77614 4 9.5C4 9.22386 3.77614 9 3.5 9ZM3 11.5C3 11.2239 3.22386 11 3.5 11C3.77614 11 4 11.2239 4 11.5C4 11.7761 3.77614 12 3.5 12C3.22386 12 3 11.7761 3 11.5ZM5.5 11C5.22386 11 5 11.2239 5 11.5C5 11.7761 5.22386 12 5.5 12C5.77614 12 6 11.7761 6 11.5C6 11.2239 5.77614 11 5.5 11ZM7 11.5C7 11.2239 7.22386 11 7.5 11C7.77614 11 8 11.2239 8 11.5C8 11.7761 7.77614 12 7.5 12C7.22386 12 7 11.7761 7 11.5ZM9.5 11C9.22386 11 9 11.2239 9 11.5C9 11.7761 9.22386 12 9.5 12C9.77614 12 10 11.7761 10 11.5C10 11.2239 9.77614 11 9.5 11Z"
//               fill="currentColor"
//               fill-rule="evenodd"
//               clip-rule="evenodd"
//             ></path>
//           </svg>
//           <div>{date}</div>
//         </div>
//         <div className="ml-4 mt-4 flex items-center space-x-1.5">
//           <svg
//             width="15"
//             height="15"
//             viewBox="0 0 15 15"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4"
//           >
//             <path
//               d="M7.49996 1.80002C4.35194 1.80002 1.79996 4.352 1.79996 7.50002C1.79996 10.648 4.35194 13.2 7.49996 13.2C10.648 13.2 13.2 10.648 13.2 7.50002C13.2 4.352 10.648 1.80002 7.49996 1.80002ZM0.899963 7.50002C0.899963 3.85494 3.85488 0.900024 7.49996 0.900024C11.145 0.900024 14.1 3.85494 14.1 7.50002C14.1 11.1451 11.145 14.1 7.49996 14.1C3.85488 14.1 0.899963 11.1451 0.899963 7.50002Z"
//               fill="currentColor"
//               fill-rule="evenodd"
//               clip-rule="evenodd"
//             ></path>
//             <path
//               d="M13.4999 7.89998H1.49994V7.09998H13.4999V7.89998Z"
//               fill="currentColor"
//               fill-rule="evenodd"
//               clip-rule="evenodd"
//             ></path>
//             <path
//               d="M7.09991 13.5V1.5H7.89991V13.5H7.09991zM10.375 7.49998C10.375 5.32724 9.59364 3.17778 8.06183 1.75656L8.53793 1.24341C10.2396 2.82218 11.075 5.17273 11.075 7.49998 11.075 9.82724 10.2396 12.1778 8.53793 13.7566L8.06183 13.2434C9.59364 11.8222 10.375 9.67273 10.375 7.49998zM3.99969 7.5C3.99969 5.17611 4.80786 2.82678 6.45768 1.24719L6.94177 1.75281C5.4582 3.17323 4.69969 5.32389 4.69969 7.5 4.6997 9.67611 5.45822 11.8268 6.94179 13.2472L6.45769 13.7528C4.80788 12.1732 3.9997 9.8239 3.99969 7.5z"
//               fill="currentColor"
//               fill-rule="evenodd"
//               clip-rule="evenodd"
//             ></path>
//             <path
//               d="M7.49996 3.95801C9.66928 3.95801 11.8753 4.35915 13.3706 5.19448 13.5394 5.28875 13.5998 5.50197 13.5055 5.67073 13.4113 5.83948 13.198 5.89987 13.0293 5.8056 11.6794 5.05155 9.60799 4.65801 7.49996 4.65801 5.39192 4.65801 3.32052 5.05155 1.97064 5.8056 1.80188 5.89987 1.58866 5.83948 1.49439 5.67073 1.40013 5.50197 1.46051 5.28875 1.62927 5.19448 3.12466 4.35915 5.33063 3.95801 7.49996 3.95801zM7.49996 10.85C9.66928 10.85 11.8753 10.4488 13.3706 9.6135 13.5394 9.51924 13.5998 9.30601 13.5055 9.13726 13.4113 8.9685 13.198 8.90812 13.0293 9.00238 11.6794 9.75643 9.60799 10.15 7.49996 10.15 5.39192 10.15 3.32052 9.75643 1.97064 9.00239 1.80188 8.90812 1.58866 8.9685 1.49439 9.13726 1.40013 9.30601 1.46051 9.51924 1.62927 9.6135 3.12466 10.4488 5.33063 10.85 7.49996 10.85z"
//               fill="currentColor"
//               fill-rule="evenodd"
//               clip-rule="evenodd"
//             ></path>
//           </svg>
//           <a
//             href={fullSource}
//             target="_blank"
//             rel="noreferrer"
//             className="!text-gray-600 transition hover:!text-gray-400"
//           >
//             {source}
//           </a>
//         </div>
//         <div className="ml-4 mt-4 flex items-center space-x-1.5">
//           <svg
//             width="15"
//             height="15"
//             viewBox="0 0 15 15"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4"
//           >
//             <path
//               d="M7.5 11C4.80285 11 2.52952 9.62184 1.09622 7.50001C2.52952 5.37816 4.80285 4 7.5 4C10.1971 4 12.4705 5.37816 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11ZM7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C1.65639 10.2936 4.30786 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C13.3436 4.70638 10.6921 3 7.5 3ZM7.5 9.5C8.60457 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5Z"
//               fill="currentColor"
//               fill-rule="evenodd"
//               clip-rule="evenodd"
//             ></path>
//           </svg>
//           <div>{minutesToRead} min read</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ArticleHeader;

interface ArticleHeaderProps {
  title?: string;
  date: string;
  author?: string;
  source?: string;
  fullSource?: string;
  minutesToRead?: string;
}

const styles = {
  header: "mb-10 space-y-6",
  title: "mb-6 text-5xl font-bold text-gray-900",
  metadata:
    "-ml-3 -mt-4 flex flex-wrap items-center space-x-4 leading-3 text-gray-800",
  metaItem: "ml-4 mt-4 flex items-center space-x-1.5",
  icon: "h-5 w-5",
};

const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  title = "Article Title Not Available",
  date = "Date Not Available",
  author = "Author Not Available",
  source,
  fullSource,
  minutesToRead = 0,
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <h1>{title}</h1>
      </div>
      <div className={styles.metadata}>
        <div className={styles.metaItem}>
          <UserCircleIcon className={styles.icon} />
          <address>{author}</address>
        </div>
        <div className={styles.metaItem}>
          <CalendarIcon className={styles.icon} />
          <div>{date}</div>
        </div>
        <div className={styles.metaItem}>
          <GlobeIcon className={styles.icon} />
          <a
            href={fullSource}
            target="_blank"
            rel="noreferrer"
            className="!text-gray-600 transition hover:!text-gray-400"
          >
            {source}
          </a>
        </div>
        <div className={styles.metaItem}>
          <ClockIcon className={styles.icon} />
          <div>{`${minutesToRead} min read`}</div>
        </div>
      </div>
    </header>
  );
};

export default ArticleHeader;
