import { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "@/src/components/shared/modal";
import Image from "next/image";
import languageOptions from "@/src/lib/language-options";
import { useSearchResultsStore } from "~/store/searchResultsContext";
import { CheckIcon } from "@heroicons/react/24/solid";

type LanguageOption = { value: string; label: string } | null;

type DemoModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DemoModal = ({ showModal, setShowModal }: DemoModalProps) => {
  const [language, setLanguage] = useSearchResultsStore((state) => [
    state.language,
    state.setLanguage,
  ]);

  const handleLanguageChange = (selectedOption: LanguageOption) => {
    if (selectedOption) {
      setLanguage(selectedOption.value);
    }
  };

  const selectedLanguage = useMemo(
    () => languageOptions.find((option) => option.value === language) || null,
    [language]
  );

  // useEffect(() => {
  //   if (!showModal) setLanguage(""); // reset selection when modal closes
  // }, [showModal, setLanguage]);

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div
        className="relative w-full overflow-auto sm:overflow-hidden md:max-w-3xl md:rounded-2xl md:border md:border-gray-100 md:shadow-xl"
        style={{
          fontFamily: '"Inter", sans-serif',
          height: "78vh",
        }}
      >
        <button
          className="absolute right-4 top-4 focus:outline-none"
          onClick={() => setShowModal(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="mr-2 mt-3 h-6 w-6 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="items-left flex flex-col justify-center space-y-6 bg-white px-4 py-6 text-center">
          <h3 className="ml-1 text-left font-display text-xl font-bold">
            Choose Language
          </h3>
          <div
            className="grid grid-cols-2 gap-2 md:grid-cols-4"
            style={{
              marginTop: "4px",
            }}
          >
            {languageOptions.map((languageOption) => (
              <div
                key={languageOption.value}
                onClick={() => handleLanguageChange(languageOption)}
                className={`flex cursor-pointer items-center justify-between rounded-md p-2 ${
                  selectedLanguage?.value === languageOption.value
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                <div className="flex items-center">
                  <Image
                    src={languageOption.icon}
                    alt={`${languageOption.label} icon`}
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <p>{languageOption.label}</p>
                </div>
                {selectedLanguage?.value === languageOption.value && (
                  <CheckIcon className="h-5 w-5 text-blue-500 mr-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export function useDemoModal() {
  const [showModal, setShowDemoModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageOption>(null);

  const DemoModalCallback = useCallback(() => {
    return <DemoModal showModal={showModal} setShowModal={setShowDemoModal} />;
  }, [showModal, setShowDemoModal, selectedLanguage, setSelectedLanguage]);

  return useMemo(
    () => ({ setShowDemoModal, DemoModal: DemoModalCallback }),
    [setShowDemoModal, DemoModalCallback]
  );
}

// import Modal from "@/src/components/shared/modal";
// import {
//   useState,
//   Dispatch,
//   SetStateAction,
//   useCallback,
//   useMemo,
// } from "react";
// import Image from "next/image";

// const DemoModal = ({
//   showDemoModal,
//   setShowDemoModal,
// }: {
//   showDemoModal: boolean;
//   setShowDemoModal: Dispatch<SetStateAction<boolean>>;
// }) => {
//   return (
//     <Modal showModal={showDemoModal} setShowModal={setShowDemoModal}>
//       <div className="w-full overflow-hidden md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
//         <div className="flex flex-col items-center justify-center space-y-3 bg-white px-4 py-6 pt-8 text-center md:px-16">
//           <a href="https://precedent.dev">
//             <Image
//               src="/logo.png"
//               alt="Precedent Logo"
//               className="h-10 w-10 rounded-full"
//               width={20}
//               height={20}
//             />
//           </a>
//           <h3 className="font-display text-2xl font-bold">Precedent</h3>
//           <p className="text-sm text-gray-500">
//             Precedent is an opinionated collection of components, hooks, and
//             utilities for your Next.js project.
//           </p>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export function useDemoModal() {
//   const [showDemoModal, setShowDemoModal] = useState(false);

//   const DemoModalCallback = useCallback(() => {
//     return (
//       <DemoModal
//         showDemoModal={showDemoModal}
//         setShowDemoModal={setShowDemoModal}
//       />
//     );
//   }, [showDemoModal, setShowDemoModal]);

//   return useMemo(
//     () => ({ setShowDemoModal, DemoModal: DemoModalCallback }),
//     [setShowDemoModal, DemoModalCallback],
//   );
// }
