const statusSchema  = {
  okay: "boolean",
  authenticated: "boolean",
  email: "string",
  fullname: "string",
  token: "string",
}

const communitySchema = {
  id: "number",
  name: "string",
  handle: "string",
  type: "string",
  link: "string",
  expand: [ 
    "parentCommunity",
    "collections",
    "subCommunities",
    "logo",
    "all"
  ],
  logo: null,
  parentCommunity: null,
  copyrightText: "",
  introductoryText: "",
  shortDescription: "Collection contains materials pertaining to the Able Family",
  sidebarText:"",
  countItems:3,
  subcommunities:[],
  collections:[]
}



const expantPath = (path, params = {}) =>
  Object.keys(params).reduce((prev, c) => prev.replace(`{${c}}`, params[c]),  path)

const extractPathParameters = path => 
  (path.match(/{\w+}/g) || []).map(pattern => pattern.replace(/^{|}$/g,""))



const defaults = { authenticated: true, method: "GET", pagination: false, implemented: true  }
// by verb
const postDefaults = { ...defaults, method: "POST" }
const putDefaults = { ...defaults, method: "PUT" }
const deleteDefaults = { ...defaults, method: "DELETE" }

// by actions
const listDefaults = { pagination: true }

const mapMethods = {

  /**
   * Communities
   */
  listCommunities:                { ...defaults, ...listDefaults, path: "/communities" },
  listTopCommunities:             { ...defaults, ...listDefaults,  path: "/communities/top-communities" },
  listSubCommunitiesOfCommunity:  { ...defaults, ...listDefaults, path: "/communities/{communityId}/communities"},
  listCollectionsOfCommunity:     { ...defaults, ...listDefaults, path: "/communities/{communityId}/collections"},
  retreiveCommunity:              { ...defaults, path: "/communities/{communityId}" },

  createCommunity:                { ...postDefaults, path: "/communities" },
  createSubCommunityOnCommunity:  { ...postDefaults, path: "/communities/{communityId}/communities" },
  createCollectionOnCommunity:    { ...postDefaults, path: "/communities/{communityId}/collections" },

  updateCommunity:                { ...putDefaults, path: "/communities/{communityId}" },

  removeCommunity:                { ...deleteDefaults, path: "/communities" },
  removeCommunityOfCommunity:     { ...deleteDefaults, path: "/communities/{communityId}/communities/{childCommunityId}" },
  removeCollectionOfCommunity:    { ...deleteDefaults, path: "/communities/{communityId}/collections/{collectionId}"},


  /**
   * Collections
   */
  listCollections:                { ...defaults, ...listDefaults, path: "/collections" },
  listCollectionItems:            { ...defaults, ...listDefaults, path: "/collections/{collectionId}/items" },

  retreiveCollection:             { ...defaults, path: "/collections/{collectionId}" },

  createItemOfCollection:         { ...postDefaults, path: "/collections/{collectionId}/items" },
  findCollectionByName:           { ...postDefaults, ...listDefaults, path: "/collections/find-collection", implemented: false },
  
  updateCollection:               { ...putDefaults, path: "/collections/{collectionId}" },

  removeCollection:               { ...deleteDefaults, path: "/collections/{collectionId}" },
  removeItemOfCollection:         { ...deleteDefaults, path: "/collections/{collectionId}/items/{itemId}" },


  /**
   * Items
   */
}

Object.keys(mapMethods).forEach(methodName => {
  const { method, path, pagination, authenticated, implemented} = mapMethods[methodName]
  console.log("\n-------------------")
  // console.log("hasImplemented: ", implemented)

  
  console.log(methodName)
  console.log(method, path)
  console.log("path paremeters:", extractPathParameters(path))

  console.log({ pagination, authenticated })

})


