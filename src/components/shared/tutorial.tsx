// import React, { useState } from "react";
// import * as Tabs from "@radix-ui/react-tabs";
// import { Button } from "@/components/ui/button";

// const Buttons = ({
//     handleClickTryIt,
//     handleClickLearnMore,
// }: {
//     handleClickTryIt: () => void;
//     handleClickLearnMore: () => void;
// }) => {
//     return (
//         <div className="flex justify-center space-x-4 mt-8">
//             <Button onClick={handleClickTryIt}>Try It</Button>
//             <Button variant="link" onClick={handleClickLearnMore}>Learn More</Button>
//         </div>
//     );
// }

// const TabsData = [
//     {
//         title: "Tab 1",
//         content: "This is some content for Tab 1",
//     },
//     {
//         title: "Tab 2",
//         content: "This is some content for Tab 2",
//     },
//     {
//         title: "Tab 3",
//         content: "This is some content for Tab 3",
//     },
//     {
//         title: "Tab 4",
//         content: "This is some content for Tab 4",
//     },
//     {
//         title: "Tab 5",
//         content: "This is some content for Tab 5",
//     },
// ];

// const Tutorial = () => {
// //   const tabs = ["Tab 1", "Tab 2", "Tab 3", "Tab 4", "Tab 5"];
//   const tabs = TabsData
//   const [tabValue, setTabValue] = useState(tabs[0]);

//   const navigate = (direction: "left" | "right") => {
//     const currentIndex = tabs.findIndex(tab => tab === tabValue);
//     if (direction === "left" && currentIndex > 0) {
//       setTabValue(tabs[currentIndex - 1]);
//     } else if (direction === "right" && currentIndex < tabs.length - 1) {
//       setTabValue(tabs[currentIndex + 1]);
//     }
//   };

//   return (
//     <div
//       className="mx-auto mt-16 max-w-lg overflow-hidden rounded-xl w-full"
//       style={{
//         backdropFilter: "blur(20px)",
//         backgroundColor: "rgba(255, 255, 255, 0.3)",
//         boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
//         border: "1px solid rgba(255, 255, 255, 0.18)",
//       }}
//     >
//       <Tabs.Root
//         className="relative"
//         value={tabValue}
//         onValueChange={setTabValue}
//       >
//         <div className="flex items-center justify-between p-4">
//           <button 
//             onClick={() => navigate('left')}
//             className="text-2xl font-bold text-gray-600"
//             disabled={tabValue === tabs[0]} 
//           >
//             &lt;
//           </button>
//           <div className="flex justify-center space-x-4">
//             {tabs.map((tab, index) => (
//               <div
//                 onClick={() => setTabValue(tab)}
//                 className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-500 ease-in-out ${
//                   tabValue === tab ? "bg-purple-700" : "bg-gray-300"
//                 }`}
//                 key={index}
//               ></div>
//             ))}
//           </div>
//           <button 
//             onClick={() => navigate('right')}
//             className="text-2xl font-bold text-gray-600"
//             disabled={tabValue === tabs[tabs.length - 1]} 
//           >
//             &gt;
//           </button>
//         </div>
//         {tabs.map((tab) => (
//           <Tabs.Content className="px-6 py-4" 
//             <h2 className="text-xl font-bold text-gray-700 mb-2">{tab}</h2>
//             <p className="text-lg italic text-gray-500">
//               This is some content for {tab}
//             </p>
//             <Buttons
//               handleClickTryIt={() => alert(`Trying it for ${tab}`)}
//               handleClickLearnMore={() => alert(`Learning more about ${tab}`)}
//             />
//           </Tabs.Content>
//         ))}
//       </Tabs.Root>
//     </div>
//   );
// };

// export default Tutorial;


"use client";
import React, { use, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";

const Buttons = ({
  handleClickTryIt,
  handleClickLearnMore,
}: {
  handleClickTryIt: () => void;
  handleClickLearnMore: () => void;
}) => {
  return (
    <div className="mt-8 flex justify-center space-x-4">
      <Button onClick={handleClickTryIt} className="min-w-[100px]">
      Try It</Button>
      <Button variant="link" onClick={handleClickLearnMore}>
        Learn More
      </Button>
    </div>
  );
};

const TabsData = [
  {
    title: "Tab 1",
    content: "This is some content for Tab 1",
  },
  {
    title: "Tab 2",
    content: "This is some content for Tab 2",
  },
  {
    title: "Tab 3",
    content: "This is some content for Tab 3",
  },
  {
    title: "Tab 4",
    content: "This is some content for Tab 4",
  },
  {
    title: "Tab 5",
    content: "This is some content for Tab 5",
  },
];

const Tutorial = () => {
  const [tabValue, setTabValue] = useState(TabsData[0]);

  const navigate = (direction: "left" | "right") => {
    const currentIndex = TabsData.findIndex((tab) => tab === tabValue);
    if (direction === "left" && currentIndex > 0) {
      setTabValue(TabsData[currentIndex - 1]);
    } else if (direction === "right" && currentIndex < TabsData.length - 1) {
      setTabValue(TabsData[currentIndex + 1]);
    }
  };

  return (
    <div
      className="mx-auto mt-16 max-w-lg overflow-hidden rounded-xl sm:w-[300px] md:w-[400px] mb-16"
      style={{
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        // background: 'rgba(255, 255, 255, 0.3)',
        // boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        // backdropFilter: 'blur(20px)',
        // WebkitBackdropFilter: 'blur(20px)',
        // borderRadius: '10px',
        // border: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      <Tabs.Root
        className="relative"
        value={tabValue?.title}
        // onValueChange={(value) => setTabValue(TabsData.find(tab => tab.title === value))} // doesn't work because value is a string
        onValueChange={(value) =>
          setTabValue(
            TabsData.find((tab) => tab.title === value) || TabsData[0],
          )
        }
      >
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate("left")}
            className={`text-2xl font-bold ${
              tabValue === TabsData[0] ? "text-gray-400" : "text-gray-600"
            } flex items-center justify-center rounded-full bg-white`}
            disabled={tabValue === TabsData[0]}
            style={{
              padding: "10px",
              minWidth: "40px",
            }}
          >
            <ChevronLeft
              size={24}
              color={tabValue === TabsData[0] ? "gray" : "black"}
            />
          </button>

          <div className="flex justify-center space-x-4">
            {TabsData.map((tab, index) => (
              <div
                onClick={() => setTabValue(tab)}
                className={`h-2 w-2 cursor-pointer rounded-full transition-all duration-500 ease-in-out ${
                  tabValue?.title === tab.title ? "bg-purple-700" : "bg-gray-300"
                }`}
                key={index}
              ></div>
            ))}
          </div>
          <button
            onClick={() => navigate("right")}
            className={`text-2xl font-bold ${
              tabValue === TabsData[TabsData.length - 1]
                ? "text-gray-400"
                : "text-gray-600"
            } flex items-center justify-center rounded-full bg-white`}
            disabled={tabValue === TabsData[TabsData.length - 1]}
            style={{
              padding: "10px",
              minWidth: "40px",
            }}
          >
            <ChevronRight
              size={24}
              color={
                tabValue === TabsData[TabsData.length - 1] ? "gray" : "black"
              }
            />
          </button>
        </div>
        {TabsData.map((tab) => (
          <Tabs.Content className="px-6 py-4" value={tab.title} key={tab.title}>
            <h2 className="mb-2 text-xl font-bold text-gray-700">
              {tab.title}
            </h2>
            <p className="text-lg italic text-gray-500">{tab.content}</p>
            <Buttons
              handleClickTryIt={() => alert(`Trying it for ${tab.title}`)}
              handleClickLearnMore={() =>
                alert(`Learning more about ${tab.title}`)
              }
            />
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  );
};

export default Tutorial;
