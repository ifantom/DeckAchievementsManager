import subprocess
import decky

class Plugin:
    async def unlock(self, app_id: str, achievement_name: str):
        subprocess.run([decky.DECKY_PLUGIN_DIR + "/bin/launch.sh", '-a', app_id, '--unlock', achievement_name])

    async def lock(self, app_id: str, achievement_name: str):
        subprocess.run([decky.DECKY_PLUGIN_DIR + "/bin/launch.sh", '-a', app_id, '--lock', achievement_name])

    async def get_stats(self, app_id: str) -> str:
        status = subprocess.run([decky.DECKY_PLUGIN_DIR + "/bin/launch.sh", "-a", app_id, "--ls"], timeout=10, text=True, capture_output=True).stdout
        return status

    async def set_stat(self, app_id: str, stat_name: str, stat_value: str):
        subprocess.run([decky.DECKY_PLUGIN_DIR + "/bin/launch.sh", '-a', app_id, '--statnames', stat_name, '--statvalues', stat_value])

    async def _main(self):
        pass

    async def _unload(self):
        pass
