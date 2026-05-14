import { describe, it, expect, vi } from 'vitest'

vi.mock('@/services/tmdb', () => ({
  getPosterUrl: (path) => (path ? `https://img/${path}` : null),
}))

vi.mock('@/utils/flowLayout', () => ({
  buildLayout: (movies) => movies.map((_, i) => ({ x: i * 200, y: 0 })),
}))

import { useFlowBuilder } from '../useFlowBuilder'

const mockCollection = {
  parts: [
    { id: 1, title: 'Filme A', release_date: '2010-05-01', poster_path: '/a.jpg' },
    { id: 2, title: 'Filme B', release_date: '2012-03-15', poster_path: '/b.jpg' },
    { id: 3, title: 'Filme C', release_date: '2015-07-22', poster_path: '/c.jpg' },
  ],
}

describe('useFlowBuilder', () => {
  const { buildFlow } = useFlowBuilder()

  it('gera o número correto de nós', () => {
    const { nodes } = buildFlow(mockCollection)
    expect(nodes).toHaveLength(3)
  })

  it('gera N-1 arestas para N filmes', () => {
    const { edges } = buildFlow(mockCollection)
    expect(edges).toHaveLength(2)
  })

  it('ordena filmes por release_date crescente', () => {
    const shuffled = { parts: [...mockCollection.parts].reverse() }
    const { nodes } = buildFlow(shuffled)
    expect(nodes[0].data.title).toBe('Filme A')
    expect(nodes[1].data.title).toBe('Filme B')
    expect(nodes[2].data.title).toBe('Filme C')
  })

  it('filmes sem release_date ficam no final', () => {
    const collection = {
      parts: [
        { id: 1, title: 'Filme A', release_date: '2010-05-01', poster_path: '/a.jpg' },
        { id: 2, title: 'Sem Data', poster_path: '/b.jpg' },
      ],
    }
    const { nodes } = buildFlow(collection)
    expect(nodes[nodes.length - 1].data.title).toBe('Sem Data')
  })

  it('node.data contém tmdbId, title, year, order e status upcoming', () => {
    const { nodes } = buildFlow(mockCollection)
    const first = nodes[0]
    expect(first.data.tmdbId).toBe(1)
    expect(first.data.title).toBe('Filme A')
    expect(first.data.year).toBe('2010')
    expect(first.data.order).toBe(1)
    expect(first.data.status).toBe('upcoming')
  })

  it('order é incremental a partir de 1', () => {
    const { nodes } = buildFlow(mockCollection)
    expect(nodes.map((n) => n.data.order)).toEqual([1, 2, 3])
  })

  it('todas as arestas têm animated: true', () => {
    const { edges } = buildFlow(mockCollection)
    expect(edges.every((e) => e.animated === true)).toBe(true)
  })

  it('retorna 0 arestas para coleção com 1 filme', () => {
    const { edges } = buildFlow({ parts: [mockCollection.parts[0]] })
    expect(edges).toHaveLength(0)
  })

  it('retorna arrays vazios para coleção sem filmes', () => {
    const { nodes, edges } = buildFlow({ parts: [] })
    expect(nodes).toHaveLength(0)
    expect(edges).toHaveLength(0)
  })
})
