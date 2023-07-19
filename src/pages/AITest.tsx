// pages/chat.tsx

import { useChat } from 'ai/react';
import { use, useCallback, useEffect, useState } from 'react';

export const config = {
  runtime: 'edge'
}

export default function AITest() {
   const { messages, input, handleInputChange, append, setInput, stop } = useChat({
    api: '/api/chat'
  })

    const handleSubmitAI = useCallback( //TODO learn useCallback
    (inputString: string) => {
      if (!inputString) return
      append({
        content: inputString,
        role: 'user',
        createdAt: new Date()
      })
      setInput('')
    },
    [append]
  )




//  useEffect(() => {
//     handleSubmitAI('write an essay on love')
//   }, [])


useEffect(() => {
  console.log('messages', messages)
  // send an initial message to the AI when the component mounts
  // check if the messages array is empty
  if (messages.length === 0 && input === '') {
    append({
      content: 'write an essay on love!',
      role: 'user',
      createdAt: new Date()
    })

  }
}, [])




  return (
    <div 
      className="flex flex-col items-center justify-center pt-10"
      style={{height: "100vh"}}
    >
      <ul>
        {messages.map((m, index) => (
          <li key={index}>
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content}
          </li>
        ))}
      </ul>
      <form onSubmit={(e) => {
        e.preventDefault()
        handleSubmitAI(input)
      }}>
        <label>
          Say something...
          <input value={input} onChange={handleInputChange} />
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  )
}


// import { useCallback, useEffect, useState } from 'react';
// import { useMutation, useQuery, useQueryClient } from 'react-query';
// import axios from 'axios';

// export const config = {
//   runtime: 'edge'
// }

// export default function AITest() {
//   const queryClient = useQueryClient();
//   const [input, setInput] = useState('');
  
//   const fetchMessages = async () => {
//     const { data } = await axios.get('/api/chat');
//     return data;
//   };

//   const sendMessage = useMutation(
//     (message:any) => axios.post('/api/chat', message),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries('messages');
//       },
//     },
//   );

//   const { data: messages, refetch } = useQuery('messages', fetchMessages, {
//     initialData: [],
//     refetchOnWindowFocus: false,
//   });

//   const handleSubmitAI = useCallback(
//     (inputString: string) => {
//       if (!inputString) return;
//       sendMessage.mutate({
//         content: inputString,
//         role: 'user',
//         createdAt: new Date(),
//       });
//       setInput('');
//     },
//     [sendMessage],
//   );

//   useEffect(() => {
//     handleSubmitAI('write an essay on love');
//   }, []);

//   return (
//     <div 
//       className="flex flex-col items-center justify-center pt-10"
//       style={{height: "100vh"}}
//     >
//       <ul>
//         {messages.map((m:any, index:any) => (
//           <li key={index}>
//             {m.role === 'user' ? 'User: ' : 'AI: '}
//             {m.content}
//           </li>
//         ))}
//       </ul>
//       <form onSubmit={(e) => {
//         e.preventDefault();
//         handleSubmitAI(input);
//       }}>
//         <label>
//           Say something...
//           <input value={input} onChange={(e) => setInput(e.target.value)} />
//         </label>
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// }
