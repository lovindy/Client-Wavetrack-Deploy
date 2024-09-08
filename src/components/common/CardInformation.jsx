import { Avatar, Box, Button, Typography, useTheme } from "@mui/material";
import React from "react";
import Header from "../teacher/Header";
import SubHeader from "../teacher/SubHeader";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import CardComponent from "./CardComponent"
import { cardContainer } from "../../styles/global";

function CardInformation() {
  const theme = useTheme();
  const mobile = theme.breakpoints;

  const textStyles = {
    fontWeight: "bold",
    display: "flex",
    gap: 0.5,
    overflowWrap: "break-word",
    textOverflow: "ellipsis",
    [mobile.down("sm")]: {
      fontSize: "14px",
    },
    [mobile.up("sm")]: {
      fontSize: "16px",
    },
  };

  const textInput = {
    [mobile.down("sm")]: {
      fontSize: "14px",
    },
    [mobile.up("sm")]: {
      fontSize: "16px",
    },
  };

  return (

    <>
      {/* card */}
        {/* <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <SubHeader title={"Teacher Information"} />
            <Button sx={buttonCard}>
              <BorderColorIcon color="primary" />
              <DeleteForeverIcon color="error" />
            </Button>
          </Box>
        </Box> */}

        {/* container for profile and information */}
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: "100%",
            alignItems: {
              xs: "center",
              sm: "start",
            },
            gap: {
              xs:3,
              sm:5,
            },
            mt: 4,
          }}
        >
        <Avatar sx={{ width: {
          xs:120, sm:160
        }, height:  {
          xs:120, sm:160
        } , display: "flex"}} alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          <Box sx={{ display: "flex", flexDirection: "column", gap:{
            xs:'10px',
            sm:'12px'
          } , width: "100%"}}>
            <Typography sx={textStyles}>
              Teacher ID: <Typography sx={textInput}>ANB1000</Typography>
            </Typography>
            <Typography sx={textStyles}>
              Full Name: <Typography sx={textInput}>Potato Fried</Typography>
            </Typography>
            <Typography sx={textStyles}>
              Age: <Typography sx={textInput}>18</Typography>
            </Typography>
            <Typography sx={textStyles}>
              Gender: <Typography sx={textInput}>Female</Typography>
            </Typography>
            <Typography sx={textStyles}>
              Date of Birth: <Typography sx={textInput}>01/01/2000</Typography>
            </Typography>
            <Typography sx={textStyles}>
              Phone Number: <Typography sx={textInput}>01234567</Typography>
            </Typography>
            <Typography sx={textStyles}>
              Email:{" "}
              <Typography sx={textInput}>mrpotato@123gmail.com</Typography>
            </Typography>
            <Typography sx={textStyles}>
              Address:
              <Typography sx={textInput}>
                Potatoes village, french fried city
              </Typography>
            </Typography>
          </Box>
        </Box>
    </>
  );
}

export default CardInformation;

const profile = {
  width: 100,
  height: 100,
  borderRadius: "50%",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  
  
  alignItems: {
    xs: "center",
    sm: "flex-start",
  },
};

const cardBox = {
  border: "1px solid",
  borderColor: "#E0E0E0",
  borderRadius: "8px",
  marginTop: "32px",
  padding: {
    xs: 2,
    sm: 3,
  },
  display: "flex",
  flexDirection: "column",
};

const buttonCard = {
  position: "absolute",
  bottom: "10px",
  right: "0",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};
