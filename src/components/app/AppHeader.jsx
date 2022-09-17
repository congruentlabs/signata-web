import React, { useState } from 'react';
import { grey } from '@mui/material/colors';
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
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { shortenAddress, useLookupAddress } from '@usedapp/core';
import { Typography, ButtonGroup } from '@mui/material';
import { SUPPORTED_CHAINS } from '../../hooks/helpers';

const pages = [
  { name: 'Docs', href: 'https://docs.signata.net' },
  { name: 'News', href: 'https://blog.congruentlabs.co' },
];

function AppHeader({
  account, handleClickDisconnect, chainId, supportedChain, theme, colorMode,
}) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const ens = useLookupAddress(account);

  const settings = account
    ? [
      {
        name: 'Terms & Conditions',
        href: 'terms.pdf',
        color: 'inherit',
      },
      {
        name: 'Privacy Policy',
        href: 'privacy.pdf',
        color: 'inherit',
      },
      {
        name: 'Disconnect',
        useClickEvent: true,
        onClick: handleClickDisconnect,
        color: 'error',
      },
    ]
    : [
      {
        name: 'Terms & Conditions',
        href: 'terms.pdf',
        color: 'inherit',
      },
      {
        name: 'Privacy Policy',
        href: 'privacy.pdf',
        color: 'inherit',
      },
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
    <AppBar
      position="sticky"
      component="nav"
      sx={{
        boxShadow: 'none',
        borderColor: grey[600],
        borderBottom: 1,
        // background: grey[50],
      }}
    >
      <Container maxWidth="lg">
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
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name}>
                  <Button
                    component="a"
                    href={page.href}
                    target="_blank"
                    startIcon={page.startIcon}
                    color="inherit"
                  >
                    {page.name}
                  </Button>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <ButtonGroup>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  component="a"
                  href={page.href}
                  target="_blank"
                  color="inherit"
                  startIcon={page.startIcon}
                  // onClick={handleCloseNavMenu}
                  sx={{ px: 2 }}
                  variant="text"
                >
                  {page.name}
                </Button>
              ))}
            </ButtonGroup>
          </Box>

          <Typography
            variant="h6"
            color="inherit"
            component="div"
            sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}
          >
            <i>Signata Identity Manager</i>
          </Typography>

          <IconButton sx={{ mx: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {chainId && supportedChain && (
            <Box sx={{ px: 1, textAlign: 'right' }}>
              <Typography variant="caption" sx={{ paddingBottom: -1, marginBottom: -1 }} color="text.secondary">
                Connected Chain
              </Typography>
              <Typography variant="body1" sx={{ paddingTop: -1, marginTop: -1 }}>
                {SUPPORTED_CHAINS.find(
                  (network) => network.chainId === chainId,
                )?.chainName}
              </Typography>
            </Box>
          )}

          <Box sx={{ flexGrow: 0 }}>
            {account && (
              <Tooltip title="Settings">
                <Button
                  onClick={handleOpenUserMenu}
                  variant="contained"
                  color="secondary"
                  size="large"
                >
                  {ens || shortenAddress(account)}
                </Button>
              </Tooltip>
            )}

            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.name}
                  onClick={setting.onClick || undefined}
                  href={setting.href || undefined}
                  color={setting.color}
                  target={setting.href ? '_blank' : undefined}
                  component="a"
                >
                  {setting.name}
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
