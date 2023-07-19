import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

export const NoteEditor = ({
  onSave,
}: {
  onSave: (note: { title: string; content: string }) => void;
}) => {
  const [code, setCode] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const isSaveDisabled = title.trim().length === 0 || code.trim().length === 0;

  return (
    <div className="mt-5 border border-gray-200 bg-white shadow-xl rounded-lg">
      <div className="p-5">
        <h2 className="mb-4">
          <input
            type="text"
            placeholder="Note title"
            className="block w-full border border-gray-300 rounded-lg p-2 text-lg font-bold text-gray-700"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
        </h2>
        <CodeMirror
          value={code}
          width="500px"
          height="30vh"
          minWidth="100%"
          minHeight="30vh"
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
          ]}
          onChange={(value) => setCode(value)}
          className="border border-gray-300"
        />
      </div>
      <div className="flex justify-end p-5">
        <button
          onClick={() => {
            onSave({
              title,
              content: code,
            });
            setCode("");
            setTitle("");
          }}
          className={`py-2 px-4 text-white rounded ${isSaveDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={isSaveDisabled}
        >
          Save
        </button>
      </div>
    </div>
  );
};
