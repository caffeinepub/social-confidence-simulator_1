import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Session, Progress, UserProfile, Scenario } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetScenarios() {
  const { actor, isFetching } = useActor();

  return useQuery<Scenario[]>({
    queryKey: ['scenarios'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getScenarios();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProgressStats() {
  const { actor, isFetching } = useActor();

  return useQuery<Progress>({
    queryKey: ['progressStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProgressStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSessionHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<Session[]>({
    queryKey: ['sessionHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSessionHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSessionById(sessionId: string) {
  const { data: sessions } = useGetSessionHistory();

  return useQuery<Session | undefined>({
    queryKey: ['session', sessionId],
    queryFn: () => {
      return sessions?.find((s) => s.id === sessionId);
    },
    enabled: !!sessions,
  });
}

export function useCreateSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scenario: Scenario) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSession(scenario);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionHistory'] });
      queryClient.invalidateQueries({ queryKey: ['progressStats'] });
    },
  });
}

export function useAddMessage() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      sessionId,
      sender,
      content,
    }: {
      sessionId: string;
      sender: string;
      content: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMessage(sessionId, sender, content);
    },
  });
}

export function useEndSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, summary }: { sessionId: string; summary: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.endSession(sessionId, summary);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionHistory'] });
      queryClient.invalidateQueries({ queryKey: ['progressStats'] });
    },
  });
}
