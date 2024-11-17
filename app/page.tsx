'use client';

import { useState } from 'react';
import { useChat, Message, } from 'ai/react';
import { ToolInvocation } from 'ai';
import ReactMarkdown from 'react-markdown';
import DAOInfo from '@/components/DAOInfo';
import ProposalInfo from '@/components/ProposalInfo';
import AuctionsWidget from '@/components/AuctionsWidget';
import CurrentAuction from '@/components/CurrentAuction';
import QuestionTemplates from '@/components/QuestionTemplates';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, append } = useChat();
  const [showTemplates, setShowTemplates] = useState(true);

  const renderToolResponse = (toolInvocation: ToolInvocation) => {
    if ('result' in toolInvocation) {
      switch (toolInvocation.toolName) {
        case 'getDaoInfo':
          return <DAOInfo dao={toolInvocation.result} />;
        case 'getCurrentAuction':
          return <CurrentAuction currentAuction={toolInvocation.result} />;
        case 'getAuction':
          return <AuctionsWidget auction={toolInvocation.result} />;
        case 'getProposal':
          return <ProposalInfo proposal={toolInvocation.result} />;
        default:
          return (
            <div className="text-gray-500">
              Tool call {`${toolInvocation.toolName}: `}
              {JSON.stringify(toolInvocation.result)}
            </div>
          );
      }
    } else {
      return (
        <div className="text-gray-500">
          Calling {toolInvocation.toolName}...
        </div>
      );
    }
  };

  const handleQuestionClick = async (question: string) => {
    setShowTemplates(false);
    await append({
      role: 'user',
      content: question,
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowTemplates(false);
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto py-24 stretch">
      {showTemplates && (
        <QuestionTemplates onQuestionClick={handleQuestionClick} />
      )}
      {messages.map((m: Message) => (
        <div key={m.id} className="whitespace-pre-wrap mb-4">
          <div className="font-bold">{m.role === 'user' ? 'User: ' : 'AI: '}</div>
          <ReactMarkdown className="prose dark:prose-invert">
            {m.content}
          </ReactMarkdown>
          {m.role === 'assistant' && m.toolInvocations && m.toolInvocations.map((toolInvocation: ToolInvocation) => (
            <div key={toolInvocation.toolCallId} className="mt-2">
              {renderToolResponse(toolInvocation)}
            </div>
          ))}
        </div>
      ))}

      <form onSubmit={handleFormSubmit} className="fixed bottom-0 w-full max-w-3xl mb-8 flex">
        <Input
          className="flex-grow mr-2"
          value={input}
          placeholder="Ask about the Purple DAO..."
          onChange={handleInputChange}
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}