import { SteamAchievement } from "./models";
import localforage from "localforage";

export default class AchievementsManagerCache {
  private readonly _ignored: Map<number, Set<SteamAchievement["strID"]>> = new Map();
  private readonly _counters: Map<number, { achieved: number; total: number }> = new Map();

  get ignored(): Map<number, Set<SteamAchievement["strID"]>> {
    return this._ignored;
  }

  get counters(): Map<number, { achieved: number; total: number }> {
    return this._counters;
  }

  addAppIgnored(appId: number, update: Set<SteamAchievement["strID"]>): Set<SteamAchievement["strID"]> {
    const appIgnored = new Set(this._ignored.get(appId) ?? []);

    update.forEach((id) => appIgnored.add(id));

    this._ignored.set(appId, appIgnored);

    return appIgnored;
  }

  deleteAppIgnored(appId: number, update: Set<SteamAchievement["strID"]>): Set<SteamAchievement["strID"]> {
    const appIgnored = new Set(this._ignored.get(appId) ?? []);

    update.forEach((id) => appIgnored.delete(id));

    this._ignored.set(appId, appIgnored);

    return appIgnored;
  }

  public async load(): Promise<void> {
    const [ignoredTuples, countersTuples] = await Promise.all([
      await localforage.getItem<[number, SteamAchievement["strID"]][]>("ignored"),
      await localforage.getItem<[number, { achieved: number; total: number }][]>("counters"),
    ]);

    this._ignored.clear();
    this._counters.clear();

    if (ignoredTuples) {
      ignoredTuples.forEach(([key, value]) => this._ignored.set(key, new Set(value)));
    }

    if (countersTuples) {
      countersTuples.forEach(([key, value]) => this._counters.set(key, value));
    }
  }

  public async save(): Promise<void> {
    await Promise.all([this.saveIgnored(), this.saveCounters()]);
  }

  public async saveIgnored(): Promise<void> {
    const ignoredTuples = [...this._ignored].map(([key, value]) => [key, [...value]]);

    await localforage.setItem("ignored", ignoredTuples);
  }

  public async saveCounters(): Promise<void> {
    const countersTuples = [...this._counters];

    await localforage.setItem("counters", countersTuples);
  }

  public async clear(): Promise<void> {
    this._ignored.clear();
    this._counters.clear();

    await localforage.clear();
  }
}
