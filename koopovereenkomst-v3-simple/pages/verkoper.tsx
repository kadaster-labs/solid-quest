import Head from "next/head";
import React, { useCallback, useEffect, useState } from 'react';

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

import { getWebId } from "../src/Solid";
import Step1 from "./steps_verkoper/Step1";
import Step2 from "./steps_verkoper/Step2";
import Step3 from "./steps_verkoper/Step3";
import Step4 from "./steps_verkoper/Step4";
import Step5 from "./steps_verkoper/Step5";
import Step6 from "./steps_verkoper/Step6";
import Step7 from "./steps_verkoper/Step7";
import { Signing } from "../src/verifiable/signing";

const steps = [
  "POD koppelen",
  "Koopovereenkomst",
  "Persoonsgegevens",
  "Eigendomsgegevens",
  "Koopdetails",
  "Overzicht",
  "Tekenen",
  // "Afgerond",
];

export default function Verkoper() {
  solidQuery.context.extend(SOLID_ZVG_CONTEXT);

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());

  const [koekRepo, setKoekRepo] = useState(null as KoekRepository);
  const [koek, setActiveKoek] = useState(null as KoekAggregate);
  const [isKoekCompleted, setKoekCompleted] = useState(false);
  
  const [signing, setSigning] = React.useState(null as Signing);

  const isStepOptional = (step: number) => {
    // return step === 1;
    return false;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if (isKoekCompleted) {
      setActiveStep(6);
    }
    else {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const loadKoekRepo = useCallback(() => {
    let repo = new KoekRepository();
    setKoekRepo(repo);
  }, []);
  
  const _setSigning = useCallback(() => {
    setSigning(new Signing());
  }, []);

  const selectKoek = useCallback(async (id) => {
    setActiveKoek(await koekRepo.load(id, getWebId()));
  }, [koekRepo, setKoekRepo, loadKoekRepo]);

  const navigateToMyKoeks = useCallback(() => {
    setActiveStep(1);
  }, []);

  function ActiveStep(props) {
    switch (props.value) {
      case 0:
        return <Step1 stepNr={props.value + 1} handleNext={handleNext} loadKoekRepo={loadKoekRepo} setSigning={_setSigning} />;
      case 1:
        return <Step2 stepNr={props.value + 1} handleNext={handleNext} handleBack={handleBack} selectKoek={selectKoek} koek={koek} repo={koekRepo} />;
      case 2:
        return <Step3 stepNr={props.value + 1} handleNext={handleNext} handleBack={handleBack} koek={koek} signing={signing} />;
      case 3:
        return <Step4 stepNr={props.value + 1} handleNext={handleNext} handleBack={handleBack} koek={koek} />;
      case 4:
        return <Step5 stepNr={props.value + 1} handleNext={handleNext} handleBack={handleBack} koek={koek} />;
      case 5:
        return <Step6 stepNr={props.value + 1} handleNext={handleNext} handleBack={handleBack} koek={koek} navigateToMyKoeks={navigateToMyKoeks} />;
      case 6:
      default:
        return <Step7 stepNr={props.value + 1} finished={isKoekCompleted} handleNext={handleNext} handleBack={handleBack} koek={koek} navigateToMyKoeks={navigateToMyKoeks} />;
    }
  }

  useEffect(() => {
    if (koek?.getEvents().filter((e) => e.type === "conceptKoopovereenkomstGetekend").length === 2) {
      setKoekCompleted(true);
    }
    else {
      setKoekCompleted(false);
    }
  }, [koek, selectKoek, handleNext]);

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
            const stepProps: { completed?: boolean } = { completed: isKoekCompleted };
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
    </Layout >
  );
}
