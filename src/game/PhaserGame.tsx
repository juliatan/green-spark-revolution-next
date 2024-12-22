import { EventBus } from '@/game/EventBus';
import StartGame from '@/game/main';
import { useEffect, useLayoutEffect, useRef } from 'react';

export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

type PhaserGameProps = {
  ref: React.Ref<IRefPhaserGame>;
  currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

export const PhaserGame: React.FC<PhaserGameProps> = ({ ref, currentActiveScene }) => {
    const game = useRef<Phaser.Game | null>(null!);

    useLayoutEffect(() => {
      if (game.current === null) {
        game.current = StartGame('game-container');

        if (typeof ref === 'function') {
          ref({ game: game.current, scene: null });
        } else if (ref) {
          ref.current = { game: game.current, scene: null };
        }
      }

      return () => {
        if (game.current) {
          game.current.destroy(true);
          if (game.current !== null) {
            game.current = null;
          }
        }
      };
    }, [ref]);

    useEffect(() => {
      EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) => {
        if (currentActiveScene && typeof currentActiveScene === 'function') {
          currentActiveScene(scene_instance);
        }

        if (typeof ref === 'function') {
          ref({ game: game.current, scene: scene_instance });
        } else if (ref) {
          ref.current = { game: game.current, scene: scene_instance };
        }
      });
      return () => {
        EventBus.removeListener('current-scene-ready');
      };
    }, [currentActiveScene, ref]);

    return <div id="game-container"></div>;
  }
