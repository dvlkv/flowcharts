import { createContext } from "preact";

export type LinkerObjectPosition = { startX: number, startY: number, endX: number, endY: number  }
export type LinkerObjectDescriptor = {
  factory: () => LinkerObjectPosition,
  canLinkWith: (obj: LinkerObject) => boolean,
  meta: any
}

export type LinkerObject = LinkerObjectDescriptor & {
  id: string,
  position: LinkerObjectPosition,
  attached: boolean
};

export type ArrowsMutations = {
  useObject: (id: string, obj: LinkerObjectDescriptor | null) => void,
  refresh: (id: string) => void,
  refreshAll: () => void,
  startLinking: (id: string) => void,
  endLinking: (id: string) => void,
  detach: (id: string) => void,
  attach: (id: string) => void,
}

export const LinkerContext = createContext<ArrowsMutations & { linking: LinkerObject | undefined, parent: DOMRect, parentScrollLeft: number } | null>(null);