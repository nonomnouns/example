import { streamText } from 'ai';
import { mistral } from '@ai-sdk/mistral';
import { z } from 'zod';
// Import the onchainai package
import { config, dao, proposal, auctions, currentAuction } from 'onchainai';

// Configure Yellow DAO
const daoConfig = config({
  yellow: {
    name: 'Yellow',
    contractAddress: '0x220e41499cf4d93a3629a5509410cbf9e6e0b109',
    chain: 'base',
  },
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Configure the AI model and tools
  const result = await streamText({
    model: mistral('mistral-large-latest'),
    system: `You are a friendly and helpful assistant that provides information about the Yellow DAO. 
Your goal is to make the user feel welcomed and supported. Use the available tools to fetch real-time data when needed, 
especially when specific keywords or questions are mentioned. Be conversational and engaging. 
Summarize the information in a friendly way. Always translate epoch time and ether values to human-readable format. 
Answer user questions dynamically and engagingly, not always with JSON data. Provide information about the current auction, 
the DAO, proposals, and more. Use a warm and approachable tone, and ensure your responses are informative and easy to understand. 
Feel free to add context or additional details that might be helpful to the user. Your mission is to make the interaction enjoyable 
and informative, leaving the user with a positive impression of the Yellow DAO.`,
    messages,
    
    tools: {
      // Define the tools that the AI can use
      getDaoInfo: {
        description: 'Get current stats and information about Yellow DAO',
        parameters: z.object({}),
        execute: async () => await dao('yellow').getDAO()
      },
      getCurrentAuction: {
        description: 'Get information about the current ongoing auction',
        parameters: z.object({}),
        execute: async () => await currentAuction('yellow')
      },
      getAuction: {
        description: 'Get details about a specific auction by number',
        parameters: z.object({
          tokenId: z.number().describe('The token ID of the auction')
        }),
        execute: async ({ tokenId }) => {
          const auctionId = `${daoConfig.yellow.contractAddress}:${tokenId}`;
          return await auctions('yellow').getAuction(auctionId);
        }
      },
      getProposal: {
        description: 'Get details of a specific proposal by number',
        parameters: z.object({
          proposalNumber: z.number().describe('The proposal number to fetch')
        }),
        execute: async ({ proposalNumber }) => {
          return await proposal('yellow').getProposal(proposalNumber);
        }
      }
    },
    maxSteps: 5,
    temperature: 0.2,
  });

  return result.toDataStreamResponse();
}