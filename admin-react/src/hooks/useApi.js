import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api.js'

// ── Dashboard Metrics ─────────────────────────────────────
export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard/metrics')
      return data.data
    },
    staleTime: 30_000,
    retry: 1,
  })
}

// ── Scraper Health (30s auto-refresh) ────────────────────
export function useScraperHealth() {
  return useQuery({
    queryKey: ['scrapers'],
    queryFn: async () => {
      const { data } = await api.get('/admin/scrapers')
      return data.data
    },
    refetchInterval: 30_000,
    retry: 1,
  })
}

// ── Trigger Scraper ───────────────────────────────────────
export function useTriggerScraper() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (botName) => {
      const { data } = await api.post(`/admin/scrapers/trigger/${encodeURIComponent(botName)}`)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['scrapers'] }),
  })
}

// ── Pending Deals ────────────────────────────────────────
export function usePendingDeals() {
  return useQuery({
    queryKey: ['deals', 'pending'],
    queryFn: async () => {
      const { data } = await api.get('/admin/deals/pending')
      return data.data
    },
    retry: 1,
  })
}

// ── Update Deal Status ────────────────────────────────────
export function useUpdateDealStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await api.patch(`/admin/deals/${id}/status`, { status })
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deals'] }),
  })
}

// ── Complaints ────────────────────────────────────────────
export function useComplaints(sector = '', status = '') {
  return useQuery({
    queryKey: ['complaints', sector, status],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (sector) params.append('sector', sector)
      if (status) params.append('status', status)
      const { data } = await api.get(`/admin/complaints?${params}`)
      return data.data
    },
    retry: 1,
  })
}

// ── Complaint Stats ───────────────────────────────────────
export function useComplaintStats() {
  return useQuery({
    queryKey: ['complaints', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/complaints/stats')
      return data.data
    },
    retry: 1,
  })
}

// ── Resolve Complaint ─────────────────────────────────────
export function useResolveComplaint() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, adminResponse }) => {
      const { data } = await api.patch(`/admin/complaints/${id}/resolve`, { adminResponse })
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['complaints'] })
    },
  })
}

// ── Suspend / Unsuspend User ──────────────────────────────
export function useSuspendUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await api.post(`/admin/complaints/users/${userId}/suspend`)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['complaints'] })
      qc.invalidateQueries({ queryKey: ['complaints', 'stats'] })
    },
  })
}

// ── Offer Matrix ──────────────────────────────────────────
export function useOfferMatrix() {
  return useQuery({
    queryKey: ['offer-matrix'],
    queryFn: async () => {
      const { data } = await api.get('/admin/offer-matrix')
      return data.data
    },
    retry: 1,
  })
}

// ── Update Offer Matrix Setting ───────────────────────────
export function useUpdateOfferMatrix() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, discountPercentage, validityDays }) => {
      const { data } = await api.put(`/admin/offer-matrix/${id}`, { discountPercentage, validityDays })
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['offer-matrix'] }),
  })
}

// ── Toggle Offer Matrix Active ────────────────────────────
export function useToggleOfferMatrix() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch(`/admin/offer-matrix/${id}/toggle`)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['offer-matrix'] }),
  })
}

// ── Affiliates ────────────────────────────────────────────
export function useAffiliates() {
  return useQuery({
    queryKey: ['affiliates'],
    queryFn: async () => {
      const { data } = await api.get('/admin/affiliates')
      return data.data
    },
    retry: 1,
  })
}

export function useToggleAffiliate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch(`/admin/affiliates/${id}/toggle`)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['affiliates'] }),
  })
}

export function useUpdateAffiliate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...body }) => {
      const { data } = await api.put(`/admin/affiliates/${id}`, body)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['affiliates'] }),
  })
}

export function useCreateAffiliate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body) => {
      const { data } = await api.post('/admin/affiliates', body)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['affiliates'] }),
  })
}

export function useDeleteAffiliate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/admin/affiliates/${id}`)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['affiliates'] }),
  })
}
