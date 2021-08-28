import ECH from './index.js';

export default function (token, options, commandOptions) {
  return new ECH.CommandClient(token, options, commandOptions);
}

export const { CommandClient, Command } = ECH;
