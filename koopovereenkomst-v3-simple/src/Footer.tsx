import * as React from "react";
import Typography from "@mui/material/Typography";
import { BottomNavigation } from '@mui/material';
import MuiLink from "@mui/material/Link";
import Image from "./Image";

export default function Footer({ home, role }: {
  home?: boolean,
  role?: string,
}) {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {!home && (
        <MuiLink href="/">← Main home</MuiLink>
      )}
      Powered by
      <MuiLink color="inherit" href="https://kadaster.nl" target="_blank">
        <Image
          src="/solid-quest/images/kadaster-wit.svg"
          alt="Kadaster Logo"
          width={40}
          height={14}
        />
      </MuiLink>
    </Typography>
  );
}
