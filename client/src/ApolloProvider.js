import React from 'react';

import { ApolloClient, ApolloProvider, InMemoryCache, ApolloLink} from '@apollo/client';
import { createHttpLink } from '@apollo/client/link/http';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'http://localhost:8000'
});

// const authMiddleware = new ApolloLink((operation, forward) => {
//     operation.setContext(({headers ={}}) => ({
//         headers: {
//             ...headers, 
//             authorization: localStorage.getItem('jwtToken') || null,
//         }
//     }));
//     return forward(operation);
// })

const authLink = setContext((_, {headers}) => {//Add token to request and send protected API Calls
     const token = localStorage.getItem('jwtToken');
     return {
         headers: {
             Authorization: token ? `Bearer ${token}` : ''
         },
     };
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
});

class ApolloProviderWrapper extends React.Component {
        render() {
            return (
                <ApolloProvider client={client}>
                   <BrowserRouter>
                      <App />
                   </BrowserRouter>
                </ApolloProvider>
            );
        }
}

export default ApolloProviderWrapper;
