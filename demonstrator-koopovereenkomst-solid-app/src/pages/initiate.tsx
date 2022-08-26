import { Field, Form, FormikErrors, FormikProps, withFormik } from "formik"
import * as React from "react"
import { brkContext, prefix } from "../components/brk.context"
import { Footer } from "../components/footer"
import { Header } from "../components/header"
import { Layout } from "../components/layout"
import { SEO } from "../components/seo"

const { PathFactory } = require('ldflex')
// @ts-ignore
import ComunicaEngine from '@ldflex/comunica'
// @ts-ignore
import { namedNode } from '@rdfjs/data-model'

const title = "Nieuwe Koopovereenkomst"


const queryEngine: ComunicaEngine = new ComunicaEngine('https://api.labs.kadaster.nl/datasets/dst/kkg/services/default/sparql');
const path = new PathFactory({ context: brkContext, queryEngine })

// Shape of form values
interface FormValues {
    kadObjectId: string;
}

interface OtherProps {
    message: string;
}

var isKadastraalObjectLoaded = false;

var results = "(nothing yet)";

// Aside: You may see InjectedFormikProps<OtherProps, FormValues> instead of what comes below in older code.. InjectedFormikProps was artifact of when Formik only exported a HoC. It is also less flexible as it MUST wrap all props (it passes them through).
const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
    const { touched, errors, isSubmitting, message } = props;
    return (
        <Form>
            <h1>{message}</h1>
            <Field type="text" name="kadObjectId" />
            {touched.kadObjectId && errors.kadObjectId && <div>{errors.kadObjectId}</div>}

            <button type="submit" disabled={isSubmitting}>
                Submit
            </button>

            <br />
            <button type="submit" disabled={!isKadastraalObjectLoaded}>
                Aanmaken nieuwe koopovereenkomst
            </button>

            <div>{results}</div>
        </Form>
    );
};

// The type of props MyForm receives
interface MyFormProps {
    kadObjectId?: string;
    message: string; // if this passed all the way through you might do this or make a union type
}

// Wrap our form with the withFormik HoC
const MyForm = withFormik<MyFormProps, FormValues>({
    // Transform outer props into form values
    mapPropsToValues: props => {
        return {
            kadObjectId: props.kadObjectId || '',
        };
    },

    // Add a custom validation function (this can be async too!)
    validate: (values: FormValues) => {
        let errors: FormikErrors<FormValues> = {};
        if (!values.kadObjectId) {
            errors.kadObjectId = 'Required';
        } else if (!isValidKadObjectId(values.kadObjectId)) {
            errors.kadObjectId = 'Invalide Kadastraal Object ID';
        }
        return errors;
    },

    handleSubmit: async (values: any) => {
        // do submitting things
        console.log({ values });

        isKadastraalObjectLoaded = true;

        
        // call Kadaster KnowledgeGraph
        let perceel: any = path.create({
            subject: namedNode(`${prefix.perceel}${values.kadObjectId}`)
        });
        
        // map output to ZV Koopovereenkomst context
        // visualize the ZV Koopovereenkomst
        console.log(`- PerceelID: ${await perceel}`);
        console.log(`- Perceelnummer: ${await perceel.perceelnummer}`);
        results = `PerceelID: ${await perceel}`;

        // let perceelnummer = perceel.perceelNummer // call kkg

        // koopovereenkomst = koopovereenkomstContext.initiate(); // call of path naar verkoper pod
        // koopovereenkomst.teverkopenperceelnummer.add(perceelnummer); // call naar verkoper pod met zv ontologie voor opslaan perceelnummer

        // console.log(`- Perceelnummer: ${await perceel.perceelnummer}`);
        // console.log(JSON.stringify(kadastraalObject, null, 2));
        // (<div>JSON.stringify(kadastraalObject, null, 2)</div>)
    },
})(InnerForm);

const isValidKadObjectId = (input: string): boolean => {
    return (input !== undefined && /^[0-9]{14}$/i.test(input));
}

const NewKoopovereenkomstPage = () => {
    return (
        <Layout>
            <Header title={title}></Header>

            <MyForm message="Welk Kadastraal Object ID betreft de nieuwe koopovereenkomst?" />

            <Footer />
        </Layout>
    )
}

export default NewKoopovereenkomstPage

export const Head = () => (
    <SEO title={title} />
)
