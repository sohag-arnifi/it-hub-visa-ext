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

const Header = ({ user, setIsOpenManageApplication }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleManageApplication = () => {
    setIsOpenManageApplication(true);
    setOpen(false);
  };

  const handleApplicationToken = () => {
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
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: "10px",
          paddingRight: "15px",
          zIndex: 100,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
                        <MenuItem onClick={handleApplicationToken}>
                          Applications e-Token
                        </MenuItem>
                        <MenuItem onClick={handleManageApplication}>
                          Manage Applications
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
