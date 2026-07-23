# Persist entities and pending world state before the normal Forge shutdown
# lifecycle begins. This narrows Integrated API's asynchronous villager-trade
# shutdown race while preserving Distant Horizons' normal close sequence.
save-all flush
stop
