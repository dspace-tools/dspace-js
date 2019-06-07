




const defaults = { authenticated: true, method: "GET", pagination: false, implemented: true , transform: "data", inputFormat: "json" }
// by verb
const postDefaults = { ...defaults, method: "POST" }
const putDefaults = { ...defaults, method: "PUT" }
const deleteDefaults = { ...defaults, method: "DELETE" }

// by actions
const listDefaults = { pagination: true }

module.exports = {

  /**
  * session and status 
  */

  login:                          { ...postDefaults, authenticated: false, path: "/login" , inputFormat: "x-www-form-urlencoded", transform: "sessionCookie" },
  logout:                         { ...postDefaults, authenticated: true, path: "/logout" },
  /* API inconsistence */
  getCurrentUser:                 { ...defaults , path: "/status" },
  healthCheck:                    { ...defaults,  authenticated: false, path: "/test" , transform: "boolean" },


  /**
   * handle and hierarchy
   */
  retreiveObjectByHandle:          { ...defaults, path: "/handle/{prefix}/{suffix}" },
  retreiveHierarchy:               { ...defaults, path: "/hierarchy" },

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

  listItems:                      { ...defaults, ...listDefaults, path: "/items" },
  retreiveItem:                   { ...defaults, path: "/items/{itemId}" },
  retreiveItemMetadata:           { ...defaults, path: "/items/{itemId}/metadata" },
  retreiveItemBitStreams:         { ...defaults, ...listDefaults, path: "/items/{itemId}/bitstreams" },

  findItemByMetadataField:        { ...postDefaults, ...listDefaults, path: "/items/find-by-metadata-field" },
  addItemMetadata:                { ...postDefaults, path: "/items/{itemId}/metadata"  },
  addItemBitStream:               { ...postDefaults, path: "/items/{itemId}/bitstreams"  },

  updateItemMetadata:             { ...putDefaults, path: "/items/{itemId}/metadata" },

  removeItem:                     { ...deleteDefaults, path: "/items/{itemId}" },
  removeItemMetadata:             { ...deleteDefaults, path: "/items/{itemId}/metadata" },
  removeItemBitStream:            { ...deleteDefaults, path: "/items/{itemId}/bitstreams/{bitstreamId}" },


  /**
   * BitStreams
   */

  listBitStreams:                 { ...defaults, ...listDefaults, path: "/bitstreams" },
  retreiveBitStream:              { ...defaults, path: "/bitstreams/{bitstreamId}" },
  retreiveBitStreamPolicies:      { ...defaults, path: "/bitstreams/{bitstreamId}/policy" },
  retreiveBitStreamData:          { ...defaults, path: "/bitstreams/{bitstreamId}/retrieve" },

  addBitStreamPolicy:             { ...postDefaults, path: "/bitstreams/{bitstreamId}/policy"  },

  updateBitStreamData:            { ...putDefaults, path: "/bitstreams/{bitstreamId}/data" },
  updateBitStreamMetadata:        { ...putDefaults, path: "/bitstreams/{bitstreamId}" },

  removeBitStream:                { ...deleteDefaults, path: "/bitstreams/{bitstreamId}" },
  removeBitStreamPolicy:          { ...deleteDefaults, path: "/bitstreams/{bitstreamId}/policy/{policyId}" },


}

