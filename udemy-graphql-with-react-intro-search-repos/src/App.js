import React, { Component } from 'react'
import client from "./client"
import { ApolloProvider } from 'react-apollo'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { ME, SEARCH_REPOSITORIES } from './graphql'
// function App extends Component {

// const ME = gql`
//   query me {
//     user(login: "iteachonudemy"){
//       name
//       avatarUrl
//     }
//   }
// `

const VARIABLES = {
  first: 5,
  after: null,
  last: null,
  before: null,
  query: "フロントエンドエンジニア"
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = VARIABLES
  }
  render() {
    const { query, first, last, before, after } = this.state
    return (
      <ApolloProvider client={client}>
        <div className="App">
          Hello

          <Query 
            query={SEARCH_REPOSITORIES}
            variables={{ query, first, last, before, after }}
          >
            {/* <Query query={ME}> */}
            {
              ({ loading, error, data}) => {
                if (loading) return 'Loading...'
                if (error) return `Error! ${error.message}`

                // return <div>{data.user.name}</div>
                console.log({data})
                return <div></div>
              }
            }
          </Query>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
