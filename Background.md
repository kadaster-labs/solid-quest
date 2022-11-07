# SOLID Quest - Achtergrondinformatie

In dit bestand vind je links en informatie die we hebben verzameld tijdens onze SOLID Quest.

## Collected Info

- Personal Online Datastore (PODs)
  - SOLID core / general info
    - [SOLID Project](https://solidproject.org/) - the _base_ of SOLID
    - [SolidOS](https://github.com/SolidOS/solidos)
    - [PLDN](https://www.pldn.nl/wiki/PODS) - their definition of Personal Online Data Stores (PODS)
    - [SolidLabResearch | Bashlib](https://github.com/SolidLabResearch/Bashlib) - a suite of functionality to facilitate use and development for Solid, mainly focused on supporting the [Community Solid Server](https://github.com/CommunitySolidServer/CommunitySolidServer)
  - [Universidad de Oviedo](https://arquisoft.github.io/) is actively developing and teaching about Software Architectures using SOLID
    - [Decentralized Chat App built on SOLID](https://arquisoft.github.io/dechat_es6a2/documentation.html) - Winning team of the 2019 challenge
    - [2021/2022 assignment: Decentralized Delivery (DeDe)](https://arquisoft.github.io/course2122/labAssignmentDescription.html) with [winning teams](https://arquisoft.github.io/course2122.html#SolidChallenge) (with [nice diagrams](https://arquisoft.github.io/dede_en2a/) explaining architecture and usage of SOLID)
  - [Het Vlaamse Datanutsbedrijf](https://www.vlaanderen.be/digitaal-vlaanderen/het-vlaams-datanutsbedrijf) werkt concreet aan twee projecten: Diploma delen & Loongegevens delen. 
    - [Projecten Vlaamse Datanutsbedrijf](https://www.vlaanderen.be/digitaal-vlaanderen/het-vlaams-datanutsbedrijf/projecten-vlaams-datanutsbedrijf)
  - Commercial Vendors
    - [Inrupt](https://inrupt.com/) - SOLID core developer company
    - [Digita](https://www.digita.ai/) (check the URL :laughing:) providing [use.id](https://get.use.id/), a free WebID (across orgs and platforms) 🤔
- Data spaces
  - [Internation Data Spaces Association](https://internationaldataspaces.org/why/data-spaces/) 
  - [TNO on Internation Data Spaces](https://www.tno.nl/en/technology-science/technologies/international-data-spaces)
  - [iSHARE](https://ishare.eu/) - iSHARE is the European standard for and trust network of international business data sharing in a sovereign way.
  - [Gaia-X](https://gaia-x.eu/) - Gaia-X is a European project and aims to establish a data space ecosystem, whereby data is shared and made available in a trustworthy environment
- Other
  - [Rapport: Regie op Gegevens](https://www.rijksoverheid.nl/documenten/rapporten/2022/01/13/poc-gegevensinzage-burgers)

## Knowledge

### Data pods vs data spaces

We merken dat de termen data pods en data spaces vaak door elkaar worden gebruikt, terwijl er volgens ons verschillende dingen mee worden bedoeld. Voor data pods is de definitie van [PLDN](https://www.pldn.nl/wiki/PODS) vrij duidelijk:

> "Personal Online Data Stores (PODS) of Personal Online Data Storage Containers zijn beveiligde online opslagplaatsen voor persoonlijke gegevens waar apps toegang tot kunnen hebben als zij daarvoor geautoriseerd zijn."

De definitie van een data space is minder duidelijk. [Gaia-X](https://gaia-x.eu/what-is-gaia-x/core-elements/data-spaces/) heeft het bijvoorbeeld over 

> "The term ‘data space’ refers to a type of data relationship between trusted partners who adhere to the same high level standards and guidelines in relation to data storage and sharing within one or many Vertical Ecosystems." 

Onze vertaling is dat pods vooral gericht zijn op persoonlijke data kluizen; een persoonlijke online datastore. Als burger heb ik zelf controle over wat ik daar in zet, wie of welke apps ik toegang verleen en welke data ik (dus) deel met wie. De visie van het Solid Project gaat nog verder in de zin dat _alle_ data die ik online deel, in mijn pod zou moeten staan. Applicaties en platformen kunnen deze data gebruiken zolang zij toegang verleent krijgen door de burger zelf. Platformen als Facebook, Twitter e.d. zijn rijke applicaties die vooral bestaan om de functionaliteiten die zij bieden, terwijl de data in alle pods van alle gebruikers staat. (Dit is ook wat [Post Platforms Initiative](https://postplatforms.org/#concept) tracht te bereiken)

Data spaces lijken meer gericht te zijn op organisaties met als doel het stimuleren en bereiken van data delen/samenwerken en tegelijkertijd controle te houden over je data.

Binnen dit project zal de focus meer liggen op data pods.

### WebID

Een WebID duidt op meerdere 'dingen'. Het is:

1. een unieke IRI (International Resource Identifier) en URL
1. een document dat een 'resource' beschrijft; dat kan een beschrijving van de mens zijn, zijn profiel dus, maar ook een organisatie, een service (bot)
1. een service voor authenticatie en deels autorisatie (OpenID Connect / OAuth2)

### Verifiable Credentials (VCs)

Verifiable Credentials (VCs) zijn een open standaard voor digitale attributen/referenties. Op de pagina van [W3C](https://www.w3.org/TR/vc-data-model/) kan je veel informatie vinden over VCs. Hun definitie van een VC is als volgt: "A verifiable credential is a tamper-evident credential that has authorship that can be cryptographically verified." Waarbij een credential een "set of one or more claims made by an issuer" is. Vanuit een VC kan een Verifiable Presentation worden gemaakt. 

Schematische weergave
![image](https://user-images.githubusercontent.com/62643510/200321656-9847af00-7ecb-42ad-bb47-5f53c7957a03.png)

#### VCs vs IRMA

IRMA is een product (app) waarbinnen je attributen kunt laden en daar zelf controle over hebt. IRMA werkt met "disclosure proof" die lijken op VCs (zie hoofdstuk [Cryptographic Entities](https://irma.app/docs/overview/#cryptographic-entities). De 'disclosure proofs' maken IRMA inderdaad verifieerbaar, maar is niet helemaal hetzelfde als een VC. Waar het hier bij beiden over gaat is de data integriteit, het kunnen verifiëren dat je niet zelf aan de attributen loopt te sleutelen. Binnen VC signeert de issuer de credential die die uitgeeft. Iedereen kan die vervolgens verifiëren op basis van de meegeleverde proof, meestal een verwijzing naar de public key van de issuer. Binnen IRMA is het de IRMA server zelf die een signature toevoegd, de disclosure proof. Dat maakt het ook dat non-IRMA applicaties niet de IRMA attributen kan verifieren, maar alleen IRMA servers dat zelf kunnen, in tegenstelling tot VC. 

![image](https://user-images.githubusercontent.com/62643510/200325252-2b110df9-95e4-439f-845b-dc7808a23d4a.png)

Het doel van VC is om een open standaard te creeëren om credentials uit te kunnen wisselen. Op dit moment is IRMA niet compatible met VC en werkt dus alleen binnen het IRMA ecosysteem zelf. Er lijken meer demo's te zijn i.c.m. met IRMA, omdat die al verder lijkt te zijn. VC is echt nog meer in ontwikkeling.


