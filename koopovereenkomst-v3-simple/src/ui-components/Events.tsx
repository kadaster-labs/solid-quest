import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import Link from "../../src/Link";
import KoekAggregate from "../koek/KoekAggregate";

export default function Events({ koek, show = false }: { koek: KoekAggregate, show?: boolean }) {

    const [flag, setFlag] = useState("-");
    const [showEvents, setShowEvents] = useState(show);
    const [eventLabels, setEventLabels] = useState([]);

    useEffect(() => {
        if (koek) {
            try {
                setEventLabels(koek.getEvents());
            } catch (error) {
                console.error("Error handling events of koopovereenkomst!", error);
            }
        }
        if (showEvents) {
            setFlag("-");
        }
        else {
            setFlag("+");
        }
    }, [koek, showEvents]);

    const toggleEvents = async () => {
        setShowEvents(!showEvents);
    }


    return (
        <Box sx={{ p: "1rem", m: "1rem 0", backgroundColor: "rgba(255, 255, 255, 0.1)" }}>
            <Typography onClick={toggleEvents} sx={{ alignContent: "flex-end", cursor: "pointer" }}>(events {flag})</Typography>
            {showEvents && <List>
                {eventLabels.map((e, i) => (
                    <ListItem key={i} sx={{
                        ...(e.actor === "verkoper-vera" && {
                            textAlign: "right",
                        })
                    }}>
                        <Link href={e.id} target="_blank" rel="noreferrer" style={{
                            padding: "0 2rem",
                            borderRadius: "0.5rem",
                            color: "white",
                            textDecoration: "none",
                            width: "80%",
                            ...(e.actor === "verkoper-vera" && {
                                marginLeft: "auto",
                            }),
                            ...(e.actor === "verkoper-vera" && {
                                backgroundColor: "rgb(106, 136, 165, 0.8)",
                            }),
                            ...(e.actor === "koper-koos" && {
                                backgroundColor: "rgb(125, 122, 95, 0.8)",
                            })
                        }}>
                            <ListItemText sx={{
                            }}
                                primary={e.newLabel}
                                secondary={e.actor}
                            />
                        </Link>
                    </ListItem>
                ))}
            </List>}
        </Box>
    );
}
