import { Field, Form, FormikErrors, FormikProps, withFormik } from "formik"
import * as React from "react"
import { Footer } from "../components/footer"
import { Header } from "../components/header"
import { Layout } from "../components/layout"
import Perceel from "../components/perceel"
import { SEO } from "../components/seo"

const title = "Nieuwe Koopovereenkomst"

// Shape of form values
interface FormValues {
    kadObjectId: string;
}

interface OtherProps {
    message: string;
}

var isKadastraalObjectLoaded = false;
var theId = "";

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
        </Form>
    );
};

// The type of props MyForm receives
interface MyFormProps {
    kadObjectId?: string;
    message: string; // if this passed all the way through you might do this or make a union type
}

const isValidKadObjectId = (input: string): boolean => {
    return (input !== undefined && /^[0-9]{14}$/i.test(input));
}


interface Props { }

interface State {
    kadObjectId?: string;
}

class NewKoopovereenkomstPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    updateKadObjId = (value: string) => {
        this.setState({
            kadObjectId: value
        })
    }

    setFixedKadObjectId = () => {
        this.updateKadObjId("10020263270000");
    }

    // Wrap our form with the withFormik HoC
    MyForm = withFormik<MyFormProps, FormValues>({
        // Transform outer props into form values
        mapPropsToValues: props => {
            return {
                kadObjectId: props.kadObjectId || '',
            };
        },

        // Add a custom validation function (this can be async too!)
        validate: async (values: FormValues) => {
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

            theId = values.kadObjectId;
            isKadastraalObjectLoaded = true;
            this.updateKadObjId(values.kadObjectId);
        },
    })(InnerForm);


    render() {
        return (
            <Layout>
                <Header title={title}></Header>

                <this.MyForm message="Welk Kadastraal Object ID betreft de nieuwe koopovereenkomst?" />

                <p>The ID is [{theId}]</p>
                <Perceel kadObjectId={this.state.kadObjectId} />
                <button onClick={this.setFixedKadObjectId}>set fixed ID</button>
                <Footer />
            </Layout>
        )
    }
}

export default NewKoopovereenkomstPage

export const Head = () => (
    <SEO title={title} />
)
