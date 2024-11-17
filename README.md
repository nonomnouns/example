# Quick Guide to Creating a DAO Agent with OnchainAI and AI SDK

> Note: For comprehensive AI SDK documentation, visit https://sdk.vercel.ai/docs/introduction

## 1. Install Dependencies
```bash
npm install onchainai ai @ai-sdk/mistral zod
```

## 2. Set Up Your DAO
```typescript
// app/api/chat/route.ts
import { config } from 'onchainai';

const daoConfig = config({
  yellow: {
    name: 'Yellow',
    contractAddress: '0x220e41499cf4d93a3629a5509410cbf9e6e0b109',
    chain: 'base',
  },
});
```

## 3. Create DAO Tools
```typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { mistral } from '@ai-sdk/mistral';
import { dao, proposal, auctions, currentAuction, config } from 'onchainai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages } = await req.json();

  return await streamText({
    model: mistral('mistral-large-latest'),
    messages,
    tools: {
      // DAO info tool
      getDaoInfo: {
        description: 'Get DAO info',
        parameters: z.object({}),
        execute: async () => await dao('yellow').getDAO()
      },
      
      // Current auction tool
      getCurrentAuction: {
        description: 'Get current auction',
        parameters: z.object({}),
        execute: async () => await currentAuction('yellow')
      },
      
      // Proposal tool
      getProposal: {
        description: 'Get proposal',
        parameters: z.object({
          proposalNumber: z.number()
        }),
        execute: async ({ proposalNumber }) => {
          return await proposal('yellow').getProposal(proposalNumber)
        }
      }
    }
  });
}
```

## 4. Create Chat Interface
```typescript
// app/page.tsx
'use client'
import { useChat } from 'ai/react'

export default function Chat() {
  const { messages, input, handleSubmit, handleInputChange } = useChat()

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.content}
          {m.toolInvocations?.map(tool => (
            <div key={tool.toolCallId}>
              {JSON.stringify(tool.result)}
            </div>
          ))}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button>Send</button>
      </form>
    </div>
  )
}
```

## 5. Create UI Component (Optional)
Example of a DAO information component using shadcn/ui:

```typescript
// components/DAOInfo.tsx
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
  const ipfsGateway = 'https://ipfs.io/ipfs/'
  const imageUrl = dao.contractImage.replace('ipfs://', ipfsGateway)
  const totalAuctionSalesETH = parseFloat(dao.totalAuctionSales) / 1e18

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-lg">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="w-16 h-16 mr-4 overflow-hidden rounded-full">
          <ReactMarkdown>
            {`![${dao.name} DAO logo](${imageUrl})`}
          </ReactMarkdown>
        </div>
        <div>
          <CardTitle>{dao.name} DAO</CardTitle>
          <Badge variant="secondary">{dao.symbol}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* DAO Stats Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-2xl">
            <p className="text-sm text-gray-500">Total Supply</p>
            <p className="text-2xl font-semibold">{dao.totalSupply}</p>
          </div>
          {/* Add more stats... */}
        </div>
      </CardContent>
    </Card>
  )
}
```

## 6. Render Components for Tool Responses
```typescript
// Import components
import DAOInfo from '@/components/DAOInfo';
import { ToolInvocation } from 'ai';

// Render tool responses
const renderToolResponse = (toolInvocation: ToolInvocation) => {
  if ('result' in toolInvocation) {
    switch (toolInvocation.toolName) {
      case 'getDaoInfo':
        return <DAOInfo dao={toolInvocation.result} />;
      default:
        return JSON.stringify(toolInvocation.result);
    }
  }
  return <div>Loading...</div>;
};
```

## Available OnchainAI Functions
- `dao(id).getDAO()` - Get DAO info
- `currentAuction(id)` - Get current auction
- `proposal(id).getProposal(number)` - Get proposal details
- `auctions(id).getAuction(id)` - Get specific auction details

That's all - you now have a working DAO agent that can fetch on-chain data and display it with custom UI components!
