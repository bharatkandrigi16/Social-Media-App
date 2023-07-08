import * as ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App';

const httpLink = new HttpLink({
  uri: 'http://localhost:8000'
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(`[GraphQL Error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }

  if (networkError) {
    console.log(`[Network Error]: ${networkError}`);
  }
});

const authLink = setContext((_, {headers}) => {
   const token = localStorage.getItem('jwt');
   return {
       headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
       },
   };
});

const client = new ApolloClient({
  link:  httpLink.concat(authLink),
  cache: new InMemoryCache(),
  connectToDevTools: true
});
const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render( <ApolloProviderWrapper /> );
root.render(
<ApolloProvider client={client}>
  <ErrorBoundary fallback={<div>Something went wrong</div>}>
       <App />
  </ErrorBoundary>
</ApolloProvider>, 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
