import { ErrorMessage, Field, Form, Formik, FormikErrors, FormikProps, withFormik } from "formik"
import * as React from "react"
import { Footer } from "../components/footer"
import { Header } from "../components/header"
import { Layout } from "../components/layout"
import { SEO } from "../components/seo"

const title = "Nieuwe Koopovereenkomst"


// TODO task#1 insert Zorgeloos Vastgoed of BRK context based on LDflex

// TODO task#2b new methode: call Kadaster KnowledgeGraph with provided kadObjectId and retrieve info

// Shape of form values
interface FormValues {
    kadObjectId: string;
}

interface OtherProps {
    message: string;
}

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

    handleSubmit: values => {
        // do submitting things
        console.log({ values });
        alert(JSON.stringify(values, null, 2));

        // TODO task#2a await calling Kadaster Knowledge Graph method (see task#2b)
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
