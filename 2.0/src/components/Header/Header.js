import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  ClickAwayListener,
  Divider,
  Grow,
  MenuList,
  MenuItem,
  Paper,
  Popper,
  Typography,
} from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import Marquee from "react-fast-marquee";

const Header = ({
  user,
  setIsOpenManageApplication,
  setIsOpenCompletedApplication,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const isDuePending = user?.companyId?.currentBalance <= 0;

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleManageApplication = () => {
    setIsOpenManageApplication(true);
    setIsOpenCompletedApplication(false);
    setOpen(false);
  };

  const handleCompletedApplication = () => {
    setIsOpenCompletedApplication(true);
    setIsOpenManageApplication(false);
    setOpen(false);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ zIndex: 100 }}>
      {/* Header Top Section */}
      <Box
        sx={{
          borderBottom: "1px solid #E0E0E0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 15px",
        }}
      >
        <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "blue" }}>
          It-Hub
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "16px", fontWeight: 600 }}>
            {user?.companyId?.companyName}
          </Typography>
          <Divider flexItem orientation="vertical" />
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              color: user?.companyId?.currentBalance >= 0 ? "green" : "red",
            }}
          >
            Balance: {user?.companyId?.currentBalance.toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {/* Header Menu Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: isDuePending ? "space-between" : "flex-end",
          alignItems: "center",
          marginTop: "10px",
          paddingRight: "15px",
          zIndex: 100,
        }}
      >
        {isDuePending && (
          <Box sx={{ width: "75%" }}>
            <Marquee
              gradientColor="white"
              gradient={true}
              speed={30}
              loop={0}
              autoFill
            >
              <Box
                sx={{
                  padding: "10px",
                  bgcolor: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderTop: "1px solid #E0E0E0",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <Typography
                  sx={{ fontSize: "20px", fontWeight: 500, color: "red" }}
                >
                  We regret to inform you that no actions can be taken at this
                  time because of an outstanding due amount. Kindly clear your
                  dues to regain access to all features. If you have any
                  questions or need assistance, please contact our support team.
                </Typography>
              </Box>
            </Marquee>
          </Box>
        )}

        <Box
          sx={{
            width: "25%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Box
            sx={{
              paddingX: "10px",
              bgcolor: "#F7F7F7",
              borderRadius: "5px",
              boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#E52020",
              }}
            >
              {currentTime?.toLocaleTimeString()}
            </Typography>
          </Box>
          <Box>
            <Box
              ref={anchorRef}
              onClick={handleToggle}
              sx={{
                display: "flex",
                gap: "5px",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                borderRadius: "5px",
                transition: "all 0.3s ease",
                padding: "5px 10px",
                "&:hover": {
                  color: "blue",
                },
              }}
            >
              <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                {user?.name}
              </Typography>
              <KeyboardArrowDownRoundedIcon
                sx={{
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              />
            </Box>

            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
              modifiers={[
                {
                  name: "preventOverflow",
                  enabled: true,
                  options: {
                    altAxis: true,
                  },
                },
                {
                  name: "flip",
                  enabled: false,
                },
              ]}
              sx={{
                zIndex: 100,
                bgcolor: "#FFF",
                padding: 0,
              }}
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom-start" ? "left top" : "left bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                        onKeyDown={handleListKeyDown}
                      >
                        <MenuItem onClick={handleManageApplication}>
                          Manage Applications
                        </MenuItem>

                        <MenuItem onClick={handleCompletedApplication}>
                          Completed Applications
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
