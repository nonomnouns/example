'use client'

import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface DAOInfoProps {
  dao: {
    projectURI: string;
    name: string;
    symbol: string;
    totalAuctionSales: string;
    totalSupply: number;
    proposalCount: number;
    ownerCount: number;
    description: string;
    contractImage: string;
  }
}

export default function DAOInfo({ dao }: DAOInfoProps) {
  // Convert IPFS URI to HTTP URL
  const ipfsGateway = 'https://ipfs.io/ipfs/'
  const imageUrl = dao.contractImage.replace('ipfs://', ipfsGateway)
  
  // Convert wei to ETH
  const totalAuctionSalesETH = parseFloat(dao.totalAuctionSales) / 1e18

  return (
    <Card className="w-full max-w-3xl mx-auto font-sans bg-white rounded-3xl overflow-hidden shadow-lg">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="w-16 h-16 mr-4 overflow-hidden rounded-full">
          <ReactMarkdown className="w-full h-full">
            {`![${dao.name} DAO logo](${imageUrl})`}
          </ReactMarkdown>
        </div>
        <div>
          <CardTitle className="text-2xl font-semibold text-gray-900">{dao.name} DAO</CardTitle>
          <Badge variant="secondary" className="mt-1">{dao.symbol}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{dao.description}</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-sm font-medium text-gray-500">Total Supply</p>
            <p className="text-2xl font-semibold text-gray-900">{dao.totalSupply}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-sm font-medium text-gray-500">Owner Count</p>
            <p className="text-2xl font-semibold text-gray-900">{dao.ownerCount}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-sm font-medium text-gray-500">Proposal Count</p>
            <p className="text-2xl font-semibold text-gray-900">{dao.proposalCount}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-sm font-medium text-gray-500">Total Auction Sales</p>
            <p className="text-2xl font-semibold text-gray-900">{totalAuctionSalesETH.toFixed(2)} ETH</p>
          </div>
        </div>
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full" asChild>
          <a href={dao.projectURI} target="_blank" rel="noopener noreferrer">Visit Project Website</a>
        </Button>
      </CardContent>
    </Card>
  )
}