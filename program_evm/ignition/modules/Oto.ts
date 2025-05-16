import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OtoModule = buildModule("OtoModule", (m) => {
  // deploy Oto contract
  const oto = m.contract("Oto", [
    "Oto",
    "OTO",
    //"0x38ac9e22B4BD0884f4957617eDE2F06BE158Bbc5",
    "0x2B5914De5D5166eBaa423C92BAb8518c85EAA0cb"
  ]);

  return { oto };
});

export default OtoModule;
