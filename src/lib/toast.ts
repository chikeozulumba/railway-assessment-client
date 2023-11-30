import * as notie from 'notie'

type ToastArgs = {
  type?: notie.AlertType
  stay?: boolean
  time?: number
  position?: notie.Position
}

export const Toast = (
  text: string,
  opts: ToastArgs = { position: 'bottom', time: 3 }
) => notie.alert({ ...opts, text })
