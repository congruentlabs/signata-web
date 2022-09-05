/* eslint-disable import/prefer-default-export */

export function shouldBeLoading(state) {
  switch (state) {
    case 'PendingSignature':
      return true;
    case 'Exception':
      return false;
    case 'None':
      return false;
    case 'Mining':
      return true;
    case 'Success':
      return false;
    default:
      return false;
  }
}

export function logLoading(state, name) {
  if (state && window.location.hostname === 'localhost') {
    if (state && state.status !== 'None') {
      console.log({ name, state: { ...state } });
    }
  }
}

export const SUPPORTED_CHAINS = [
  { chainName: 'Avalanche', chainId: 43114 },
  { chainName: 'BSC', chainId: 56 },
  { chainName: 'Ethereum', chainId: 1 },
  { chainName: 'Fantom', chainId: 250 },
  { chainName: 'Metis Andromeda', chainId: 1088 },
  { chainName: 'Polygon', chainId: 137 },
  { chainName: 'Rinkeby (Test)', chainId: 4 },
];
