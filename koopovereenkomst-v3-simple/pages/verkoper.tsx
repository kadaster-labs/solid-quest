import { useSession } from "@inrupt/solid-ui-react";
import Head from "next/head";
import React, { useCallback, useEffect, useState } from 'react';

import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";

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

const steps = [
  "POD koppelen",
  "Koopovereenkomst",
  "Persoonsgegevens",
  "Eigendomsgegevens",
  "Koopdetails",
  "Overzicht",
  "Tekenen",
];

interface StepEvents {
  step: number;
  events: string[]
}

const eventsPerStep: StepEvents[] = [
  { step: 1, events: ['koopovereenkomstGeinitieerd'] },
  { step: 2, events: ['verkoperRefToegevoegd'] },
  { step: 3, events: ['eigendomRefToegevoegd'] },
  { step: 4, events: ['koopprijsToegevoegd', 'datumVanLeveringToegevoegd',] },
  { step: 5, events: ['conceptKoopovereenkomstGetekend'] },
  { step: 6, events: ['conceptKoopovereenkomstGetekend'] },
];

export default function Verkoper() {
  solidQuery.context.extend(SOLID_ZVG_CONTEXT);

  const { session } = useSession();
  let isLoggedIn = session.info.isLoggedIn;

  const [activeStep, setActiveStep] = useState(0);

  const [koekRepo, setKoekRepo] = useState(null as KoekRepository);
  const [koek, setActiveKoek] = useState(null as KoekAggregate);
  const [isKoekCompleted, setKoekCompleted] = useState(false);

  const handleNext = () => {
    if (isKoekCompleted) {
      setActiveStep(6);
    }
    else {
      setActiveStep((prevActiveStep) => {
        let nextActiveStep = prevActiveStep + 1;
        while ((koek) && (isStepCompleted(nextActiveStep) && nextActiveStep < 6)) {
          nextActiveStep = nextActiveStep + 1;
        }
        return nextActiveStep;
      });
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const loadKoekRepo = useCallback(() => {
    let repo = new KoekRepository();
    setKoekRepo(repo);
  }, []);

  const selectKoek = useCallback(async (id) => {
    setActiveKoek(await koekRepo.load(id, getWebId()));
  }, [koekRepo, setKoekRepo, loadKoekRepo]);

  const navigateToMyKoeks = useCallback(() => {
    setActiveStep(1);
  }, []);

  const isStepCompleted = (index) => {
    if (!isLoggedIn) {
      return false;
    }
    else {
      let result: boolean = Boolean(koek);
      let curStep = eventsPerStep.filter((se) => se.step === index);
      if (curStep.length === 0) {
        result = true;
      }
      else if (koek && curStep.length === 1) {
        let curStepEvents = curStep[0].events;
        let events = koek.getEvents().filter((e) => e.actor === 'verkoper-vera').map((e) => e.type);
        result = curStepEvents.every((t) => events.includes(t));
        // console.log('[%s] step %s is completed: %s (events: [%s] in [%s])', koek?.id, index, result, eventsPerStep.filter((se) => se.step === index).map((s) => s.events), events);
      }
      return result;
    }
  }

  function ActiveStep(props) {
    switch (props.value) {
      case 0:
        return <Step1 stepNr={props.value + 1} handleNext={handleNext} loadKoekRepo={loadKoekRepo} />;
      case 1:
        return <Step2 stepNr={props.value + 1} handleNext={handleNext} handleBack={handleBack} selectKoek={selectKoek} koek={koek} repo={koekRepo} />;
      case 2:
        return <Step3 stepNr={props.value + 1} handleNext={handleNext} handleBack={handleBack} koek={koek} />;
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
            const stepProps: { completed?: boolean } = { completed: isStepCompleted(index) };
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
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
