"use strict"

const axios = require("axios")
const https = require("https")
const qs = require("querystring")

module.exports = ({ hostname, ssl = true }) => {

  const protocol = ssl ? "https" : "http"

  const buildPaginationQuery = (limit = null, offset = 0, original = {}) => {
    
    if (typeof limit === "number" && typeof offset === "number") {
      return { ...original, limit, offset }
    } else {
      return { ...original }
    }
  }

  const buildExpandQuery = (expand = [], original = {}) => {
    if (expand.length > 0) {
      return { ...original, expand: expand.join(",") }
    } else {
      return { ...original }
    }
  }

  const uriWithQuery = (uri, query = {}) => {
    const { limit, offset, expand = [] } = query
    
    const q = buildExpandQuery(
      expand,
      buildPaginationQuery(limit, offset, {})
    )
    const uriWithQParams = [ uri, qs.stringify(q) ].join("?")
    console.log(uriWithQParams)

    return uriWithQParams
  }
  
  const baseUrl = [ protocol, "://", hostname ].join("")
  const restPrefix = "rest"

  const httpsAgent = new https.Agent({  
    rejectUnauthorized: false
  })

  const buildUri = (...suffixes) => {
    return [ baseUrl, restPrefix, ...suffixes ].join("/") 
  }

  const formUrlencodedHeader = {
    'Content-Type': "application/x-www-form-urlencoded"
  }
 
  const buildSessionCookie = sessionId =>  [ "JSESSIONID", sessionId ].join("=")

  const buildAuthenticatedOptions = sessionId => ({ 
    httpsAgent,
    headers: { 
      cookie: buildSessionCookie(sessionId)
    } 
  })

  const extractResponseData = res => res.data

  return {



    test()  {
      const uri = buildUri("test")

      return axios.get(uri, { httpsAgent })
                   .then(() => true)
                   .catch(err => false)
    },

    status(sessionId) {
      const uri = buildUri("status")
      const opts =  buildAuthenticatedOptions(sessionId)

      return axios.get(uri, opts).then(extractResponseData)
    },

    logout(sessionId) {
      const uri = buildUri("logout")
      const opts =  buildAuthenticatedOptions(sessionId)

      return axios.post(uri, {}, opts).then(res => true)
    },

    login(email, password) {
      const uri = buildUri("login")
      const data = qs.stringify({ email, password })
      const opts =  { 
        httpsAgent, 
        headers: { ...formUrlencodedHeader } 
      }

      return axios.post(uri, data, opts).then(res => {
        const { headers } =  res
        const { ["set-cookie"]: setCookie } = headers
        const [ session ] =  setCookie.find(entry => entry.match(/SESSIONID/) )
                                      .split(";")

        const [ , sessionId ] = session.split("=")

        return { sessionId }
      })
    },

    /**
     * Entities 
     * */

    listCommunities(query = {}, sessionId) { 
      const uri = uriWithQuery(buildUri("communities"), query)
      const opts =  buildAuthenticatedOptions(sessionId)

      return axios.get(uri, opts).then(extractResponseData)
    },

    listTopCommunities(query = {}, sessionId) {

      const uri = uriWithQuery(buildUri("communities/top-communities"), query)

      const opts =  buildAuthenticatedOptions(sessionId)

      return axios.get(uri, opts).then(extractResponseData)
    },

    listCollectionsOfCommunity(query = {}, sessionId, communityId) {
      const uri = uriWithQuery(buildUri("communities", communityId, "collections"), query)
      const opts =  buildAuthenticatedOptions(sessionId)

      return axios.get(uri, opts).then(extractResponseData)
    },

    listItemsOfCollection(query = {}, sessionId, collectionId) {

      const uri = uriWithQuery(buildUri("collections", collectionId, "items"), query)
      const opts =  buildAuthenticatedOptions(sessionId)

      return axios.get(uri, opts).then(extractResponseData)
    },
    
    /**
     * Items
     */
    updateItem(id, sessionId, payload) {
      const uri = buildUri("items", id)
      const opts =  buildAuthenticatedOptions(sessionId)
      return axios.put(uri, payload, opts).then(extractResponseData)
    },

    updateItemMetadata(id, sessionId, payload) {
      const uri = buildUri("items", id, "metadata")
      const opts =  buildAuthenticatedOptions(sessionId)
      return axios.put(uri, [ payload ] , opts).then(extractResponseData).catch(err => {
        debugger
        console.error(err)
        throw err
      })
    }

  }
}