import React, { component } from 'react'
import client from "./client"
import { ApolloProvider } from 'react-apollo'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
// function App extends Component {

const ME = gql`
  query me {
    user(login: "iteachonudemy"){
      name
      avatarUrl
    }
  }
`

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          Hello

          <Query query={ME}>
            {
              ({ loading, error, data}) => {
                if (loading) return 'Loading...'
                if (error) return `Error! ${error.message}`

                return <div>{data.user.name}</div>
              }
            }
          </Query>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
