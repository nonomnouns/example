'use client'

import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from 'lucide-react'

interface CurrentAuctionProps {
  currentAuction: {
    endTime: string;
    highestBid: {
      amount: string;
      bidTime: string;
      id: string;
      bidder: string;
    } | null;
    startTime: string;
    bidCount: number;
    firstBidTime: string | null;
    id: string;
    token: {
      name: string;
      image: string;
    };
  }
}

export default function CurrentAuction({ currentAuction }: CurrentAuctionProps) {
  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getRemainingTime = (endTime: string) => {
    const now = Math.floor(Date.now() / 1000);
    const end = parseInt(endTime);
    const remaining = end - now;

    if (remaining <= 0) return "Auction ended";

    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <Card className="w-full max-w-6xl mx-auto font-sans bg-white rounded-3xl overflow-hidden shadow-lg">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="secondary">{currentAuction.token.name}</Badge>
          <a
            href={`https://nouns.build/dao/base/${currentAuction.id.split(':')[0]}/${currentAuction.id.split(':')[1]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            title={`View auction ${currentAuction.id}`}
          >
            <ExternalLink className="w-4 h-4 text-gray-600" />
          </a>
        </div>
        <CardTitle className="text-3xl font-semibold text-gray-900">Current Auction</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div className="w-1/3">
            <ReactMarkdown className="rounded-lg overflow-hidden">
              {`![${currentAuction.token.name}](${currentAuction.token.image})`}
            </ReactMarkdown>
          </div>
          <div className="w-2/3 pl-8 grid grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-2xl">
              <p className="text-lg font-medium text-black mb-2">Highest Bid</p>
              <p className="text-3xl font-semibold text-black">
                {currentAuction.highestBid ? `${parseFloat(currentAuction.highestBid.amount) / 1e18} ETH` : 'No bids yet'}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl">
              <p className="text-lg font-medium text-black mb-2">Bid Count</p>
              <p className="text-3xl font-semibold text-black">{currentAuction.bidCount}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl">
              <p className="text-lg font-medium text-black mb-2">Start Time</p>
              <p className="text-xl text-gray-900">{formatDate(currentAuction.startTime)}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl">
              <p className="text-lg font-medium text-black mb-2">End Time</p>
              <p className="text-xl text-gray-900">{formatDate(currentAuction.endTime)}</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl text-center">
          <p className="text-lg font-medium text-blue-800 mb-2">Time Remaining</p>
          <p className="text-3xl font-semibold text-blue-600">{getRemainingTime(currentAuction.endTime)}</p>
        </div>
      </CardContent>
    </Card>
  )
}