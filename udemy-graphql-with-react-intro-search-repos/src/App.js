import React, { Component } from 'react'
import client from "./client"
import { ApolloProvider } from 'react-apollo'
import gql from 'graphql-tag'
import { Mutation, Query } from 'react-apollo'
import { ME, SEARCH_REPOSITORIES, ADD_STAR, REMOVE_STAR } from './graphql'
// function App extends Component {

// const ME = gql`
//   query me {
//     user(login: "iteachonudemy"){
//       name
//       avatarUrl
//     }
//   }
// `
const StarButton = props => {
  // console.log(props.node.stargazers.totalCount)
  const node = props.node
  const totalCount = props.node.stargazers.totalCount
  // return <div>{props.node.stargazers.totalCount}</div>
  const viewerHasStarred = node.viewerHasStarred
  const starCount = totalCount === 1 ? "1 star" : `${totalCount} stars`
  // return <button>{totalCount === 1 ? "1 star" : `${totalCount} stars`}</button>
  const StarStatus = ({addOrRemoveStar}) => {
    // const StarStatus = ({addStar}) => {
    return (
      <button
      onClick={
        () => 
          addOrRemoveStar({
            // addStar({
            variables: { input: { starrableId: node.id } }
          })
        }
      >
        {starCount} | {viewerHasStarred ? 'starred' : '-'}
      </button>
    )
  }

  // return (
  //   <button>
  //     {starCount} | {viewerHasStarred ? 'starred' : '-'}
  //   </button>
  // )
  return (
    // <Mutation mutation={ADD_STAR}>
    <Mutation mutation={viewerHasStarred ? REMOVE_STAR : ADD_STAR}>
      {
        addOrRemoveStar => <StarStatus addOrRemoveStar={addOrRemoveStar} />
        // addStar => <StarStatus addStar={addStar} />
      }
    </Mutation>
  )
}

const PER_PAGE = 5 
const DEFAULT_STATE = {
  // const VARIABLES = {
  first: PER_PAGE,
  // first: 5,
  after: null,
  last: null,
  before: null,
  query: "フロントエンドエンジニア"
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = DEFAULT_STATE
    // this.state = VARIABLES

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({
      ...DEFAULT_STATE,
      // ...VARIABLES,
      query: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault()
  }

  goNext(search) {
    this.setState({ 
      first: PER_PAGE,
      after: search.pageInfo.endCursor,
      last: null,
      before: null
    })
  }
  goPrevious(search) {
    this.setState({ 
      first: null,
      after: null,
      last: PER_PAGE,
      before: search.pageInfo.startCursor
    })
  }

  render() {
    const { query, first, last, before, after } = this.state
    console.log({query})
    return (
      <ApolloProvider client={client}>
        <form>
          <input value={query} onChange={this.handleChange} />
        </form>
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

                const search = data.search
                const repositoryCount = search.repositoryCount
                const repositoryUnit = repositoryCount === 1 ? 'Repository' : 'Repositories'
                const title = `GitHub Repositories Search Results - ${repositoryCount} ${repositoryUnit}`
                // return <div>{data.user.name}</div>
                // console.log(data.search)
                // console.log({data})
              // return <div>GitHub Repositories search Results - {data.search.repositoryCount} Repositories</div>
              return (
                <React.Fragment>
                  <h2>{title}</h2>
                  <ul>
                    {
                      // console.log(search.edges)
                      search.edges.map(edge => {
                        const node = edge.node  
                        return (
                          <li key={node.id}>
                            <a href={node.url} target="_blank" rel="noopener noreferrer">{node.name}</a>
                            &nbsp;
                            <StarButton node={node}/>
                          </li>
                        )
                      })
                    }
                  </ul>
                  {
                    search.pageInfo.hasPreviousPage === true ?
                    <button
                    onClick={
                      this.goPrevious.bind(this, search)
                    }>
                      Previous
                    </button>
                    :
                    null
                  }
                  {
                    search.pageInfo.hasNextPage === true ?
                    <button
                    onClick={
                      this.goNext.bind(this, search)
                    }>
                      next
                    </button>
                    :
                    null
                  }

                </React.Fragment>
              )
                // return <div></div>
              }
            }
          </Query>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
