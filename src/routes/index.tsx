import { createFileRoute } from '@tanstack/react-router'
import { SimpleEditor } from "../components/tiptap-templates/simple/simple-editor";

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <SimpleEditor/>
  )
}
