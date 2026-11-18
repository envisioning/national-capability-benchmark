import { z } from 'zod'
import { DimensionEnum } from './schema.js'

/**
 * Posts: dated explainers that open the data to a reader who will not read a
 * table. A post is one file in `data/posts`, written by an agent from facts a
 * `bench post` command computed. Every number a post prints is stored in the
 * file with the dataset version it was read from, so a post is a closed
 * edition: it never changes when the data does. The tags make the posts
 * navigable by country, capability, indicator and kind. See D195.
 */

export const GapDriverSchema = z.object({
  indicatorId: z.string(),
  unit: z.string(),
  value: z.number().nullable(),
  year: z.number().nullable(),
  position: z.number(),
  peerPosition: z.number(),
  contribution: z.number(),
})

export const GapExplanationSchema = z.object({
  iso3: z.string(),
  country: z.string(),
  dimension: DimensionEnum,
  score: z.number(),
  confidence: z.number(),
  peerMedian: z.number(),
  peersScored: z.number(),
  gap: z.number(),
  peers: z.array(z.string()),
  drivers: z.array(GapDriverSchema),
  rowsCounted: z.number(),
  countryArtefacts: z.array(z.string()),
  dimensionArtefacts: z.array(z.string()),
})

/** The kinds of post. A new kind needs a `bench post` generator and a decision entry. */
export const POST_KINDS = ['income-gaps'] as const
export const PostKindEnum = z.enum(POST_KINDS)

export const PostBlock = z.discriminatedUnion('type', [
  /** A paragraph of prose. Every number in it must be one the post stores. */
  z.object({ type: z.literal('text'), text: z.string() }),
  z.object({ type: z.literal('heading'), text: z.string() }),
  /** One gap with its drivers, and the sentence that says why. */
  z.object({ type: z.literal('gap'), gap: GapExplanationSchema, why: z.string() }),
])

export const PostFile = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  kind: PostKindEnum,
  /** The question the post answers, in the reader's words. */
  question: z.string(),
  title: z.string(),
  /** One or two sentences under the title: the answer. */
  dek: z.string(),
  datasetVersion: z.string(),
  /** When the data the post read was generated. */
  dataGeneratedAt: z.string(),
  /** Named figures the prose quotes that no block holds, such as the factor test's share. */
  figures: z.record(z.string(), z.number()),
  tags: z.object({
    countries: z.array(z.string()),
    dimensions: z.array(DimensionEnum),
    indicators: z.array(z.string()),
  }),
  blocks: z.array(PostBlock),
})

export type GapDriver = z.infer<typeof GapDriverSchema>
export type GapExplanation = z.infer<typeof GapExplanationSchema>
export type PostKind = z.infer<typeof PostKindEnum>
export type PostBlock = z.infer<typeof PostBlock>
export type PostFile = z.infer<typeof PostFile>
