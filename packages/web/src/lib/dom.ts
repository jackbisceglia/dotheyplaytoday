export const setHidden = (element: HTMLElement, isHidden: boolean) => {
  element.hidden = isHidden;
  element.style.display = isHidden ? "none" : "";
};
