jest.mock('../src/contexts/WebSocketContext', () => ({
    WebSocketProvider: ({ children }) => <div>{children}</div>,
    useWebSocket: jest.fn(() => ({
      sendMessage: jest.fn()
    }))
  }));
  