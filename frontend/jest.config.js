export default {
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
  
    // The directory where Jest should output its coverage files
    coverageDirectory: "coverage",
  
    // An array of file extensions your modules use
    moduleFileExtensions: ["js", "jsx", "json", "node"],

    rootDir: 'tests',

    // A map from regular expressions to module names that allow to stub out resources with a single module
    moduleNameMapper: {
      '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
      '\\.(gif|ttf|eot|svg|png|jpg)$': '<rootDir>/mocks/fileMock.js',
      '^Polyglot$': '<rootDir>/../mocks/polyglot.js',
      '^WebSocketContext$': '<rootDir>/../mocks/WebSocketContext.js',
       '^MessageHeaderDecoder$': '<rootDir>/../mocks/MessageHeaderDecoder.js'
    },
  
    // The test environment that will be used for testing
    // testEnvironment: 'jest-environment-jsdom',
    testEnvironment: 'node', 

    // The glob patterns Jest uses to detect test files
    testMatch: [
      "**/tests/**/*.[jt]s?(x)",
      "**/tests/**/?(*.)+(spec|test).[tj]s?(x)"
    ],
  
    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    testPathIgnorePatterns: ["/node_modules/"],
  
    // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
    testEnvironmentOptions: {
      "url": "http://localhost"
    },
  
    // A map from regular expressions to paths to transformers
    transform: {
      "^.+\\.jsx?$": "babel-jest"
    },
  
    // Indicates whether each individual test should be reported during the run
    verbose: true,
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"]
  };