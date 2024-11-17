'use client'

import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExternalLink } from 'lucide-react'

interface ProposalInfoProps {
  proposal: {
    proposalNumber: number;
    title: string;
    voteEnd: string;
    voteStart: string;
    timeCreated: string;
    forVotes: number;
    proposer: string;
    againstVotes: number;
    abstainVotes: number;
    description: string;
  }
}

export default function ProposalInfo({ proposal }: ProposalInfoProps) {
  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto font-sans bg-white rounded-3xl overflow-hidden shadow-lg">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="secondary">Proposal #{proposal.proposalNumber}</Badge>
          <span className="text-sm text-muted-foreground">Created: {formatDate(proposal.timeCreated)}</span>
        </div>
        <CardTitle className="text-2xl font-semibold text-gray-900">{proposal.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-sm font-medium text-black mb-1">Proposer</p>
            <a
              href={`https://blockscan.com/address/${proposal.proposer}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 truncate flex items-center"
            >
              {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-sm font-medium text-black mb-1">Voting Period</p>
            <div className="flex justify-between text-xs text-gray-900">
              <span>Start: {formatDate(proposal.voteStart)}</span>
              <span>End: {formatDate(proposal.voteEnd)}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-2xl text-center">
            <p className="text-sm font-medium text-green-800">For</p>
            <p className="text-2xl font-semibold text-green-600">{proposal.forVotes}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-2xl text-center">
            <p className="text-sm font-medium text-red-800">Against</p>
            <p className="text-2xl font-semibold text-red-600">{proposal.againstVotes}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl text-center">
            <p className="text-sm font-medium text-blue-800">Abstain</p>
            <p className="text-2xl font-semibold text-blue-600">{proposal.abstainVotes}</p>
          </div>
        </div>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          <ReactMarkdown className="prose prose-sm max-w-none">
            {proposal.description}
          </ReactMarkdown>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}