interface ControllerBase {
  id: string
}

export interface ControllerColor {
  r: number
  g: number
  b: number
  a: number
}

export interface VLayoutController extends ControllerBase {
  controllers: Array<Controller>
  value: "noValue"
  type: "v-layout"
}

export interface HLayoutController extends ControllerBase {
  controllers: Array<Controller>
  value: "noValue"
  type: "h-layout"
}

export interface SliderController extends ControllerBase {
  name: string
  value: number
  max: number
  min: number
  type: "slider"
}

interface ButtonState {
  text: string
  color: ControllerColor
  backgroundColor: ControllerColor
}

export interface ButtonController extends ControllerBase {
  states: Array<ButtonState>
  value: number // curState
  type: "button"
}

export interface TextController extends ControllerBase {
  name: string
  value: string
  type: "text"
  monospace: boolean
}

export type Controller =
  SliderController
  | ButtonController
  | TextController
  | VLayoutController
  | HLayoutController;

export interface ServerToClientEvents {
  setLayout: (controller: Controller) => void
  updateController: (controller: Controller) => void
}

export interface ClientToServerEvents {
  getLayout: () => void
  setLayout: (controller: Controller) => void
  updateController: (controller: Controller) => void
}
