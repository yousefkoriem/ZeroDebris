import { useEffect, useRef, useState } from 'react';

export function useWebSocket(url: string) {
  const [status, setStatus] = useState<'CONNECTING' | 'CONNECTED' | 'DISCONNECTED'>('DISCONNECTED');
  const ws = useRef<WebSocket | null>(null);
  const attemptRef = useRef(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const connect = () => {
      setStatus('CONNECTING');
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setStatus('CONNECTED');
        attemptRef.current = 0;
      };

      ws.current.onclose = () => {
        setStatus('DISCONNECTED');
        const delay = Math.min(15000, 500 * 2 ** attemptRef.current++);
        timeoutId = setTimeout(connect, delay);
      };

      ws.current.onerror = () => {
        ws.current?.close();
      };
    };

    connect();

    return () => {
      clearTimeout(timeoutId);
      if (ws.current) {
        ws.current.onclose = null;
        ws.current.close();
      }
    };
  }, [url]);

  return { status, ws: ws.current };
}
