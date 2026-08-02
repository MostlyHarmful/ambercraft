// Alex's Caves 2.0.2 stores the seed and dimension used by its rare-biome
// lookup on the active MultiNoiseBiomeSource. Upstream normally initializes
// those fields only when a new chunk reaches fillFromNoise. Cave maps and
// /locate can therefore sample seed 0 or stale state before any new terrain is
// generated after startup, producing destinations that change after teleport.
//
// Initialize the same accessor as soon as the server is ready. This affects
// locator prediction only; it does not rewrite chunks or change biome rules.

const ACMultiNoiseBiomeSourceAccessor = Java.loadClass(
  'com.github.alexmodguy.alexscaves.server.level.biome.MultiNoiseBiomeSourceAccessor'
)
const ResourceKey = Java.loadClass('net.minecraft.resources.ResourceKey')
const Registries = Java.loadClass('net.minecraft.core.registries.Registries')

ServerEvents.loaded(event => {
  const overworld = event.server.overworld()
  const biomeSource = overworld.getChunkSource().getGenerator().getBiomeSource()

  if (!(biomeSource instanceof ACMultiNoiseBiomeSourceAccessor)) {
    console.warn(
      'Ambercraft could not initialize Alex\'s Caves locator state: ' +
      'the Overworld does not use the expected multi-noise biome source.'
    )
    return
  }

  biomeSource.setLastSampledSeed(overworld.getSeed())
  biomeSource.setLastSampledDimension(
    ResourceKey.create(Registries.DIMENSION, overworld.dimension)
  )
  console.info('Ambercraft initialized Alex\'s Caves locator state for the Overworld.')
})
