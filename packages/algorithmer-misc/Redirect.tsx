import { memo } from "preact/compat";
import { useEffect } from "preact/hooks";
import { route } from "preact-router";

export const Redirect = memo(({ to }: { to: string, default: boolean }) => {
  useEffect(() => {
    route(to);
  });

  return null;
});