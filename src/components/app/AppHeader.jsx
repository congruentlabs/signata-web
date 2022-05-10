import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { shortenIfAddress } from '@usedapp/core';

const pages = [
  { name: 'Docs', href: 'https://docs.signata.net' },
  { name: 'News', href: 'https://blog.signata.net' },
  { name: 'Token', href: 'https://sata.technology' }
];

function AppHeader({ account, handleClickDisconnect, handleClickReplacePassword }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const settings = account
    ? [
        {
          name: 'Terms & Conditions',
          href: 'terms.pdf',
          color: 'secondary'
        },
        {
          name: 'Privacy Policy',
          href: 'privacy.pdf',
          color: 'secondary'
        },
        {
          name: 'Replace Password',
          useClickEvent: true,
          onClick: handleClickReplacePassword,
          color: 'warning'
        },
        {
          name: 'Disconnect',
          useClickEvent: true,
          onClick: handleClickDisconnect,
          color: 'error'
        }
      ]
    : [
        {
          name: 'Terms & Conditions',
          href: 'terms.pdf',
          color: 'secondary'
        },
        {
          name: 'Privacy Policy',
          href: 'privacy.pdf',
          color: 'secondary'
        }
      ];

  const handleOpenNavMenu = (e) => {
    setAnchorElNav(e.currentTarget);
  };

  const handleOpenUserMenu = (e) => {
    setAnchorElUser(e.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" color="transparent">
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <Avatar alt="Logo" src="logo.png" />

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name}>
                  <Button component="a" href={page.href} target="_blank">
                    {page.name}
                  </Button>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component="a"
                href={page.href}
                target="_blank"
                // onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {account && (
              <Tooltip title="Settings">
                <Button onClick={handleOpenUserMenu} variant="contained" color="secondary">
                  {account && shortenIfAddress(account)}
                </Button>
              </Tooltip>
            )}

            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                  {setting.useClickEvent ? (
                    <Button onClick={setting.onClick} color={setting.color}>
                      {setting.name}
                    </Button>
                  ) : (
                    <Button target="_blank" href={setting.href} color={setting.color}>
                      {setting.name}
                    </Button>
                  )}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AppHeader;