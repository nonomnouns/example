import React from 'react';
import { Button } from "@/components/ui/button"

interface QuestionTemplatesProps {
  onQuestionClick: (question: string) => void;
}

const questions = [
  "What is proposal 1 in Yellow ?",
  "How much is the current bid auction now?",
  "How long until the auction ends?",
  "Who won auction 350?"
];

export default function QuestionTemplates({ onQuestionClick }: QuestionTemplatesProps) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4">
      <h3 className="text-sm font-semibold mb-2">Quick Questions:</h3>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onQuestionClick(question)}
            className="text-xs py-1 px-2"
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
}