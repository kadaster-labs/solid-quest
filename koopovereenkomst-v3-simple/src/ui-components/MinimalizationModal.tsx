import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Grid, ModalProps } from '@mui/material';

interface Props {
  data: {
    before: object;
    after: object;
  };
  open: boolean;
  onClose: (reason: "dismiss" | "accept") => void;
}

export default function MinimalizationModal({ data, open, onClose }: Props) {

  const handleClose = () => {
    onClose('dismiss');
  };
  
  const handleSave = () => {
    onClose('accept');
  };

  return (
    <div>
      <Dialog open={open} maxWidth="lg" onClose={handleClose}>
        <DialogTitle>Dataminimalisatie</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Bij VCs is het mogelijk om dataminimalisatie toe te passen. Hiermee hoeft niet alle persoonsinformatie
            gedeeld te worden, maar slechts de relevante informatie. Zo kun je bewijzen dat jij het echt bent, zonder al
            je paspoortgegevens te hoeven delen. Hiermee wordt de privacy van de betrokkenen beter gewaarborgd.
          </Typography>
          <hr />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6">Vóór minimalisatie</Typography>
              <Typography variant="body1">
                ➡ Alleen zichtbaar voor jezelf
              </Typography>
              <Typography
                variant="body1"
                component="pre"
                sx={{
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "10px",
                  padding: "20px",
                }}
              >
                {JSON.stringify(data.before, null, 2)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">Na minimalisatie</Typography>
              <Typography variant="body1">
                ➡ Zichtbaar voor jezelf én de koper
              </Typography>
              <Typography
                variant="body1"
                component="pre"
                sx={{
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "10px",
                  padding: "20px",
                }}
              >
                {JSON.stringify(data.after, null, 2)}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleSave} autoFocus>
            Opslaan
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
