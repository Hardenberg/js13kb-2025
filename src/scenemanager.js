export function SceneManager() {
    let scenes = {}, current;
    return {
      add: (n, s) => scenes[n] = s,
      show: n => (current = scenes[n])?.onEnter?.(),
      update: () => current?.update?.(),
      render: () => current?.render?.(),
      getCurrent: () => current
    };
  }