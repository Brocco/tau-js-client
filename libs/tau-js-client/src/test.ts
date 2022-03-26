import { interval, OperatorFunction, scan } from 'rxjs';
import { TauMessage } from './lib/messages/message.model';


interval(200)
  .pipe(
    mostRecent()
  )
  .subscribe(queue => console.log(queue.join(', ')));

export function mostRecent<T>(count = 10): OperatorFunction<T, T[]> {
  return scan((all, current) => {
    const temp = [...all, current];
    while (temp.length >= count) {
      temp.shift();
    }
    return temp;
  }, []);
}

/** Chat command to register to tau chat messages */
export interface ChatCommand {
  /** Command to determine to run the command (i.e. "!so") */
  command: string | string[];
  /** Function to be called when the command is triggered */
  handler: (message: TauMessage) => void;
  /** Add security to restrict who can trigger this command */
  canRun?: {
    /** Only the broadcaster */
    broadcaster?: boolean;
    /** Only moderators */
    moderator?: boolean;
    /** Only subscribers */
    subscriber?: boolean;
    /** Only followers */
    follower?: boolean;
  };
  /** Configuration(s) to restrict how often the command can be redeemed */
  cooldowns: {
    /** Time in minutes */
    time: number;
    /** Scoped to a person */
    scopedToPerson: boolean;
  }[];
}
