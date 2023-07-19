import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { type RouterOutputs } from "~/utils/api";

type Note = RouterOutputs["note"]["getAll"][0];

export const NoteCard = ({
  note,
  onDelete,
}: {
  note: Note;
  onDelete: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="mt-5 border border-gray-200 bg-white shadow-xl rounded-lg">
      <div className="m-0 p-3">
        <div
          className="cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="text-xl font-bold">{note.title}</div>
        </div>
        {isExpanded && (
          <div>
            <article className="prose lg:prose-xl">
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </article>
          </div>
        )}
        <div className="mx-2 flex justify-end">
          <button className="text-white bg-yellow-400 hover:bg-yellow-500 px-5 py-1 rounded" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
