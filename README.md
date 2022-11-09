# SOLID Quest

Our journey on [SOLID pods](https://solidproject.org/) ... towards the goal of creating a [Demonstrator Koopovereenkomst Solid App](#demonstrator-koopovereenkomst-solid-app).

[Live Demo](https://kadaster-labs.github.io/solid-quest/)

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

## Work in Progress

In eerste instantie hebben we gewerkt met focusdagen en hebben we de onze bevindingen ook op die manier vastgelegd (zie [issues met 'focusdag'](https://github.com/marcvanandel/solid-quest/issues?q=is%3Aissue+focusdag)). Vanaf oktober (2022) hebben we ons onderzoek gestructureerd naar onderwerpen:

- [Quest 1 | Solid POD technologie research: Hoe werkt dat nu eigenlijk? | #11](https://github.com/marcvanandel/solid-quest/issues/11)
- [Quest 2 | Query languages - tools - libraries quest | #12](https://github.com/marcvanandel/solid-quest/issues/12)
- [Quest 3 | Verifiable Credentials en bewijzen over gegevens | #13](https://github.com/marcvanandel/solid-quest/issues/13)
- [Quest 4 | Events in de koopovereenkomst | #14](https://github.com/marcvanandel/solid-quest/issues/14)
- [Quest 5 | Koopovereenkomst ontologie in Turtle notatie op basis van events | #15](https://github.com/marcvanandel/solid-quest/issues/15)
- [Quest 6 | Privacy vriendelijke (filtered) view of export (per rol) | #16](https://github.com/marcvanandel/solid-quest/issues/16)

Issues rondom het realiseren van de demonstrator is er een apart [issue #4](https://github.com/marcvanandel/solid-quest/issues/4)

## Demonstrator Koopovereenkomst Solid App

Deze repo bevat (een eerste opzet voor) de **Demonstrator Koopovereenkomst Solid App**. Deze is bedoeld om kennis op te doen van hoe Solid PODs werken en hoe deze te gebruiken. In deze demonstator wordt een vereenvoudigde koopovereenkomst gesloten tussen Verkoper Vera en Koper Koos. In een eerste iteratie hadden wij bedacht dat Makelaar Mike het proces faciliteert en de verantwoordelijkheid heeft om het proces te initiëren, info toe te voegen die telefonisch of mondeling tussen verkoper en koper tot stand komt. Al werkende zijn we gekomen tot het punt dat een Solid POD vooral alle eigen data zou moeten vasthouden ... en dus _niet_ in een externe POD. Aangezien Verkoper Vera haar huis verkoopt, is zij ook initiator en 'eigenaar' van de koopovereenkomst. De eerste en meeste data komt dan ook in haar POD terecht. Uiteraard zou de data van Koper Koos vooral in zijn POD terecht moeten komen en een links naar elkaars PODs behoort tot beider data.

[Live Demo](https://kadaster-labs.github.io/solid-quest/)

### Architectuur

![SoftwareArchitectuur](Architectuurschets.jpg)

Voor de demonstrator is alleen een WebApp / UserInterface benodigd en geen backends of iets dergelijks. Uiteraard wel de drie Solid PODs ... maar deze kunnen overal gestart worden. De demonstrator bevat scripts om de verschillende Solid PODs lokaal op te starten, testdata om daarin te laden en/of te gebruiken voor demonstraties én de daadwerkelijke Koopovereenkomst (Web)App.

### Proces

Het proces dat doorlopen wordt, is basaal als volgt:

1. Verkoper Vera initieert een nieuwe koopovereenkomst in de [Koopovereenkomst App]. Zij vult de koopovereenkomst met de gegevens van haar huis en dat wordt in haar eigen POD opgeslagen: POD Verkoper Vera
1. Koper Koos ontvangt een link van Verkoper Vera waarmee hij zijn gegevens kan invullen in de koopovereenkomst en zijn eigen Solid POD kan koppelen. Door deze link krijgt hij automatisch de rol 'koper'
1. Als alles compleet is, kan Verkoper Vera de koopovereenkomst 'bevriezen' en een 'vastgestelde koopovereenkomst' genereren. In deze stap worden de gebruikte gegevens opgehaald en opgeslagen in de Solid POD van Verkoper Vera zodat een expliciete versie ondertekend kan worden.
1. Als elke partij getekend heeft, kan de koopovereenkomst afgerond worden. Dat betekent dat elke partij een specifieke 'afschrift' ontvangen, welke opgeslagen wordt in zijn/haar POD. De complete koopovereenkomst zou dan gedeeld moeten worden met de notaris tbv de uiteindelijke levering en kan optioneel ingeschreven worden in het Openbaar Register.

Bovenstaande is in detail uitgewerkt in een [Sequence Diagram](https://raw.githubusercontent.com/marcvanandel/solid-quest/main/koopovereenkomst-sequencediagram.png) (gemaakt mbv [SequenceDiagram.org](https://sequencediagram.org/) en [koopovereenkomst-sequencediagram.txt](koopovereenkomst-sequencediagram.txt))

### Techniek

- **v1** (verwijderd: zie [commit 5aa84140](https://github.com/marcvanandel/solid-quest/tree/5aa841404d5f50c8144a8caa1527101fbdb05bad)) : Voor de eerste versie is een poging gedaan op basis van ReactJS en GatsbyJS
  Voor de realisatie van de Koopovereenkomst App is gekozen voor Typescript en [React](https://reactjs.org/). Het framework wat deze combinatie snel en gemakkelijk maakt en ook gebruikt is, is [Gatsby](https://www.gatsbyjs.com/). (zie ook issue #4)
  -> dit leverde behoorlijk veel dependency issues op ... :(
- **v2**: Een tweede versie ... dit GitHub niet eens gehaald heeft
- [**v3**](koopovereenkomst-v3-simple/): Een Next.js versie :tada:

### Development

To start a 'verkoper' and 'koper' POD based on [Community Solid Server](https://github.com/CommunitySolidServer/CommunitySolidServer) use `docker-compose`:

```bash
docker compose up
```

- Verkoper POD: [http://localhost:3001/verkoper-vera/](http://http://localhost:3001/verkoper-vera/)
- Koper POD: [http://localhost:3001/koper-koos/](http://http://localhost:3001/koper-koos/)

To start the 'Koopovereenkomst App' switch to the `koopovereenkomst-v3-simple` folder and run `yarn dev`:

```bash
cd koopovereenkomst-v3-simple
yarn dev
```

Open the app at [localhost:3000](http://localhost:3000)
