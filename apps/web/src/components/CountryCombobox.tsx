'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'

/**
 * The country control every public form that writes to Core shares.
 *
 * Core stores ISO 3166-1 alpha-2, so this emits the code and never the typed
 * text: what the reader sees is the country name, what `onChange` and the
 * hidden field carry is `BR`. A name that does not resolve to a country cannot
 * survive a blur, which is the whole point — the field used to be free text on
 * three of these sites and the CRM filled up with 'brasil', 'Brazil ' and 'BRA'.
 *
 * Deliberately dependency-free. Three of the four sites that vendor this file
 * carry no UI library at all, and a combobox is not worth cmdk + Radix in a
 * marketing bundle. The list is styled from CSS custom properties with literal
 * fallbacks, so it inherits each site's theme without needing its Tailwind
 * config.
 *
 * Keep the copies in sync: envisioning.com, signals-strict, brasil, ncb.
 */

export interface CountryOption {
  code: string
  name: string
}

export interface CountryComboboxProps {
  options: CountryOption[]
  /** ISO 3166-1 alpha-2, or '' when nothing is picked yet. */
  value: string
  onChange: (code: string) => void
  id: string
  /** When set, a hidden input carries the code for `FormData` submits. */
  name?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  emptyText?: string
  /** Applied to the visible text input, so each site keeps its own field geometry. */
  className?: string
  style?: React.CSSProperties
  describedBy?: string
  autoComplete?: string
}

/* Lowercase and strip accents on both sides of the comparison. The English list
   has no accented names, but brasil renders the same codes through
   Intl.DisplayNames, so its options are 'Áustria' and 'Butão' and a reader
   typing 'austria' has to find them. The explicit combining range is used
   rather than \p{Diacritic}, which needs a Unicode-mode regex the older Safari
   on venue iPads does not have. */
function fold(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function filterOptions(options: CountryOption[], query: string): CountryOption[] {
  const q = fold(query.trim())
  if (!q) return options

  const exactCode: CountryOption[] = []
  const startsWith: CountryOption[] = []
  const contains: CountryOption[] = []

  for (const option of options) {
    const name = fold(option.name)
    const code = option.code.toLowerCase()
    if (code === q) exactCode.push(option)
    else if (name.startsWith(q)) startsWith.push(option)
    else if (name.includes(q) || code.startsWith(q)) contains.push(option)
  }

  return [...exactCode, ...startsWith, ...contains]
}

export function CountryCombobox({
  options,
  value,
  onChange,
  id,
  name,
  required,
  disabled,
  placeholder = 'Search countries…',
  emptyText = 'No countries found',
  className,
  style,
  describedBy,
  autoComplete = 'country',
}: CountryComboboxProps) {
  const listId = `${useId()}-country-list`
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const selected = useMemo(
    () => options.find((option) => option.code === value) ?? null,
    [options, value],
  )

  const matches = useMemo(
    () => (open ? filterOptions(options, query) : options),
    [open, options, query],
  )

  /* Closed, the input reads as the chosen country. Open, it reads as whatever
     is being typed — an empty box on open, so the whole list is reachable
     without having to clear the previous answer by hand. */
  const shown = open ? query : (selected?.name ?? '')

  /* A pick made elsewhere (a geo default, a reset button, a restored draft)
     has to survive: nothing here caches the label. */
  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  /* Keep the highlighted row on screen while arrowing through 190-odd rows. */
  useEffect(() => {
    if (!open) return
    const row = listRef.current?.children[active] as HTMLElement | undefined
    row?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  /* A click anywhere else commits nothing and closes. Blur alone is not enough:
     the scrollbar of the list takes focus off the input in Firefox. */
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [open])

  function commit(option: CountryOption) {
    onChange(option.code)
    setQuery('')
    setOpen(false)
    inputRef.current?.focus()
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        setActive(0)
        return
      }
      const step = event.key === 'ArrowDown' ? 1 : -1
      const count = matches.length
      if (count) setActive((i) => (i + step + count) % count)
      return
    }
    if (event.key === 'Home' && open) {
      event.preventDefault()
      setActive(0)
      return
    }
    if (event.key === 'End' && open) {
      event.preventDefault()
      setActive(Math.max(0, matches.length - 1))
      return
    }
    if (event.key === 'Enter') {
      /* Only swallow the Enter that is picking a country. With the list shut it
         belongs to the form, and a reader who has already answered should be
         able to submit from this field like any other. */
      if (open && matches[active]) {
        event.preventDefault()
        commit(matches[active])
      }
      return
    }
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      event.stopPropagation()
      setOpen(false)
      setQuery('')
    }
  }

  const listStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 50,
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    maxHeight: 280,
    overflowY: 'auto',
    padding: 4,
    borderRadius: 8,
    border: '1px solid var(--border-2, var(--border, rgba(0,0,0,.15)))',
    background: 'var(--surface, var(--background, #fff))',
    color: 'var(--ink, var(--foreground, inherit))',
    boxShadow: '0 8px 24px rgba(0,0,0,.12)',
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        id={id}
        type='text'
        role='combobox'
        className={className}
        style={style}
        value={shown}
        placeholder={selected && !open ? undefined : placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete='list'
        aria-describedby={describedBy}
        aria-activedescendant={
          open && matches[active] ? `${listId}-${matches[active].code}` : undefined
        }
        /* `required` lives on the hidden field when there is one, so the browser
           reports the missing answer against the value that is actually sent. */
        required={required && !name}
        onChange={(event) => {
          setQuery(event.target.value)
          setActive(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onKeyDown={onKeyDown}
        onBlur={() => {
          /* Typing that never resolved to a country is discarded rather than
             sent. The previous selection, or nothing, is what stands. */
          setQuery('')
        }}
      />

      {name ? (
        <input
          type='hidden'
          name={name}
          value={value}
          required={required}
          /* Hidden inputs are skipped by constraint validation, so a required
             country is enforced by the caller's own submit check. */
        />
      ) : null}

      {open ? (
        <div ref={listRef} id={listId} role='listbox' style={listStyle}>
          {matches.length === 0 ? (
            <div style={{ padding: '8px 10px', fontSize: 14, opacity: 0.65 }}>
              {emptyText}
            </div>
          ) : (
            matches.map((option, index) => {
              const isActive = index === active
              return (
                <div
                  key={option.code}
                  id={`${listId}-${option.code}`}
                  role='option'
                  tabIndex={-1}
                  aria-selected={option.code === value}
                  onMouseEnter={() => setActive(index)}
                  /* mousedown, not click: the input's blur would otherwise fire
                     first and take the row out from under the pointer. */
                  onMouseDown={(event) => {
                    event.preventDefault()
                    commit(option)
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '7px 10px',
                    borderRadius: 6,
                    fontSize: 14,
                    cursor: 'pointer',
                    background: isActive
                      ? 'var(--surface-2, rgba(0,0,0,.06))'
                      : 'transparent',
                  }}
                >
                  <span>{option.name}</span>
                  <span style={{ opacity: 0.5, fontVariantNumeric: 'tabular-nums' }}>
                    {option.code}
                  </span>
                </div>
              )
            })
          )}
        </div>
      ) : null}
    </div>
  )
}

export default CountryCombobox
