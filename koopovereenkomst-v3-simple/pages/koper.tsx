import Head from "next/head";
import React from 'react';

import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";

import { default as solidQuery } from "@solid/query-ldflex/lib/exports/rdflib";
import Layout from "../src/Layout";
import { SOLID_ZVG_CONTEXT } from "../src/koek/Context";
import KoekAggregate from '../src/koek/KoekAggregate';
import KoekRepository from "../src/koek/KoekRepository";

import { SessionProvider } from "@inrupt/solid-ui-react";
import Step1 from "./steps_koper/Step1";
import Step2 from "./steps_koper/Step2";
import Step3 from "./steps_koper/Step3";
import Step5 from "./steps_koper/Step5";
import Step6 from "./steps_koper/Step6";
import { getWebId } from "../src/Solid";
import Step4 from "./steps_koper/Step4";

const steps = [
  "POD koppelen",
  "Deelnemen Koopovereenkomst",
  "Persoonsgegevens",
  "Overzicht",
  "Tekenen",
  "Inschrijving Kadaster",
];

export default function Koper() {
  let koekRepo = new KoekRepository();
  solidQuery.context.extend(SOLID_ZVG_CONTEXT);

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const [koek, setActiveKoek] = React.useState(null as KoekAggregate);

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

  const selectKoek = async (id) => {
    setActiveKoek(await koekRepo.load(id, getWebId()));
  }

  function ActiveStep(props) {
    switch (props.value) {
      case 0:
        return <Step1 stepNr={props.value + 1} handleNext={handleNext} />;
      case 1:
        return <Step2 stepNr={props.value + 1} handleNext={handleNext} handleBack={handleBack} selectKoek={selectKoek} koek={koek} />;
      case 2:
        return <Step3 stepNr={props.value + 1} handleNext={handleNext} handleBack={handleBack} koek={koek} />;
      case 3:
        return <Step4 stepNr={props.value + 1} handleNext={handleNext} handleBack={handleBack} koek={koek} />;
      case 4:
        return <Step5 stepNr={props.value + 1} handleNext={handleNext} handleBack={handleBack} koek={koek} />;
      case 5:
        return <Step6 stepNr={props.value + 1} handleBack={handleBack} koek={koek} />;
      default:
        return <Step1 handleNext={handleNext} />;
    }
  }

  return (
    <Layout role="koper">
      <Head>
        <title>{"Koper"}</title>
      </Head>
      <Box
        sx={{ display: 'flex', flex: 1, flexDirection: 'column', height: '100%', width: '100%', marginTop: 4 }}
      >
        <SessionProvider>
          <ActiveStep value={activeStep} />
          <Stepper sx={{ width: "100%", minHeight: "4rem" }} activeStep={activeStep}>
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
        </SessionProvider>
      </Box>
    </Layout>
  );
}
