export const THEME_STORAGE_KEY = "theme";
export type Theme = "light" | "dark";

// Runs before first paint, inlined in <head>. It does two things React can't
// do on a statically generated page:
//
// 1. Stamps data-theme on <html> from the stored choice, falling back to the
//    OS preference. Doing this in an effect would paint the wrong theme first
//    and flash — the reason this is a blocking inline script and not a hook.
// 2. Fixes the `lang` attribute for /pt. Both locales share one root layout,
//    and a root layout can't read the pathname on the server, so the JSX ships
//    lang="en" (correct for `/`, and the right no-JS default) and this
//    corrects it during parse.
//
// Wrapped in try/catch because localStorage throws outright in some privacy
// modes; the catch leaves the designed dark theme in place.
export const THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="dark";}try{if(location.pathname.indexOf("/pt")===0){document.documentElement.lang="pt-BR";}}catch(e){}})();`;
