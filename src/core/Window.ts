import { send } from './nativeApi'
import { SceneContext } from './SceneContext'
import { WindowId, WindowEvent } from './generated'

export class Window {
  rootSurface = 0
  sceneContext: SceneContext

  constructor(private id: WindowId) {
    this.sceneContext = new SceneContext(this.id)
  }

  // use it to make changes to the scene
  // all changes will be batched & sent at the end of this frame
  getSceneContext() {
    return this.sceneContext
  }

  handleEvent(event: WindowEvent) {
    this.sceneContext.events.handleWindowEvent(event)
  }

  setSize(width: number, height: number) {
    // TODO (sync)
  }

  // TODO (sync)
  // show/hide() - explicit and simple to do
  //
  // it's not clear if close() should just call handler so that app can show
  // confirmation or if it should force the close, etc. let's leave it for later
}
