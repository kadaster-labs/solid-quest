import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { callKadasterKnowledgeGraph } from "./kkg/kkgService";


const KadasterKnowledgeGraph = function ({ objectId }) {
    const [perceelnummer, setPerceelnummer] = useState("");

    let [kadastraalObjectId, setKadastraalObjectId] = useState(String(objectId));

    const handleChange = (e) => {
        setKadastraalObjectId(e.target.value);
    };

    const callKadaster = async () => {
        let perceel = await callKadasterKnowledgeGraph(kadastraalObjectId);
        setPerceelnummer(perceel.perceelNummer);
    }


    useEffect(() => {
        setKadastraalObjectId(objectId);
    }, [objectId]);

    return (
        <Box sx={{
            width: "100%",
            my: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <input type="text" value={kadastraalObjectId} onChange={handleChange}></input>
            <Button variant="contained" color="warning" onClick={callKadaster}>call KKG</Button>
            <p>Perceelnummer: {perceelnummer}</p>
        </Box>
    );
}

export default KadasterKnowledgeGraph;
