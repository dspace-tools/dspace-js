"use strict"

const axios = require("axios")
const https = require("https")
const qs = require("querystring")
const v6Schema = require("./schemas")



const httpsAgent = new https.Agent({  
  rejectUnauthorized: false
})

const expantPath = (path, params = {}) =>
  Object.keys(params).reduce((prev, c) => prev.replace(`{${c}}`, params[c]),  path)

const extractPathParameters = path => 
  (path.match(/{\w+}/g) || []).map(pattern => pattern.replace(/^{|}$/g,""))

const buildSessionCookie = sessionId =>  [ "JSESSIONID", sessionId ].join("=")

const buildAuthenticatedOptions = sessionId => ({ 
  httpsAgent,
  headers: { 
    cookie: buildSessionCookie(sessionId)
  } 
})

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

const extractResponseData = res => res.data


const dataForContentType = (type, data) => {
  if (type === "x-www-form-urlencoded") {
    return qs.stringify(data)
  } else {
    return data
  }
}

module.exports = ({ hostname, ssl = true }) => {

  const protocol = ssl ? "https" : "http"

  const baseUrl = [ protocol, "://", hostname ].join("")
  const restPrefix = "rest"


  const inputFormatsToContentType = {
    "x-www-form-urlencoded": "application/x-www-form-urlencoded",
    "json":  "appliction/json" 
  }
 
  const buildUri = (...suffixes) =>
    [ 
      protocol, 
      "://" , 
      ...[ hostname, restPrefix, ...suffixes ].join("/").replace(/\/+/g, "/") 
    ].join("")

  const client = {}

  Object.keys(v6Schema).forEach(methodName => {
    
    const { method, path, transform, inputFormat } = v6Schema[methodName]

    console.log("building", methodName )

    client[methodName] = (params = {}) => {

      const { sessionId } = params

      const uri = buildUri(expantPath(path, params))
      console.log(methodName,"\n", method, uri)

      const requestParams = {
        ...buildAuthenticatedOptions(sessionId),
        method,
        url: uri,
        httpsAgent,
        headers: { 
          "Content-type": inputFormatsToContentType[inputFormat] 
        },
        data: dataForContentType(inputFormat, params)
      }

      console.dir(requestParams)
      return axios(requestParams).then(res => {
      
        if (transform === "data" ) {
          return res.data
        } else if (transform === "boolean") {
          return true
        } else if (transform === "sessionCookie") {
          const { ["set-cookie"]: setCookie } = res.headers
          const [ session ] =  setCookie.find(entry => entry.match(/SESSIONID/) )
                                        .split(";")
  
          const [ , sessionId ] = session.split("=")
  
          return { sessionId }
        }
      }).catch(err => {
        
        if (transform === "boolean") {
          return false
        } else {
          throw err
        }
      })
    }
  })

  return client
}