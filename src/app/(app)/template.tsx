// Re-mounts on every navigation (that's what a template is for), giving each
// page a subtle fade/rise entrance. Pure CSS animation — no client JS, no
// layout shift, and disabled under prefers-reduced-motion (see globals.css).
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return <div className="tome-page-enter">{children}</div>
}
