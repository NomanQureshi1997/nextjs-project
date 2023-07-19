// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import useScroll from "@/src/lib/hooks/use-scroll";
// import { useSignInModal } from "./sign-in-modal";
// import UserDropdown from "./user-dropdown";
// import { useSession } from "next-auth/react";
// import logo from "@/public/mindfulQ.svg";

// export default function NavBar() {
//   const { SignInModal, setShowSignInModal } = useSignInModal();
//   const scrolled = useScroll(50);
//   const { data: session } = useSession();

//   return (
//     <>
//       <SignInModal />
//       <div
//         className={`fixed top-0 w-full ${
//           scrolled
//             ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
//             : "bg-white/0"
//         } z-30 transition-all`}
//       >
//         <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
//           <Link href="/" className="flex items-center font-display text-2xl">
//             <Image
//               src={logo}
//               alt="MindfulQ Logo"
//               width="120"
//               height="120"
//               // className="mr-2 rounded-sm"
//             ></Image>
//             {/* <p>MindfulQ</p> */}
//           </Link>
//           <div>
//             {session ? (
//               <UserDropdown session={session} />
//             ) : (
//               <button
//                 className="flex h-8 w-20 items-center justify-center rounded-md border border-black bg-black text-sm font-medium text-white transition-all hover:bg-white hover:text-black focus:outline-none"
//                 onClick={() => setShowSignInModal(true)}
//               >
//                 Sign In
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import Image from "next/image";
import Link from "next/link";
import useScroll from "@/src/lib/hooks/use-scroll";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";
import { useSession } from "next-auth/react";
import logo from "@/public/mindfulQ.svg";

export default function NavBar() {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50);
  const { data: session } = useSession();

  return (
    <>
      <SignInModal />
      <div
        className={`fixed top-0 left-0 w-full ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <div className="absolute left-10 ml-5 flex items-center font-display text-2xl h-20">
            <Link href="/" className="flex items-center font-display text-2xl">
             
                <Image
                  src={logo}
                  alt="MindfulQ Logo"
                  width="40"
                  // className="mr-2 rounded-sm"
                ></Image>
             
            </Link>
            {/* <p>MindfulQ</p> */}
          </div>
          <div className="absolute right-10 mr-5">
            {session ? (
              <UserDropdown session={session} />
            ) : (
              <button
                className="flex h-8 w-20 items-center justify-center rounded-md border border-black bg-black text-sm font-medium text-white transition-all hover:bg-white hover:text-black focus:outline-none"
                onClick={() => setShowSignInModal(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
