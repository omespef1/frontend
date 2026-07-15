import { environment } from '../../../environments/environment';
import { MOCK_CHAT_RESPONSE } from '../mocks/mock-data';

const originalFetch = window.fetch;

export function initMockFetch() {
  if (!environment.useMockMode) return;

  console.warn('🛠️ MOCK MODE ENABLED: fetch has been overridden for streaming endpoints.');

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.toString());
    
    // Intercept only the stream endpoint
    if (url.includes('/api/v1/stream') && init?.method === 'POST') {
      
      return new Promise<Response>((resolve) => {
        const stream = new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder();
            
            // Split the mock response into words to simulate tokens
            const tokens = MOCK_CHAT_RESPONSE.split(/( )/);
            
            for (let i = 0; i < tokens.length; i++) {
              // Wait between 20ms and 80ms to simulate network latency
              await new Promise(r => setTimeout(r, 20 + Math.random() * 60));
              
              // The frontend expects chunks starting with "data: " and ending with "\n\n"
              const chunk = `data: ${tokens[i]}\n\n`;
              controller.enqueue(encoder.encode(chunk));
            }
            
            controller.close();
          }
        });

        resolve(new Response(stream, {
          status: 200,
          headers: { 'Content-Type': 'text/event-stream' }
        }));
      });
    }

    // Passthrough for all other fetch calls
    return originalFetch(input, init);
  };
}
