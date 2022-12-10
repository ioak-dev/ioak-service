import { createSequence } from "./modules/sequence/service";

export const initializeSequences = () => {
  createSequence({
    field: "memberId", factor: 1
  });
};
