
const { email, password, hostname, ssl = true } = require("./conf.json")


const client = require("./lib/v6/")({ hostname, ssl });


(async () => {
  try {

    const hasRestApi = await client.healthCheck()

    // console.log("hasRestApi:", hasRestApi)

    const { sessionId }  = await client.login({ email, password })

    const communities = await client.listTopCommunities({ limit: 10, offset: 0}, sessionId)
    console.log("communities:", communities)

    for(const community of communities) {
      
      const collections = await client.listCollectionsOfCommunity({}, sessionId, community.uuid)
      for(const collection of collections) {

        // console.log("collection:", collection)
      
        const items = await client.listItemsOfCollection({ expand: [ "metadata" ]}, sessionId, collection.uuid)

        for(const item of items) {
          console.log("Item name: ", item.name )
          const { uuid, metadata } = item
          const metaDataEntry = metadata.find(meta => meta.key === "dc.identifier.uri")
          console.log(metaDataEntry.value)


          if(/localhost/.test(metaDataEntry.value)) {
            const newUri = metaDataEntry.value.replace(/localhost:8080/, hostname)
            console.log("Item need update:", { 
              uuid, 
              uri: metaDataEntry.value,
              newUri 
            })
            console.log(metaDataEntry)
            const newMetadataEntry = { key: "dc.identifier.uri",  value:  newUri }
            const r =  await client.updateItemMetadata(uuid, sessionId, newMetadataEntry )
          }
        }
      }

    }

  } catch (err) {
    console.error(err.message)
  }
})()