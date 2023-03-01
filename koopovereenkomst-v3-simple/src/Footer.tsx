import * as React from "react";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import Image from "./Image";

export default function Footer() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      Powered by <MuiLink color="inherit" href="https://kadaster.nl"></MuiLink>
      <Image
        src="/solid-quest/images/kadaster.svg"
        alt="Kadaster Logo"
        width={72}
        height={16}
      />
    </Typography>
  );
}
