import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import Step1 from "./steps_verkoper/Step1";
import Step2 from "./steps_verkoper/Step2";
import Layout from "../src/Layout";
import Head from "next/head";

const steps = [
  "Datapod",
  "Persoonsgegevens",
  "Eigendomsgegevens",
  "Koopovereenkomst",
  "Delen",
  "Tekenen",
];

export default function Verkoper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepOptional = (step: number) => {
    // return step === 1;
    return false;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };
  
  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };
  
  function ActiveStep(props) {
    switch (props.value) {
      case 0:
        return <Step1 handleNext={handleNext}/>;
      case 1:
        return <Step2 />;
      // case 2:
      //   return <Step3 />;
      // case 3:
      //   return <Step4 />;
      // case 4:
      //   return <Step5 />;
      // case 5:
      //   return <Step6 />;
      default:
        return <Step1 handleNext={handleNext}/>;
    }
  }

  return (
    <Layout role="verkoper">
      <Head>
        <title>{"Verkoper"}</title>
      </Head>
      <Box
        sx={{
          width: "100%",
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActiveStep value={activeStep} />
        <Stepper sx={{width: "100%", minHeight: "4rem"}} activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
    </Layout>
  );
}
