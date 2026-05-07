var sampleQueries = {
	"example.1" :
{
  "distinct": true,
  "variables": [
    "?this",
    "?Museum_1",
    "?location"
  ],
  "defaultLang": "fr",
  "order": null,
  "branches": [
    {
      "line": {
        "s": "?this",
        "p": "http://ontologies.sparna.fr/sparnatural-demo-dbpedia#displayedAt",
        "o": "?Museum_1",
        "sType": "http://ontologies.sparna.fr/sparnatural-demo-dbpedia#Artwork",
        "oType": "http://ontologies.sparna.fr/sparnatural-demo-dbpedia#Museum",
        "values": []
      },
      "children": []
    },
    {
      "line": {
        "s": "?this",
        "p": "https://bdcmining.ouest-france.fr#isLocated",
        "o": "?location",
        "sType": "https://bdcmining.ouest-france.fr#Experte",
        "oType": "https://bdcmining.ouest-france.fr#Text",
        "values": ["rennes"]
      },
      "children": []
    }
  ]
},
	"example.2" :
{
  "distinct": true,
  "variables": [
    "?Date_3",
    "?Date_4",
    "?this"
  ],
  "defaultLang": "fr",
  "order": null,
  "branches": [
    {
      "line": {
        "s": "?this",
        "p": "http://ontologies.sparna.fr/sparnatural-demo-dbpedia#movement",
        "o": "?Movement_1",
        "sType": "http://ontologies.sparna.fr/sparnatural-demo-dbpedia#Person",
        "oType": "http://ontologies.sparna.fr/sparnatural-demo-dbpedia#Movement",
        "values": [
          {
            "label": "Impressionnisme (88)",
            "uri": "http://fr.dbpedia.org/resource/Impressionnisme"
          }
        ]
      },
      "children": []
    },
    {
      "line": {
        "s": "?this",
        "p": "http://ontologies.sparna.fr/sparnatural-demo-dbpedia#birthDate",
        "o": "?Date_3",
        "sType": "http://ontologies.sparna.fr/sparnatural-demo-dbpedia#Person",
        "oType": "http://ontologies.sparna.fr/sparnatural-demo-dbpedia#Date",
        "values": []
      },
      "children": []
    },
    {
      "line": {
        "s": "?this",
        "p": "http://ontologies.sparna.fr/sparnatural-demo-dbpedia#deathYear",
        "o": "?Date_4",
        "sType": "http://ontologies.sparna.fr/sparnatural-demo-dbpedia#Person",
        "oType": "http://ontologies.sparna.fr/sparnatural-demo-dbpedia#Date",
        "values": []
      },
      "children": [],
      "optional": true
    }
  ]
}
};