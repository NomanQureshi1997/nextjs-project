// import { signIn, signOut, useSession } from "next-auth/react";

// export const Header = () => {
//   const { data: sessionData } = useSession();

//   return (
//     <div className="navbar bg-primary text-primary-content">
//       <div className="flex-1 pl-5 text-3xl font-bold">
//         {sessionData?.user?.name ? `Notes for ${sessionData.user.name}` : ""}
//       </div>
//       <div className="flex-none gap-2">
//         <div className="dropdown-end dropdown">
//           {sessionData?.user ? (
//             <label
//               tabIndex={0}
//               className="btn-ghost btn-circle avatar btn"
//               onClick={() => void signOut()}
//             >
//               <div className="w-10 rounded-full">
//                 <img
//                   src={sessionData?.user?.image ?? ""}
//                   alt={sessionData?.user?.name ?? ""}
//                 />
//               </div>
//             </label>
//           ) : (
//             <button
//               className="btn-ghost rounded-btn btn"
//               onClick={() => void signIn()}
//             >
//               Sign in
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

import { signIn, signOut, useSession } from "next-auth/react";

export const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex items-center justify-between bg-primary text-white px-5 py-3">
      <div className="text-3xl font-bold">
        {sessionData?.user?.name ? `Notes for ${sessionData.user.name}` : ""}
      </div>
      <div>
        {sessionData?.user ? (
          <button
            className="flex items-center justify-center p-2 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20"
            onClick={() => void signOut()}
          >
            <img
              className="w-10 h-10 object-cover rounded-full"
              src={sessionData?.user?.image ?? ""}
              alt={sessionData?.user?.name ?? ""}
            />
          </button>
        ) : (
          <button
            className="py-2 px-4 rounded-full border border-white border-opacity-20 hover:border-opacity-40 text-white"
            onClick={() => void signIn()}
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  );
};
