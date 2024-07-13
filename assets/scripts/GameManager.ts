import { _decorator, Component, Node, resources, SpriteFrame } from 'cc';
import { CurrencyManager } from './CurrencyManager';
const { ccclass, property } = _decorator;



@ccclass('GameManager')
export class GameManager extends Component {

  private heroesData = {};
  private startingCurrency: number = 0;
  private buildingsData = {};
  private createdHeroe = {};

  @property([SpriteFrame])
  public spriteArrayCharacters: SpriteFrame[] = [];
  @property([SpriteFrame])
  public spriteArraytypes: SpriteFrame[] = [];
  @property([SpriteFrame])
  public spriteArrayRanks: SpriteFrame[] = [];

  private heroesPortraits: { [key: string]: SpriteFrame } = {};
  private typeIcons: { [key: string]: SpriteFrame } = {};
  private rankIcons: { [key: string]: SpriteFrame } = {};
  private currrencyManager: CurrencyManager;


  onLoad() {
    this.loadInitialState();
    this.currrencyManager = this.getComponent(CurrencyManager)
  }

  loadInitialState() {
    resources.load("settings/initial_state", (err, jsonAsset) => {
      if (err) {
        console.error("Failed to load JSON:", err);
        return;
      }
      const jsonData = jsonAsset.json;
      this.currrencyManager.setCurrency(jsonData.state.currency)
    });

    resources.load("settings/heroes", (err, jsonAsset) => {
      if (err) {
        console.error("Failed to load JSON:", err);
        return;
      }
      jsonAsset.json.heroes.forEach((element) => {
        this.heroesData[element.id] = element;
      });

      resources.load("settings/buildings", (err, jsonAsset) => {
        if (err) {
          console.error("Failed to load JSON:", err);
          return;
        }
        jsonAsset.json.buildings.forEach((element) => {
          this.buildingsData[element.id] = element;
        });
      })
      this.loadAssets();


    });
  }

  loadAssets() {
    const heroKeys = ["hero_1", "hero_2", "hero_3", "hero_4", "hero_5", "hero_6"];
    this.spriteArrayCharacters.forEach((key, index) => {
      this.heroesPortraits[heroKeys[index]] = key;
    })
    const typeKeys = ["earth", "fire", "water", "wind"];
    this.spriteArraytypes.forEach((key, index) => {
      this.typeIcons[typeKeys[index]] = key;
    })
    const rankKeys = ["s", "a", "b", "c", "d"];
    this.spriteArrayRanks.forEach((key, index) => {
      this.rankIcons[rankKeys[index]] = key;
    })
    heroKeys.forEach((key, index) => {
      var hero = this.heroesData[key];
      hero.rankIcon = this.rankIcons[hero.rank];
      hero.typeIcon = this.typeIcons[hero.type];
      hero.portrait = this.heroesPortraits[key];
    })
  }

  // getHeroData(id: string) {
  //   var hero = this.heroesData[id];
  //   hero.rankIcon = this.rankIcons[hero.rank];
  //   hero.typeIcon = this.typeIcons[hero.type];
  //   hero.portrait = this.heroesPortraits[id];
  //   return hero;
  // }

  getHeroes() {
    return this.heroesData;
  }
}


