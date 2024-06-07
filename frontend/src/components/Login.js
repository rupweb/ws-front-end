import React from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import awsConfig from '../aws-exports';
import '@aws-amplify/ui-react/styles.css';
import '../css/Login.css';

Amplify.configure(awsConfig);

const Login = () => {
  return (
    <div className="login-container">
      <Authenticator>
        {({ signOut, user }) => (
          <main>
            <h1>Hello {user.username}</h1>
            <button onClick={signOut}>Sign out</button>
          </main>
        )}
      </Authenticator>
    </div>
  );
};

export default Login;

