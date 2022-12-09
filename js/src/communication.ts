export interface SliderController {
  name: string
  value: number
  max: number
  min: number
  type: "slider"
}

export interface ButtonController {
  name: string
  value: number
  type: "button"
}

export interface TextController {
  name: string
  value: string
  type: "text"
}

export type Controller = SliderController | ButtonController | TextController;

export interface ServerToClientEvents {
  controllers: (controllers: { [id: string]: Controller }) => void
  changeController: (controller: Controller) => void
}

export interface ClientToServerEvents {
  getState: () => void
  getStateController: (name: string) => void
  registerController: (controller: Controller) => void
  removeController: (controller: Controller) => void
  reset: () => void
  controllerUpdate: (controller: Controller) => void
  changeController: (controller: Controller) => void
}
