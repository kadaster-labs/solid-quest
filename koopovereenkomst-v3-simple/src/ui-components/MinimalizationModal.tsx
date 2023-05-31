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
            Bij VCs kan dataminimalisatie worden toegepast door alleen noodzakelijke informatie op te nemen en
            Zero-knowledge Proofs te gebruiken om eigenschappen te bewijzen zonder gevoelige gegevens te onthullen.
            Zodoende wordt alleen de relevante informatie opgenomen in het VC en niet meer dan dat.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6">Voor</Typography>
              <Typography variant="body1" component="pre" sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(data.before, null, 2)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">Na</Typography>
              <Typography variant="body1" component="pre" sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
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
