import Head from "next/head";
import React from 'react';

import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";

import Layout from "../src/Layout";
import { getRootContainerURL } from "../src/Solid";
import KoopovereenkomstAggregate from '../src/aggregate/koopovereenkomst-aggregate';
import { Step1, Step1b, Step2, Step3, Step4, Step5, Step6 } from "./steps_verkoper";

const steps = [
  "Datapod koppelen",
  "Koopovereenkomst aanmaken (debug)",
  "Persoonsgegevens",
  "Eigendomsgegevens",
  "Koopovereenkomst aanmaken",
  "Koopovereenkomst",
  "Tekenen",
];

export default function Verkoper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  
  const [koek, setActiveKoek] = React.useState(null as KoopovereenkomstAggregate);

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

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const selectKoek = (id) => {
    const ko = `${getRootContainerURL()}/koopovereenkomst/id/${id}`;
    setActiveKoek(new KoopovereenkomstAggregate(ko, id));
  }

  function ActiveStep(props) {
    switch (props.value) {
      case 0:
        return <Step1 handleNext={handleNext} />;
      case 1:
        return <Step1b handleNext={handleNext} handleBack={handleBack} selectKoek={selectKoek} koek={koek} />;
      case 2:
        return <Step2 handleNext={handleNext} handleBack={handleBack} />;
      case 3:
        return <Step3 handleNext={handleNext} handleBack={handleBack} />;
      case 4:
        return <Step4 handleNext={handleNext} handleBack={handleBack} />;
      case 5:
        return <Step5 handleNext={handleNext} handleBack={handleBack} koek={koek} />;
      case 6:
        return <Step6 handleBack={handleBack} />;
      default:
        return <Step1 handleNext={handleNext} />;
    }
  }

  return (
    <Layout role="verkoper">
      <Head>
        <title>{"Verkoper"}</title>
      </Head>
      <Box
        sx={{ display: 'flex', flex: 1, flexDirection: 'column', height: '100%', width: '100%', marginTop: 4 }}
      >
        <ActiveStep value={activeStep} />
        <Stepper
          sx={{
            width: "100%",
            minHeight: "4rem",
          }} activeStep={activeStep}>
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
