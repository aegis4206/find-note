import algoliasearch from 'algoliasearch'

const client = algoliasearch("1EEVXFL79N","5bb4d296259f839cafbee23fd9974a3a")

const algolia =client.initIndex("findnote")

export default algolia;