jest.mock('../src/handlers/WebSocketContext', () => ({
    WebSocketProvider: ({ children }) => <div>{children}</div>,
    useWebSocket: jest.fn(() => ({
      sendMessage: jest.fn()
    }))
  }));
  