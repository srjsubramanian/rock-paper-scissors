import { from, map } from "rxjs";
import {
  EventObject,
  StateTypes,
  Interpreter,
  ResolveTypegenMeta,
  TypegenDisabled,
  BaseActionObject,
  ServiceMap,
} from "xstate";
import { IEventPublisher } from "./infra-types";

abstract class StatefulEntity<
  ContextType,
  EventObjectType extends EventObject,
  StateType extends StateTypes
> {
  protected abstract getStateChangeEventType(): string;
  protected abstract getMachineToTrack(): Interpreter<
    ContextType,
    any,
    EventObjectType,
    { value: StateType; context: ContextType },
    ResolveTypegenMeta<
      TypegenDisabled,
      EventObjectType,
      BaseActionObject,
      ServiceMap
    >
  >;
  constructor(
    protected readonly _id: string,
    protected readonly stateEventsChannel?: IEventPublisher
  ) {}
  public get id() {
    return this._id;
  }
  protected setupPublisher() {
    if (this.stateEventsChannel && this.getMachineToTrack()) {
      from(this.getMachineToTrack()).pipe(
        map((stateNode) => {
          this.stateEventsChannel?.publish({
            type: this.getStateChangeEventType(),
            data: {
              id: this._id,
              state: stateNode.value,
              context: stateNode.context,
            },
          });
        })
      );
    }
    return this;
  }
}

export { StatefulEntity };
