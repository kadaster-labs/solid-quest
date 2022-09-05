import * as React from "react";

const { PathFactory } = require('ldflex')
// @ts-ignore
import ComunicaEngine from '@ldflex/comunica';
// @ts-ignore
import { namedNode } from '@rdfjs/data-model';
import { brkContext, prefix } from "./brk.context";

const queryEngine: ComunicaEngine = new ComunicaEngine('https://api.labs.kadaster.nl/datasets/dst/kkg/services/default/sparql');
const path = new PathFactory({ context: brkContext, queryEngine })

const perceelStyle = {
    marginBottom: 64,
}

interface Props {
    kadObjectId?: string;
}

interface State {
    perceelnummer?: string;
    sectie?: string;
    error?: string;
}

export default class Perceel extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        this.retrieveInfo();
    }

    async componentDidUpdate(prevProps: Props) {
        if (this.props.kadObjectId !== prevProps.kadObjectId) { this.retrieveInfo(); }
    }

    async retrievePerceel(): Promise<any> {
        return new Promise((resolve, reject) => {
            let curKadObjId = this.props.kadObjectId;
            console.log(`[kadObjectId: ${curKadObjId}]`);
            if (curKadObjId === undefined || !curKadObjId || curKadObjId === "") {
                reject("not a valid kadaster object id!");
            }
            else {
                // call Kadaster KnowledgeGraph
                let perceel: Promise<any> = path.create({
                    subject: namedNode(`${prefix.perceel}${curKadObjId}`)
                });
                resolve(perceel);
            }
        });
    }

    async toon_perceel(perceel: any): Promise<any> {
        perceel.perceelnummer.then((result: string) => {
            let pn = `- Perceelnummer: ${result}`;
            console.log(pn);
            this.setState({ perceelnummer: result })
        })

        // console output for debugging
        // console.log(`- Perceelnummer: ${await perceel.perceelnummer}`);
        // console.log(`- naam: ${await perceel.naam}`);
        // console.log(`- status: ${await perceel.status}`);
        // console.log(`- domain: ${await perceel.domain}`);
        // console.log(`- Bouwjaar: ${await perceel.oorspronkelijkBouwjaar}`);
    }

    retrieveInfo = async () => {

        await this.retrievePerceel().then(perceel => {
            this.toon_perceel(perceel)
        }).catch((e) => {
            console.warn(e);
            this.setState({
                error: `Could not find KadastraalObject (${e.message})`
            });
        });

        // map output to ZV Koopovereenkomst context
        // visualize the ZV Koopovereenkomst

        // let perceelnummer = perceel.perceelNummer // call kkg

        // koopovereenkomst = koopovereenkomstContext.initiate(); // call of path naar verkoper pod
        // koopovereenkomst.teverkopenperceelnummer.add(perceelnummer); // call naar verkoper pod met zv ontologie voor opslaan perceelnummer

        // console.log(`- Perceelnummer: ${await perceel.perceelnummer}`);
        // console.log(JSON.stringify(kadastraalObject, null, 2));
        // (<div>JSON.stringify(kadastraalObject, null, 2)</div>)
    }

    render() {
        return (
            <div id="perceel" style={perceelStyle}>
                <h2 onChange={this.retrieveInfo}>Perceel #{this.props.kadObjectId}</h2>
                <div>Perceelnummer: {this.state.perceelnummer}</div>
                <div>Sectie: {this.state.sectie}</div>
                <div>Errors: {this.state.error}</div>
                {/* <button onClick={this.setFixedKadObjectId}>test</button> */}
                <button onClick={this.retrieveInfo}>update</button>
            </div>
        );
    }
}