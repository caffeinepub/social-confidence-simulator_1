import { useState, useEffect, useCallback } from 'react';
import { useCreateSession, useAddMessage, useEndSession } from './useQueries';
import { analyzeMessage, generateAIResponse, generateTips } from '../lib/analysis';
import type { Message, Scenario } from '../backend';
import { getLocalSession, saveLocalSession, clearLocalSession } from '../lib/persistence';

interface ConversationMetrics {
  confidenceScore: number;
  wpm?: number;
  fillerWords: number;
  hesitations: number;
  tips: string[];
}

export function useConversationSession(scenario: Scenario) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<ConversationMetrics>({
    confidenceScore: 50,
    fillerWords: 0,
    hesitations: 0,
    tips: [],
  });
  const [currentMood, setCurrentMood] = useState<'neutral' | 'confident' | 'anxious' | 'encouraging'>('neutral');
  const [isProcessing, setIsProcessing] = useState(false);

  const createSession = useCreateSession();
  const addMessage = useAddMessage();
  const endSessionMutation = useEndSession();

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      const localSession = getLocalSession();
      if (localSession && localSession.scenario.title === scenario.title) {
        setSessionId(localSession.id);
        setMessages(localSession.messages);
        return;
      }

      try {
        const session = await createSession.mutateAsync(scenario);
        setSessionId(session.id);
        
        // Add initial AI message
        const initialMessage: Message = {
          sender: 'AI',
          content: `Hello! ${scenario.prompt} Let's begin. Tell me a bit about yourself.`,
          time: BigInt(Date.now() * 1000000),
        };
        setMessages([initialMessage]);
        
        saveLocalSession({
          id: session.id,
          scenario,
          messages: [initialMessage],
        });
      } catch (error) {
        console.error('Failed to create session:', error);
      }
    };

    initSession();
  }, [scenario.title]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!sessionId || isProcessing) return;

      setIsProcessing(true);

      try {
        const userMessage: Message = {
          sender: 'User',
          content,
          time: BigInt(Date.now() * 1000000),
        };

        // Add user message
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        // Analyze message
        const analysis = analyzeMessage(content);
        const tips = generateTips(analysis);

        // Update metrics
        setCurrentMetrics({
          confidenceScore: analysis.confidenceScore * 100,
          wpm: analysis.wpm,
          fillerWords: analysis.fillerWords,
          hesitations: analysis.hesitations,
          tips,
        });

        // Update mood
        if (analysis.confidenceScore >= 0.7) {
          setCurrentMood('confident');
        } else if (analysis.confidenceScore >= 0.4) {
          setCurrentMood('neutral');
        } else {
          setCurrentMood('anxious');
        }

        // Save to backend
        await addMessage.mutateAsync({
          sessionId,
          sender: 'User',
          content,
        });

        // Generate AI response
        const aiResponse = generateAIResponse(scenario, updatedMessages);
        const aiMessage: Message = {
          sender: 'AI',
          content: aiResponse,
          time: BigInt(Date.now() * 1000000),
        };

        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);

        await addMessage.mutateAsync({
          sessionId,
          sender: 'AI',
          content: aiResponse,
        });

        setCurrentMood('encouraging');

        // Save to local storage
        saveLocalSession({
          id: sessionId,
          scenario,
          messages: finalMessages,
        });
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        setIsProcessing(false);
      }
    },
    [sessionId, messages, isProcessing, scenario, addMessage]
  );

  const retryLastMessage = useCallback(() => {
    if (messages.length < 2) return;
    
    // Remove last user message and AI response
    const newMessages = messages.slice(0, -2);
    setMessages(newMessages);
    
    saveLocalSession({
      id: sessionId!,
      scenario,
      messages: newMessages,
    });
  }, [messages, sessionId, scenario]);

  const endSession = useCallback(async () => {
    if (!sessionId) return null;

    try {
      const summary = currentMetrics.tips.join('\n');
      await endSessionMutation.mutateAsync({ sessionId, summary });
      clearLocalSession();
      return sessionId;
    } catch (error) {
      console.error('Failed to end session:', error);
      return null;
    }
  }, [sessionId, currentMetrics.tips, endSessionMutation]);

  return {
    session: sessionId ? { id: sessionId, scenario, messages } : null,
    messages,
    currentMetrics,
    currentMood,
    isProcessing,
    sendMessage,
    retryLastMessage,
    endSession,
  };
}
