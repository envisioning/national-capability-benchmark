import { Fragment } from 'react'

/**
 * `fill` from the lexicon layer, with nodes instead of strings. A translated
 * sentence keeps its own word order and the entities inside it become links.
 * Unknown placeholders stay visible, exactly as in the string version.
 */
export function fillNodes(
  template: string,
  values: Record<string, React.ReactNode>,
): React.ReactNode {
  return template.split(/(\{\w+\})/g).map((part, i) => {
    const key = /^\{(\w+)\}$/.exec(part)?.[1]
    return key !== undefined && key in values ? (
      <Fragment key={i}>{values[key]}</Fragment>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  })
}

/** Join nodes the way a list joins strings, without flattening them to text. */
export function joinNodes(items: React.ReactNode[], separator = ', '): React.ReactNode {
  return items.map((item, i) => (
    <Fragment key={i}>
      {i > 0 ? separator : null}
      {item}
    </Fragment>
  ))
}
