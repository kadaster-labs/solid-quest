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
import Step1 from "./steps_koper/Step1";
import Step2 from "./steps_koper/Step2";
import Step3 from "./steps_koper/Step3";
import Step4 from "./steps_koper/Step4";
import Step5 from "./steps_koper/Step5";

const steps = [
  "POD koppelen",
  "Deelnemen Koopovereenkomst",
  "Persoonsgegevens",
  "Overzicht",
  "Tekenen",
];

interface StepEvents {
  step: number;
  events: string[]
}

const eventsPerStep: StepEvents[] = [
  { step: 1, events: ['koopovereenkomstGeinitieerd', 'eigendomRefToegevoegd', 'koopprijsToegevoegd', 'datumVanLeveringToegevoegd'] },
  { step: 2, events: ['koperRefToegevoegd',] },
  { step: 3, events: ['conceptKoopovereenkomstGetekend',] },
  { step: 4, events: ['conceptKoopovereenkomstGetekend',] },
];

export default function KoperFlow() {
  solidQuery.context.extend(SOLID_ZVG_CONTEXT);

  let koekRepo = new KoekRepository();

  const { session } = useSession();
  let isLoggedIn = session.info.isLoggedIn;

  const [activeStep, setActiveStep] = useState(0);

  const [koek, setActiveKoek] = useState(null as KoekAggregate);
  const [isKoekCompleted, setKoekCompleted] = useState(false);

  const handleNext = () => {
    if (isKoekCompleted) {
      setActiveStep(5);
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
      else if (koek && index === 1 && curStep.length === 1) {
        let curStepEvents = curStep[0].events;
        let events = koek.getEvents().map((e) => e.type);
        result = curStepEvents.every((t) => events.includes(t));
      }
      else if (koek && curStep.length === 1) {
        let curStepEvents = curStep[0].events;
        let events = koek.getEvents().filter((e) => e.actor === 'koper-koos').map((e) => e.type);
        result = curStepEvents.every((t) => events.includes(t));
      }
      // console.log('[%s] step %s is completed: %s (events: %s)', koek?.id, index, result, eventsPerStep.filter((se) => se.step === index).map((s) => s.events));
      return result;
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const selectKoek = async (id) => {
    setActiveKoek(await koekRepo.load(id, getWebId()));
  }

  const loadKoek = async () => {
    await selectKoek(koek.id);
  }

  const navigateToMyKoeks = useCallback(() => {
    setActiveStep(1);
  }, []);

  useEffect(() => {
    if (koek?.getEvents().filter((e) => e.type === "conceptKoopovereenkomstGetekend").length === 2) {
      setKoekCompleted(true);
    }
    else {
      setKoekCompleted(false);
    }
  }, [koek, selectKoek]);

  function ActiveStep(props) {
    switch (props.value) {
      case 0:
        return <Step1 stepNr={props.value + 1} handleNext={handleNext} />;
      case 1:
        return <Step2 stepNr={props.value + 1} handleNext={handleNext} handleBack={handleBack} selectKoek={selectKoek} koek={koek} />;
      case 2:
        return <Step3 stepNr={props.value + 1} handleNext={handleNext} handleBack={handleBack} koek={koek} />;
      case 3:
        return <Step4 stepNr={props.value + 1} handleNext={handleNext} handleBack={handleBack} koek={koek} loadKoek={loadKoek} />;
      case 4:
      default:
        return <Step5 stepNr={props.value + 1} finished={isKoekCompleted} handleNext={handleNext} handleBack={handleBack} navigateToMyKoeks={navigateToMyKoeks} koek={koek} />;
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
        <ActiveStep value={activeStep} />
        <Stepper sx={{ width: "100%", minHeight: "4rem" }} activeStep={activeStep}>
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
    </Layout>
  );
}
