I have mitigated against integer arithmetic overflow by:
    -auditing every use of arithmetic operations involving user supplied data
    -checking pre-conditions before performing artihmetic where practical

I have also mitigated against exposed functions by:
    -auditing every external function to ensure it is intended to be exposed.

I have also mitigated against miner vulnerabilites by:
    -not expecting a precision of better than fifteen minutes or so from block timestamps.