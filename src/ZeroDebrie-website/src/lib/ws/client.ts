export class WebSocketClient {
  private url: string;
  private ws: WebSocket | null = null;
  
  constructor(url: string) {
    this.url = url;
  }
  
  connect() {
    this.ws = new WebSocket(this.url);
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
