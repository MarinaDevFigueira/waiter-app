import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/foods/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/foods/ page"!</div>
}
