import React from 'react';
import { Message, Source as SourceType, Suggestion as SuggestionType } from '@prisma/client';
import Link from 'next/link';

interface MessageProps {
  message: Message;
}

const UserMessage: React.FC<MessageProps> = ({ message }) => {
  return (
    <div>
      <h4>User</h4>
      <p>{message.text}</p>
    </div>
  );
};

const AIMessage: React.FC<MessageProps> = ({ message }) => {
  return (
    <div>
      <h4>AI</h4>
      <p>{message.text}</p>
    </div>
  );
};

interface SourceProps {
  source: SourceType;
}

const Source: React.FC<SourceProps> = ({ source }) => {
  return (
    <div>
      <h5>Source</h5>
      <p>{source.title}</p>
      {/* <a href={source.url}>Read more</a> */}
       <Link href={source.url}>
        <a>Read more</a>
      </Link>
    </div>
  );
};

interface SuggestionProps {
  suggestion: SuggestionType;
}

const Suggestion: React.FC<SuggestionProps> = ({ suggestion }) => {
  return (
    <div>
      <h5>Suggestion</h5>
      <p>{suggestion.text}</p>
    </div>
  );
};

export { UserMessage, AIMessage, Source, Suggestion };
