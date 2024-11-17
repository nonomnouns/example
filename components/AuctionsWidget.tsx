'use client'

import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from 'lucide-react'

interface AuctionsWidgetProps {
  auction: {
    endTime: string;
    winningBid: {
      amount: string;
      bidder: string;
    };
    id: string;
    startTime: string;
    token: {
      image: string;
      name: string;
    };
  }
}

export default function AuctionsWidget({ auction }: AuctionsWidgetProps) {
  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatEth = (wei: string) => {
    return parseFloat(wei) / 1e18;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto font-sans bg-white rounded-3xl overflow-hidden shadow-lg">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="secondary">{auction.token.name}</Badge>
          <a
            href={`https://nouns.build/dao/base/${auction.id.split(':')[0]}/${auction.id.split(':')[1]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            title={`View auction ${auction.id}`}
          >
            <ExternalLink className="w-4 h-4 text-gray-600" />
          </a>
        </div>
        <CardTitle className="text-2xl font-semibold text-gray-900">Auction</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="w-1/2">
            <ReactMarkdown className="rounded-lg overflow-hidden">
              {`![${auction.token.name}](${auction.token.image})`}
            </ReactMarkdown>
          </div>
          <div className="w-1/2 pl-6">
            <div className="bg-gray-50 p-4 rounded-2xl mb-4">
              <p className="text-sm font-medium text-black mb-1">Winning Bid</p>
              <p className="text-2xl font-semibold text-black">{formatEth(auction.winningBid.amount)} ETH</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-sm font-medium text-black mb-1">Winning Bidder</p>
              <a
                href={`https://blockscan.com/address/${auction.winningBid.bidder}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 truncate flex items-center"
              >
                {auction.winningBid.bidder.slice(0, 6)}...{auction.winningBid.bidder.slice(-4)}
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-sm font-medium text-black mb-1">Start Time</p>
            <p className="text-sm text-gray-900">{formatDate(auction.startTime)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-sm font-medium text-black mb-1">End Time</p>
            <p className="text-sm text-gray-900">{formatDate(auction.endTime)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}