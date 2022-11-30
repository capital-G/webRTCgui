export interface Controller {
    name: string;
    value: number;
}

export interface ServerToClientEvents {
    controllers: (controllers: {[id: string] : Controller}) => void;
    changeController: (controller: Controller) => void;
}

export interface ClientToServerEvents {
    getState: () => void;
    getStateController: (name: string) => void;
    registerController: (controller: Controller) => void;
    removeController: (controller: Controller) => void;
    reset: () => void;
    controllerUpdate: (controller: Controller) => void;
    changeController: (controller: Controller) => void;
}

