import { io, Socket } from "socket.io-client";

class SocketHelper {
  private socket: Socket | null = null;

  connect(url: string) {
    this.socket = io(url);
    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  emit(event: string, ...args: any[]) {
    if (this.socket) {
      this.socket.emit(event, ...args);
    }
  }
}

const socketHelper = new SocketHelper();
export default socketHelper;
