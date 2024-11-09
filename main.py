import subprocess
import decky

class Plugin:
    async def _main(self):
         decky.logger.info("[AchievementsManager Backend] Loaded")

    async def _unload(self):
        decky.logger.info("[Achievements Backend] Unloaded")

    async def _uninstall(self):
        decky.logger.info("[Achievements Backend] Uninstalled")
